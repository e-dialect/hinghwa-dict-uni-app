import { toIndexPage, toLoginPage, toMePage } from '@/routers';
import { getUserInfo } from '@/services/user';
import request from '../utils/request';

/**
 * 小程序一键登录
 */
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
      request.post(
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
            case 404: {
              uni.showModal({
                content: err.data.msg || '当前用户未注册或未绑定微信',
                showCancel: false,
                success() {
                  // 跳转到普通登录页面
                  toLoginPage();
                },
              });
              break;
            }
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
  request.post('/login', {
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
    }
  });
}

async function afterLogin(res) {
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
 * 更新 Token 并登录
 * @returns {Promise<boolean>} 是否登录成功
 */
export async function getLoginStatus() {
  let flag = false;
  await request.put('/login', {}, true).then(async (res) => {
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
    }
  });
  return flag;
}

/**
 * 加载用户信息到 app.globalData
 * @returns {Promise<null>}
 */
export async function loadUserInfo() {
  const id = uni.getStorageSync('id');
  if (!id) {
    return null;
  }
  const app = getApp();
  await getUserInfo(id).then((res) => {
    app.globalData.userInfo = res.user;
    app.globalData.publish_articles = res.publish_articles;
    app.globalData.publish_comments = res.publish_comments;
    app.globalData.like_articles = res.like_articles;
    app.globalData.contribution = res.contribution;
    app.globalData.id = res.user.id;
  });
}

/**
 * 清理登录状态
 */
export function clearUserInfo() {
  uni.clearStorageSync();
  const app = getApp();
  app.globalData.remove('userInfo');
  app.globalData.remove('publish_articles');
  app.globalData.remove('publish_comments');
  app.globalData.remove('like_articles');
  app.globalData.remove('contribution');
  app.globalData.remove('id');
}

/**
 * 通过用户名获取账号关联邮箱
 * @param username 用户名
 * @returns {Promise<unknown>}
 */
export function getEmailByUsername(username) {
  return request.get('/login/forget', { username });
}

export function resetPassword(username, password, email, code) {
  return request.put('/login/forget', {
    username, password, email, code,
  });
}
