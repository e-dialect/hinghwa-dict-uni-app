import request from "@/utils/request";

/**
 * CH0201 单字信息批量获取
 * @param idList{number[]} 单字id数组
 * @returns {Promise<unknown>}
 */
export async function getCharacters(idList) {
    return request.put(`/characters`, {characters: idList})
}

/**
 * CH0203-2 多汉字搜索
 * @returns {Promise<unknown>}
 */
export async function searchCharacters(key) {
    return request.get(`/characters/words/v2`, {search: key})
}

/**
 * CH0101 单字信息获取
 * @param id
 * @returns {Promise<string|default.methods.character|string|*>}
 */
export async function getCharacterDetails(id) {
    try {
        const res = await request.get(`/characters/${id}`);
        return res.character;
    } catch (e){
        return null
    }
}

/**
 * CH0204 拼音查字
 * @param shengmu 声母
 * @param yunmu 韵母
 * @param shengdiao 声调
 * @returns {Promise<void>}
 */
export async function searchCharactersByFilters({shengmu='all',yunmu='all',shengdiao='all'}){
    const data = {}
    if (shengmu !== 'all') data.shengmu = shengmu
    if (yunmu !== 'all') data.yunmu = yunmu
    if (shengdiao !== 'all') data.shengdiao = shengdiao
    return request.get(`/characters/pinyin`,data)
}
