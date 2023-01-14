import { splitDefinition } from '@/utils/word';
import request from '../utils/request';

/**
 * 某个词语的义项
 */
// interface definition {
//     content: string, // 定义
//     example: // 例句
//         {
//             type: string, // 类型 例：例句 俗：俗语
//             content: string, // 例句内容
//             explain: string, // 解释
//         }[]
// }

/**
 * 某个词语
 */
// interface word {
//     id: number
//     word: string
//     definition: string
//     definitions: definition[]
//     contributor: {
//         nickname: string
//         avatar: string
//         id: number
//     }
//     annotation: string
//     mandarin: string[]
//     related_words: { id: number, word: string }[]
//     related_articles: { id: number, title: string }[]
//     views: number
//     standard_ipa: string
//     standard_pinyin: string
//     source: string
// }

/**
 * WD0101 获取某个词语的详细信息
 * @param id 词语id
 */
export async function getWordDetails(id) {
  let word;
  await request.get(`/words/${id}`).then((res) => {
    word = res.word;
  });
  word.definitions = splitDefinition(word.definition);
  return word;
}

/**
 * WD0201 获取符合条件的字词的列表
 * @returns {Promise<unknown>}
 */
export async function searchWords(key) {
  return request.get('/words', { search: key });
}

/**
 * WD0202 词语内容批量获取
 * @param idList{number[]} 词语id数组
 * @returns {Promise<unknown>}
 */
export async function getWords(idList) {
  return request.put('/words', { words: idList });
}

/**
 * WD0501 获取音序表
 * @returns {Promise<object|null>}
 */
export async function getPhoneticOrder() {
  try {
    return (await request.get('/words/phonetic_ordering')).record;
  } catch (e) {
    return null;
  }
}

/**
 * WD0502 音序表字典查词
 * @param order{string[]} 音序表
 * @param prefix{string} 前缀
 * @param recursion{boolean} 是否递归
 * @returns {Promise<unknown>}
 */
export async function searchDictionary(order, prefix = '', recursion = false) {
  return new Promise((resolve) => {
    request.post('/words/dictionary', { order: [...order], prefix, recursion }).then((res) => {
      resolve(res.words);
    }).catch((err) => {
      if (err.data.words) {
        resolve(err.data.words);
      } else resolve([]);
    });
  });
}
