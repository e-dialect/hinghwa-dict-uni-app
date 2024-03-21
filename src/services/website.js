import request from '@/utils/request';
import { getWordDetails } from '@/services/word';

/**
 * WS01 发送邮箱验证码
 * @returns {Promise<unknown>}
 */
export async function sendEmailCode(email) {
  return request.post('/website/email', { email });
}

/**
 * WS03 公告文章列表
 * @returns {Promise<unknown>}
 */
export async function getAnnouncements() {
  return (await request.get('/website/announcements')).announcements;
}

/**
 * WS04 获取热门文章列表
 * @returns {Promise<unknown>}
 */
export async function getHotArticles() {
  return request.get('/website/hot_articles');
}

/**
 * WS05 获取每日一词
 * @returns {Promise<void>}
 */
export async function getWordOfTheDay() {
  try {
    const res = await request.get('/website/word_of_the_day');
    return await getWordDetails(res.word_of_the_day.id);
  } catch (e) {
    return null;
  }
}

/**
 * WS0701 批量获取日常用语
 * @param keyword 关键词
 * @param page 页码
 * @param pageSize 每页数量
 * @returns {Promise<void>}
 */
export async function getDailyExpressions(keyword = '', page = 1, pageSize = 10) {
  return request.get('/website/daily-expression', { keyword, page, pageSize });
}

/**
 * 获取单个题目
 * @param question 题目
 * @param options 选项
 * @param answer 回答
 * @param explanation 解释
 * @param id 题目序号
 * @param visibility 是否可见
 *
 */
/* export async function getOneQuiz(question, options, answer, explanation, id, visibility) {
  return request.get('/quizzes/{id}', {
    question, options, answer, explanation, id, visibility,
  });
} */
