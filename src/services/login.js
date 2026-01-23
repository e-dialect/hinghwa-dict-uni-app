import { toIndexPage } from '@/routers';
import { toMePage } from '@/routers/user';
import { toLoginPage } from '@/routers/login';
import rawRequest from '../utils/rawRequest';

// 导入base64 polyfill用于WeChat miniprogram环境
const b64ch = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const b64chs = [...b64ch];

/**
 * polyfill version of `btoa` for WeChat miniprogram
 * eslint规则在此处禁用因为base64编码需要位运算
 */
/* eslint-disable no-plusplus, no-bitwise, no-mixed-operators */
function btoaPolyfill(bin) {
  let u32; let c0; let c1; let c2; let asc = '';
  const pad = bin.length % 3;
  for (let i = 0; i < bin.length;) {
    c0 = bin.charCodeAt(i++);
    c1 = bin.charCodeAt(i++);
    c2 = bin.charCodeAt(i++);
    if (c0 > 255 || c1 > 255 || c2 > 255) {
      throw new TypeError('invalid character found');
    }
    u32 = (c0 << 16) | (c1 << 8) | c2;
    asc += b64chs[(u32 >> 18) & 63]
      + b64chs[(u32 >> 12) & 63]
      + b64chs[(u32 >> 6) & 63]
      + b64chs[u32 & 63];
  }
  return pad ? asc.slice(0, pad - 3) + '==='.substring(pad) : asc;
}
/* eslint-enable no-plusplus, no-bitwise, no-mixed-operators */

/**
 * 加载用户信息到 app.globalData
 */
export async function loadUserInfo() {
  const id = uni.getStorageSync('id');
  if (!id) {
    return;
  }
  const app = getApp();
  await rawRequest.get(`/users/${id}`).then((res) => {
    app.globalData.userInfo = res.user;
    app.globalData.publish_articles = res.publish_articles;
    app.globalData.publish_comments = res.publish_comments;
    app.globalData.like_articles = res.like_articles;
    app.globalData.contribution = res.contribution;
    app.globalData.id = res.user.id;
  });
}

export async function afterLogin(res) {
  uni.showToast({
    title: '登录成功',
    icon: 'success',
  });
  uni.setStorageSync('token', res.token);
  uni.setStorageSync('id', res.id);
  await loadUserInfo();
  // #ifdef H5
  toIndexPage(true);
  // #endif
  // #ifndef H5
  toMePage();
// #endif
}

/**
 * 小程序一键登录
 */
/**
 * 生成安全的随机密码
 */
function generateSecurePassword(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let password = '';
  for (let i = 0; i < length; i += 1) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

/**
 * 简单加密密码（实际应用中应使用更安全的加密）
 */
function encryptPassword(password) {
  // 这里使用简单的base64编码，实际应使用更安全的加密
  // 使用polyfill以支持WeChat miniprogram环境
  return btoaPolyfill(password);
}

/**
 * 使用微信 code 进行一键注册
 */
async function registerWithWechatCode(code) {
  // 自动生成用户名和密码
  const username = `wx_${generateSecurePassword(8)}`;
  const password = generateSecurePassword(16);

  // 不再调用 uni.getUserProfile（小程序基础库限制），只提交必需字段
  // 发送注册请求（仅必填项）
  return rawRequest.post('/users/wechat/register', {
    jscode: code,
    username,
    password,
  })
    .then(async (res) => {
      // 保存凭证（加密存储）
      uni.setStorageSync('username', username);
      uni.setStorageSync('password', encryptPassword(password));
      await afterLogin(res);
      return res;
    })
    .catch((err) => {
      // 不在此处直接弹窗，保留原行为：提示给用户
      uni.showToast({
        title: err.data && err.data.msg ? err.data.msg : (err.msg || '注册失败'),
        icon: 'none',
      });
      throw err;
    });
}

export async function mpLogin() {
  // #ifdef H5
  toLoginPage();
  // #endif

  // #ifndef H5
  uni.login({
    // 尝试调用登录接口成功
    success: (res) => {
      // 如果没有获取到微信的 code 直接使用普通登录
      if (!res.code) {
        toLoginPage();
        return;
      }
      // 尝试进行微信登录
      rawRequest.post(
        '/login/wechat',
        {
          jscode: res.code,
        },
        true,
      )
        .then(async (res2) => {
          await afterLogin(res2);
        })
        .catch((err) => {
          switch (err.statusCode) {
            case 404:
              uni.showModal({
                content: '当前微信未绑定账号，是否一键注册？',
                success(modalRes) {
                  if (modalRes.confirm) {
                    // jscode 是一次性凭证，之前用于登录尝试已可能被后端消费，
                    // 因此再次调用 uni.login() 获取新的 code 用于注册。
                    uni.login({
                      success: (res2) => {
                        if (!res2.code) {
                          uni.showToast({ title: '获取微信授权失败', icon: 'none' });
                          return;
                        }
                        // 使用新的 code 进行注册
                        registerWithWechatCode(res2.code);
                      },
                      fail() {
                        uni.showToast({ title: '获取微信授权失败', icon: 'none' });
                      },
                    });
                  } else {
                    // 跳转到普通登录页面
                    toLoginPage();
                  }
                },
              });
              break;
            default:
              uni.showToast({
                title: err.data.msg || '登录失败',
              });
          }
        });
    },
    // 尝试调用登录接口失败
    fail() {
      // 跳转到账号密码登录页面
      toLoginPage();
    },
  });
  // #endif
}

/**
 * 账号密码登录
 * @param username 用户名
 * @param password 密码
 */
export async function normalLogin(username, password) {
  if (!username) {
    uni.showToast({
      title: '请输入用户名',
      icon: 'error',
    });
    return;
  }
  if (!password) {
    uni.showToast({
      title: '请输入密码',
      icon: 'error',
    });
    return;
  }
  rawRequest.post('/login', {
    username,
    password,
  }, true).then(async (res) => {
    await afterLogin(res);
  }).catch((err) => {
    switch (err.statusCode) {
      case 401:
        uni.showToast({
          title: err.data.msg || '用户名或密码错误',
          icon: 'error',
        });
        break;
      default:
        uni.showToast({
          title: err.data.msg || '登录失败',
        });
    }
  });
}

/**
 * 更新 Token 并登录
 * @returns {Promise<boolean>} 是否登录成功
 */
export async function getLoginStatus() {
  let flag = false;
  await rawRequest.put('/login', {}).then(async (res) => {
    uni.setStorageSync('token', res.token);
    uni.setStorageSync('id', res.id);
    await loadUserInfo();
    flag = true;
  }).catch((err) => {
    switch (err.statusCode) {
      case 401:
        if (!uni.getStorageSync('token')) break;
        uni.removeStorageSync('token');
        uni.removeStorageSync('id');
        uni.showToast({
          title: err.data.msg || '登录已过期，请重新登录',
          icon: 'error',
        });
        break;
      default:
        break;
    }
  });
  return flag;
}

export function getLoginStatusSync() {
  return !!(uni.getStorageSync('token'));
}
