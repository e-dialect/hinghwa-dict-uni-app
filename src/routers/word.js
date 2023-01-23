import { mpLogin } from '@/services/login';
import { getWordDetails } from '@/services/word';

/**
 * 跳转至词语页面
 * @param id 词语id
 */
export function toWordPage(id) {
  const pages = getCurrentPages();
  if (pages.length > 10) {
    const wordPages = pages.slice(-10).filter((page) => page.route.includes('pages/words/details'));
    const app = getApp();
    if (wordPages.length === 10) {
      if (!app.globalData.showRedirectTips) {
        setTimeout(() => {
          uni.showModal({
            title: '平台限制',
            content: '之后的页面将无法保留历史记录',
            showCancel: false,
          });
          app.globalData.showRedirectTips = true;
        }, 500);
      }
      uni.redirectTo({
        url: `/pages/words/details?id=${id}`,
      });
      return;
    } app.globalData.showRedirectTips = false;
  }
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
