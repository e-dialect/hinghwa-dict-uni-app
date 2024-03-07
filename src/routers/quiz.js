/**
 * 前往随机跳题
 */
export function toRandomQuizPage() {
  uni.navigateTo({
    url: '/pages/quizzes/random',
  });
}

/**
 * 前往试卷页面
 */
export function toTestPage() {
  uni.navigateTo({
    url: '/pages/quizzes/tests/answer',
  });
}

/**
 * 前往海报页面
 */
export function toPosterPage(totalScore) {
  uni.navigateTo({
    url: `/pages/quizzes/tests/score?totalScore=${totalScore}`,
  });
}

/**
 * 前往单个测试页面
 */
export function toOneQuizPage(id) {
  uni.navigateTo({
    url: `/pages/quizzes/details?id=${id}`,
  });
}

/**
 * 前往搜索测试页面
 */
export function toSearchQuizPage() {
  uni.navigateTo({
    url: '/pages/quizzes/search',
  });
}
