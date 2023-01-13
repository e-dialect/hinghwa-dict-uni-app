/**
 * 前往文章页面
 * @param id 文章id
 */
export function toArticlePage(id) {
  uni.navigateTo({
    url: `/pages/plugin/article/article?id=${id}`,
  });
}
