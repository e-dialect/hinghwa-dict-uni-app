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

/**
 * 前往积分商城页面
 */
export function toPointMall() {
  uni.navigateTo({
    url: '/pages/users/me/pointmall',
  });
}

/**
 * 前往商品发布页面
 */
export function toUploadGoods() {
  uni.navigateTo({
    url: '/pages/users/me/uploadgoods',
  });
}
