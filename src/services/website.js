import request          from "@/utils/request";
import {getWordDetails} from "@/services/word";

/**
 * WS01 发送邮箱验证码
 * @returns {Promise<unknown>}
 */
export async function sendEmailCode(email) {
    return request.post(`/website/email`,{email: email}).then(()=>{
        uni.showToast({
            title: '验证码已发送'
        })
    })
}

/**
 * WS03 公告文章列表
 * @returns {Promise<unknown>}
 */
export async function getAnnouncements() {
    return (await request.get(`/website/announcements`)).announcements
}

/**
 * WS04 获取热门文章列表
 * @returns {Promise<unknown>}
 */
export async function getHotArticles() {
    return request.get(`/website/hot_articles`)
}

/**
 * WS05 获取每日一词
 * @returns {Promise<void>}
 */
export async function getWordOfTheDay(){
    try {
        let res = await request.get(`/website/word_of_the_day`)
        return await getWordDetails(res.word_of_the_day.id)
    } catch (e) {
        return null
    }
}
