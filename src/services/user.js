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
export async function changeUserInfo(id , userInfo) {
    return request.put(`/users/${id}`,{user: userInfo})
}

/**
 * US0302 更新用户密码
 * @param id 用户id
 * @param old_password 旧密码
 * @param new_password 新密码
 * @returns {Promise<unknown>}
 */
export async function changeUserPassword(id , old_password , new_password) {
    return request.put(`/users/${id}/password`,{oldpassword: old_password, newpassword: new_password})
}

/**
 * US0303 更新用户邮箱
 * @param id 用户id
 * @param email 邮箱
 * @param code 验证码
 * @returns {Promise<unknown>}
 */
export async function changeUserEmail(id , email , code) {
    return request.put(`/users/${id}/email`,{email: email, code: code})
}

/**
 * US0304 绑定微信
 * @param id 用户id
 * @param jscode 微信code
 * @returns {Promise<unknown>}
 */
export async function bindingWechat(id , jscode) {
    return request.put(`/users/${id}/wechat`,{jscode: jscode})
}

/**
 * US0305 取消绑定微信
 * @param id 用户id
 * @returns {Promise<unknown>}
 */
export async function cancelBindingWechat(id) {
    return request.del(`/users/${id}/wechat`)
}