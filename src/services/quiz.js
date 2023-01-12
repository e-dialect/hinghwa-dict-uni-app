import request from "@/utils/request";

/**
 * QZ0101 获取单个测试
 * @param id 测试id
 * @returns {Promise<unknown>}
 */
export async function getQuiz(id) {
  return request.get(`/quizzes/${id}`)
}

/**
 * QZ0201 搜索指定的测试
 * @param key 搜索关键词
 * @returns {Promise<unknown>}
 */
export async function searchQuiz(key) {
  return await request.get(`/quizzes`, {keywords: key})
}

/**
 * QZ0202 获取随机的测试
 * @returns {Promise<unknown>}
 */
export async function getRandomQuiz() {
  return request.get(`/quizzes/random`)
}

/**
 * QZ0203 测试题组卷
 * @param number 试卷总题数
 * @returns {Promise<unknown>}
 */
export async function getTestPaper(number) {
  return request.get(`/quizzes/paper`, {number: number})
}
