import { mpLogin } from '@/services/login';
import { getWordDetails } from '@/services/word';

/**
 * 跳转至词语页面
 * @param id 词语id
 */
export function toWordPage(id) {
  uni.navigateTo({
    url: `/pages/words/details?id=${id}`,
  });
}

/**
 * 跳转至贡献语音界面
 * @param id 词语id
 */
export async function toUploadPronunciationPage(id) {
  if (!uni.getStorageSync('id')) {
    uni.showToast({
      title: '请先登录',
      icon: 'none',
    });
    await mpLogin();
    return;
  }
  const word = await getWordDetails(id);
  uni.navigateTo({
    url: `/pages/words/pronunciations/upload?id=${word.id}&word=${word.word}&ipa=${word.standard_ipa}&pinyin=${word.standard_pinyin}`,
  });
}

/**
 * 前往贡献语音榜单页面
 */
export function toVoiceRankListPage() {
  uni.navigateTo({
    url: '/pages/words/pronunciations/ranking',
  });
}
