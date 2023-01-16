import request from '@/utils/request';

/**
 * US0101 新建用户（普通）
 * @returns {Promise<unknown>}
 */
export async function registerUser(username, password, email, code) {
  return request.post('/users', {
    username, password, email, code,
  });
}

/**
 * US0102 新建用户（微信）
 * @param username 用户名
 * @param password 密码
 * @param nickname 昵称
 * @param avatar 头像
 */
export function registerWechatUser(username, password, nickname, avatar) {
  uni.login({
    async success(res) {
      if (res.code) {
        await request.post('/users/wechat/register', {
          username,
          password,
          jscode: res.code,
          nickname,
          avatar,
        }).then(async () => {
          uni.showToast({
            title: '注册成功',
          });
          uni.navigateBack({
            delta: 1,
          });
        });
      } else {
        uni.showToast({
          title: '当前平台不支持',
        });
      }
    },
  });
}

/**
 * US0201 获取指定用户信息
 * @param id 用户id
 * @returns {Promise<unknown>}
 */
export async function getUserInfo(id) {
  return request.get(`/users/${id}`);
}

/**
 * US0301 更新用户信息（除password和email外）
 * @param id 用户id
 * @returns {Promise<unknown>}
 */
export async function changeUserInfo(id, userInfo) {
  return request.put(`/users/${id}`, { user: userInfo }).then((res) => {
    uni.setStorageSync('token', res.token);
    uni.showToast({
      title: '修改成功',
    });
  });
}

/**
 * US0302 更新用户密码
 * @param id 用户id
 * @param oldPassword 旧密码
 * @param newPassword 新密码
 * @returns {Promise<unknown>}
 */
export async function changeUserPassword(id, oldPassword, newPassword) {
  return request.put(`/users/${id}/password`, { oldpassword: oldPassword, newpassword: newPassword });
}

/**
 * US0303 更新用户邮箱
 * @param id 用户id
 * @param email 邮箱
 * @param code 验证码
 * @returns {Promise<unknown>}
 */
export async function changeUserEmail(id, email, code) {
  return request.put(`/users/${id}/email`, { email, code });
}

/**
 * US0304 绑定微信
 * @param id{number} 用户id
 * @param overwrite{boolean} 是否覆盖
 * @returns {Promise<unknown>}
 */
export async function bindingWechat(id, overwrite) {
  await uni.login({
    async success(res) {
      if (!res.code) {
        uni.showToast({
          title: '获取账号失败',
          icon: 'error',
        });
      }
      await request.put(`/users/${id}/wechat`, { jscode: res.code, overwrite }).then(() => {
        uni.showToast({
          title: '绑定成功',
        });
      }).catch((err) => {
        uni.showToast({
          title: err.msg,
          icon: 'none',
        });
      });
    },
  });
}

/**
 * US0305 取消绑定微信
 * @param id 用户id
 * @returns {Promise<unknown>}
 */
export async function cancelBindingWechat(id) {
  return request.del(`/users/${id}/wechat`).then(() => {
    uni.showToast({
      title: '解除绑定成功！',
    });
  }).catch((err) => {
    uni.showToast({
      title: err.msg,
      icon: 'none',
    });
  });
}

/**
 * 清理登录状态
 */
export function clearUserInfo() {
  uni.clearStorageSync();
  const app = getApp();
  delete app.globalData.userInfo;
  delete app.globalData.publish_articles;
  delete app.globalData.publish_comments;
  delete app.globalData.like_articles;
  delete app.globalData.contribution;
  delete app.globalData.id;
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
