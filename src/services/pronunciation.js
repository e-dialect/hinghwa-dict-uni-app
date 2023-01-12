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

/**
 * PN0203 获取指定的语音发音
 * @param body {{pinyins?:string,ipas?:string,words?:string}}
 * @returns {Promise<unknown>}
 */
export async function combinePronunciation(body) {
  return new Promise((resolve, reject) => {
    request.get("/pronunciation/combine", body).then(res => {
      resolve(res.url)
    }).catch(() => {
      uni.hideToast();
      resolve("")
    })
  })
}

/**
 * PN0203 通过汉字获取指定的语音发音
 * @param chinese 汉字
 * @returns {Promise<*>}
 */
export async function combinePronunciationByChinese(chinese) {
  const res = await combinePronunciation({words: chinese})
  return res.url
}

/**
 * PN0203 通过拼音获取指定的语音发音
 * @param pinyins 拼音
 * @returns {Promise<*>}
 */
export async function combinePronunciationByPinyin(pinyin) {
  return await combinePronunciation({pinyins: pinyin})
}

/**
 * PN0203 通过IPA获取指定的语音发音
 * @param ipa 国际音标
 * @returns {Promise<*>}
 */
export async function combinePronunciationByIpa(ipa) {
  return await combinePronunciation({ipas: ipa})
}

/**
 * PN0101 获取指定的语音
 * @param id 语音ID
 * @returns {Promise<void>}
 */
export async function getPronunciationDetails(id){
  try{
    return (await request.get(`/pronunciation/${id}`)).pronunciation
  }catch (e){
    return null
  }
}
