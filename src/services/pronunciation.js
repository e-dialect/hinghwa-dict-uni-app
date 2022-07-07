import request from "@/utils/request";

/**
 * PN0102 创建新的语音
 * @param pronunciation 发音
 * @returns {Promise | Promise<unknown>}
 */
export function createPronunciation(pronunciation) {
  return request.post("/pronunciation", {
    pronunciation: pronunciation,
  })
}
