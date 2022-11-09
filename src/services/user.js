import request from "@/utils/request";

/**
 * US0201 获取指定用户信息
 * @param id 用户id
 * @returns {Promise<unknown>}
 */
export async function getUserInfo(id) {
    return request.get(`/users/${id}`)
}