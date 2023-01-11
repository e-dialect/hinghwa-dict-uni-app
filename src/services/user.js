import request from "@/utils/request";

/**
 * US0201 获取指定用户信息
 * @param id 用户id
 * @returns {Promise<unknown>}
 */
export async function getUserInfo(id) {
  return request.get(`/users/${id}`)
}

/**
 * US0301 更新用户信息（除password和email外）
 * @param id 用户id
 * @returns {Promise<unknown>}
 */
export async function changeUserInfo(id, userInfo) {
  return request.put(`/users/${id}`, {user: userInfo})
}

/**
 * US0302 更新用户密码
 * @param id 用户id
 * @param old_password 旧密码
 * @param new_password 新密码
 * @returns {Promise<unknown>}
 */
export async function changeUserPassword(id, old_password, new_password) {
  return request.put(`/users/${id}/password`, {oldpassword: old_password, newpassword: new_password})
}

/**
 * US0303 更新用户邮箱
 * @param id 用户id
 * @param email 邮箱
 * @param code 验证码
 * @returns {Promise<unknown>}
 */
export async function changeUserEmail(id, email, code) {
  return request.put(`/users/${id}/email`, {email: email, code: code})
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
          icon: 'error'
        })
      }
      await request.put(`/users/${id}/wechat`, {jscode: res.code, overwrite}).then(() => {
        uni.showToast({
          title: '绑定成功'
        });
      }).catch(err => {
        uni.showToast({
          title: err.msg,
          icon: 'none'
        })
      });
    }
  });
  return
}

/**
 * US0305 取消绑定微信
 * @param id 用户id
 * @returns {Promise<unknown>}
 */
export async function cancelBindingWechat(id) {
  return request.del(`/users/${id}/wechat`).then(() => {
    uni.showToast({
      title: '解除绑定成功！'
    });
  }).catch(err => {
    uni.showToast({
      title: err.msg,
      icon: 'none'
    })
  })
}
