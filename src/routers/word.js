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
  uni.navigateTo({
    url: `/pages/words/pronunciations/upload?id=${id}`,
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

/**
 * 前往词语发音页面
 * @param word 词语id
 */
export function toWordPronunciations(word) {
  uni.navigateTo({
    url: `/pages/words/pronunciations?word=${word}`,
  });
}
