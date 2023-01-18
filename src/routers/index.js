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
 * 前往贡献语音榜单页面
 */
export function toVoiceRankListPage() {
  uni.navigateTo({
    url: '/pages/component/VoiceRankList/VoiceRankList',
  });
}

/**
 * 前往忘记密码页面
 */
export function toForgetPage() {
  uni.navigateTo({
    url: '/pages/login/forget',
  });
}

/**
 * 前往登录页面
 */
export function toLoginPage() {
  const routes = getCurrentPages();
  if (routes[routes.length - 1].route !== '/pages/login/login' && routes[routes.length - 1].route !== 'pages/login/login') {
    uni.navigateTo({
      url: '/pages/login/login',
    });
  }
}

/**
 * 前往测试页面
 */
export function toRandomQuizPage() {
  uni.navigateTo({
    url: '/pages/tools/quiz/RandomQuiz/RandomQuiz',
  });
}

/**
 * 前往试卷页面
 */
export function toTestPage() {
  uni.navigateTo({
    url: '/pages/tools/quiz/test/test',
  });
}

/**
 * 前往海报页面
 */
export function toPosterPage(totalScore) {
  uni.navigateTo({
    url: `/pages/tools/quiz/poster/poster?totalScore=${totalScore}`,
  });
}

/**
 * 前往单个测试页面
 */
export function toOneQuizPage(id) {
  uni.navigateTo({
    url: `/pages/tools/quiz/quiz/quiz?id=${id}`,
  });
}

/**
 * 前往搜索测试页面
 */
export function toSearchQuizPage() {
  uni.navigateTo({
    url: '/pages/tools/quiz/SearchQuiz/SearchQuiz',
  });
}

/**
 * 前往搜索页面
 */
export function toSearchPage() {
  uni.navigateTo({
    url: '/pages/search',
  });
}

/**
 * 前往微信注册页面
 */
export function toRegisterPage() {
  uni.navigateTo({
    url: '/pages/login/register',
  });
}

/**
 * 前往微信注册页面
 */
export function toWechatRegisterPage() {
  uni.navigateTo({
    url: '/pages/login/register/wechat',
  });
}
