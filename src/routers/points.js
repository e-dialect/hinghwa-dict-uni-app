/**
 * 前往积分页面
 * @param id 文章id
 */
// eslint-disable-next-line import/prefer-default-export
export function toPointsPage(id) {
  uni.navigateTo({
    url: `/pages/users/me/points?id=${id}`,
  });
}
