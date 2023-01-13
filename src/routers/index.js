/**
 * 前往用户页面
 * @param id 用户id
 */
export function toUserPage(id) {
  uni.navigateTo({
    url: `/pages/about/visitor/visitor?id=${id}`,
  });
}

/**
 * 跳转至首页
 */
export function toIndexPage(closeAll = false) {
  if (closeAll) {
    uni.reLaunch({
      url: '/pages/index/index',
    });
  } else {
    uni.navigateTo({
      url: '/pages/index/index',
    });
  }
}

/**
 * 前往用户信息页面
 */
export function toUserInfoPage() {
  uni.navigateTo({
    url: '/pages/about/userinfo/userinfo',
  });
}

/**
 * 前往用户贡献语音页面
 * @param id 用户id
 */
export function toMyRecordsPage(id) {
  uni.navigateTo({
    url: `/pages/component/voice/voice?id=${id}`,
  });
}

/**
 * 前往更改用户昵称页面
 */
export function toChangeNicknamePage() {
  uni.navigateTo({
    url: '/pages/about/nickname/nickname',
  });
}

/**
 * 前往更改邮箱页面
 */
export function toChangeEmailPage() {
  uni.navigateTo({
    url: '/pages/about/email/email',
  });
}

/**
 * 前往更改手机号页面
 */
export function toChangePhonePage() {
  uni.navigateTo({
    url: '/pages/about/phone/phone',
  });
}

/**
 * 前往文章页面
 * @param id 文章id
 */
export function toArticlePage(id) {
  uni.navigateTo({
    url: `/pages/plugin/article/article?id=${id}`,
  });
}

/**
 * 前往忘记密码页面
 */
export function toForgetPage() {
  uni.navigateTo({
    url: '/pages/forget/forget',
  });
}

/**
 * 前往登录页面
 */
export function toLoginPage() {
  uni.navigateTo({
    url: '/pages/login/login',
  });
}

/**
 * 前往测试页面
 */
export function toRandomQuizPage() {
  uni.navigateTo({
    url: '/pages/component/RandomQuiz/RandomQuiz',
  });
}

/**
 * 前往试卷页面
 */
export function toTestPage() {
  uni.navigateTo({
    url: '/pages/component/test/test',
  });
}

/**
 * 前往海报页面
 */
export function toPosterPage(totalScore) {
  uni.navigateTo({
    url: `/pages/component/poster/poster?totalScore=${totalScore}`,
  });
}

/**
 * 前往单个测试页面
 */
export function toOneQuizPage(id) {
  uni.navigateTo({
    url: `/pages/component/quiz/quiz?id=${id}`,
  });
}

/**
 * 前往搜索测试页面
 */
export function toSearchQuizPage() {
  uni.navigateTo({
    url: '/pages/component/SearchQuiz/SearchQuiz',
  });
}

export function toMePage(closeAll = false) {
  if (closeAll) {
    uni.reLaunch({
      url: '/pages/index/index?status=me',
    });
  } else {
    uni.navigateTo({
      url: '/pages/index/index?status=me',
    });
  }
}

/**
 * 前往搜索页面
 */
export function toSearchPage() {
  uni.navigateTo({
    url: '/pages/basics/search/search',
  });
}

/**
 * 前往微信注册页面
 */
export function toRegisterPage() {
  uni.navigateTo({
    url: '/pages/register/register/register',
  });
}

/**
 * 前往微信注册页面
 */
export function toWechatRegisterPage() {
  uni.navigateTo({
    url: '/pages/register/WechatRegister/WechatRegister',
  });
}
