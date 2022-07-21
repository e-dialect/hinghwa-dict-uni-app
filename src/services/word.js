import request from "../utils/request";

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
    let word
    await request.get(`/words/${id}`).then(res => {
        word = res.word
    })
    word.definitions = splitDefinition(word.definition)
    return word
}

/**
 * 具体解析一个待解析的字符串
 * @param definition 具体待解析的字符串
 * @param order 当前的释义序号
 */
function analyseDefinition(definition, order) {
    let index = definition.indexOf('：');

    if (index === -1) {
        index = definition.indexOf('△');

        if (index === -1) {
            index = definition.length;
        } else {
            index = index - 1;
        }
    }

    const result = {
        content: order + definition.substring(0, index),
        example: []
    };
    let status   = 1; // 1：现在是例子；0：现在是例子的解释

    let example = {
        type: '例',
        content: '',
        explain: ''
    };

    for (const char of definition.substring(index + 1)) {
        if (char === '（') {
            // 例子解释开始
            status = 0;
        } else if (char === '）') {
            // 例子解释结束
            status = 1;
        } else if (status === 0) {
            // 例子解释内容
            example.explain = example.explain + char;
        } else if (char === '△') {
            // 例子类型
            example.type = '俗';
        } else if (char === '|' || char === '。') {
            // 一个例子结束
            result.example.push(example);
            example = {
                type: '例',
                content: '',
                explain: ''
            };
        } else {
            // 例子的内容
            example.content = example.content + char;
        }
    }

    return result;
}


/**
 * 将数据库中的释义字符串进行拆分
 * @param definition 释义字符串
 */
function splitDefinition(definition) {
    const order   = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'];
    let lastIndex = -1;
    const result  = [];
    let i;

    for (i = 0; i < order.length; i++) {
        const index = definition.indexOf(order[i]);

        if (index < 0) {
            break;
        }

        if (lastIndex !== -1) {
            result.push(analyseDefinition(definition.substring(lastIndex, index), order[i - 1]));
        }

        lastIndex = index + 1;
    }

    if (i === 0) {
        result.push(analyseDefinition(definition.substring(lastIndex), ''));
    } else {
        result.push(analyseDefinition(definition.substring(lastIndex), order[i - 1]));
    }

    return result
}
