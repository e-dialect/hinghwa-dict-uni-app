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
 * 前往文章编辑界面
 * @param id 文章id（为0时表示新建）
 */
export function toArticleEditPage(id = 0) {
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
