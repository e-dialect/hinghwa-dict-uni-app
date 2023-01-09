import {mpLogin}        from '@/services/login';
import {getWordDetails} from '@/services/word';

/**
 * 前往用户页面
 * @param id 用户id
 */
export function toUserPage(id) {
  uni.navigateTo({
    url: '/pages/about/visitor/visitor?id=' + id
  })
}

/**
 * 跳转至首页
 */
export function toIndexPage(closeAll = false) {
  if (closeAll) {
    uni.reLaunch({
      url: '/pages/index/index'
    })
  } else {
    uni.navigateTo({
      url: '/pages/index/index'
    });
  }
}

/**
 * 前往用户信息页面
 */
export function toUserInfoPage() {
  uni.navigateTo({
    url: '/pages/about/userinfo/userinfo'
  });
}

/**
 * 前往用户贡献语音页面
 * @param id 用户id
 */
export function toMyRecordsPage(id) {
  uni.navigateTo({
    url: '/pages/component/voice/voice?id=' + id
  })
}

/**
 * 前往更改用户昵称页面
 */
export function toChangeNicknamePage() {
  uni.navigateTo({
    url: '/pages/about/nickname/nickname'
  })
}

/**
 * 前往更改邮箱页面
 */
export function toChangeEmailPage() {
  uni.navigateTo({
    url: '/pages/about/email/email'
  })
}

/**
 * 前往更改手机号页面
 */
export function toChangePhonePage() {
  uni.navigateTo({
    url: '/pages/about/phone/phone'
  })
}

/**
 * 跳转至词语页面
 * @param id 词语id
 */
export function toWordPage(id) {
  uni.navigateTo({
    url: '/pages/basics/words/words?id=' + id
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
      icon: 'none'
    })
    await mpLogin()
    return
  }
  const word = await getWordDetails(id)
  uni.navigateTo({
    url: `/pages/Words/PronunciationUpload/PronunciationUpload?id=${word.id}&word=${word.word}&ipa=${word.standard_ipa}&pinyin=${word.standard_pinyin}`
  });
}
/**
 * 前往文章页面
 * @param id 文章id
 */
export function toArticlePage(id) {
  uni.navigateTo({
    url: '/pages/plugin/article/article?id=' + id
  })
}

export function toLoginPage() {
  uni.navigateTo({
    url: "/pages/login/login",
  });
}

/**
 * 前往测试页面
 */
export function toRandomQuizPage() {
  uni.navigateTo({
    url: "/pages/component/RandomQuiz/RandomQuiz",
  });
}

/**
 * 前往试卷页面
 */
export function toTestPage() {
  uni.navigateTo({
    url: "/pages/component/test/test",
  });
}

/**
 * 前往海报页面
 */
export function toPosterPage(totalScore) {
  uni.navigateTo({
    url: "/pages/component/poster/poster?totalScore=" + totalScore,
  });
}

/**
 * 前往单个测试页面
 */
export function toOneQuizPage(id) {
  uni.navigateTo({
    url: "/pages/component/quiz/quiz?id=" + id
  });
}

/**
 * 前往搜索测试页面
 */
export function toSearchQuizPage() {
  uni.navigateTo({
    url: "/pages/component/SearchQuiz/SearchQuiz",
  });
}

export function toMePage(closeAll = false) {
  if (closeAll) {
    uni.reLaunch({
      url: "/pages/index/index?status=me"
    })
  } else {
    uni.navigateTo({
      url: "/pages/index/index?status=me",
    });
  }
}
