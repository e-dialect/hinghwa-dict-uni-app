import request from "@/utils/request";

/**
 * QZ0101 获取单个测试
 * @param id 测试id
 * @returns {Promise<unknown>}
 */
export async function getQuiz() {
  return request.get(`http://127.0.0.1:4523/m1/404238-0-default/quizzes/1`)
}

/**
 * QZ0201 搜索指定的测试
 * @param key 搜索关键词
 * @returns {Promise<unknown>}
 */
export async function searchQuiz(key) {
  return await request.get(`http://127.0.0.1:4523/m1/404238-0-default/quizzes`, {keywords: key})
}

/**
 * QZ0202 获取随机的测试
 * @returns {Promise<unknown>}
 */
export async function getRandomQuiz() {
  return request.get(`http://127.0.0.1:4523/m1/404238-0-default/quizzes/random`)
}