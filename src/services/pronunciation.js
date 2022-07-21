import request from "@/utils/request";

/**
 * PN0102 创建新的语音
 * @param pronunciation 发音
 * @returns {Promise | Promise<unknown>}
 */
export async function createPronunciation(pronunciation) {
  return request.post("/pronunciation", {
    pronunciation: pronunciation,
  })
}

/**
 * PN0201 获取所有的语音
 * @param filter 过滤条件
 * @returns {Promise<unknown>}
 */
export async function getPronunciations(filter) {
  const res = await request.get(`/pronunciation`, filter)
  return res.pronunciation
}
