import request from "@/utils/request";

/**
 * WS01 发送邮箱验证码
 * @returns {Promise<unknown>}
 */
export async function sendEmailCode(email) {
    return request.post(`/website/email`,{email: email})
}

/**
 * WS03 公告文章列表
 * @param id 文章id
 * @returns {Promise<unknown>}
 */
export async function getArticle(id) {
    return request.get(`/articles/${id}`)
}

/**
 * WS04 获取热门文章列表
 * @returns {Promise<unknown>}
 */
export async function getHotArticles() {
    return request.get(`/website/hot_articles`)
}