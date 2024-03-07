/**
 * 前往文章页面
 * @param id 文章id
 */
export function toArticlePage(id) {
  uni.navigateTo({
    url: `/pages/articles/details?id=${id}`,
  });
}

/**
 * 前往文章编辑界面
 * @param id 文章id（为0时表示新建）
 */
export function toArticleEditPage(id = 0) {
  // #ifdef MP-WEIXIN
  uni.showToast({
    title: '当前平台暂不支持',
    icon: 'none',
  });
  return;
  // #endif
  // eslint-disable-next-line no-unreachable
  if (id) {
    uni.navigateTo({
      url: `/pages/articles/edit?id=${id}`,
    });
  } else {
    uni.navigateTo({
      url: '/pages/articles/edit',
    });
  }
}

/**
 * 文章评论详情页
 * @param articleId 文章编号
 * @param commentId 评论编号
 */
export function toArticleCommentPage(articleId, commentId) {
  uni.navigateTo({
    url: `/pages/articles/comments/details?comment=${commentId}&article=${articleId}`,
  });
}
