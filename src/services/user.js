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
 * @param oldpassword 旧密码
 * @param newpassword 新密码
 * @returns {Promise<unknown>}
 */
export async function changeUserPassword(id , oldpassword , newpassword) {
    return request.put(`/users/${id}/password`,{oldpassword: oldpassword, newpassword: newpassword})
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