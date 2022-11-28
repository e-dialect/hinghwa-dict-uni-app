import request from "@/utils/request";

/**
 * CH0201 单字信息批量获取
 * @param id 单字id数组
 * @returns {Promise<unknown>}
 */
export async function getCharacters(id) {
    return request.put(`/characters`, {characters: id})
}

/**
 * CH0203-2 多汉字搜索
 * @returns {Promise<unknown>}
 */
export async function searchCharacters(key) {
    return request.get(`/characters/words/v2`, {search: key})
}

