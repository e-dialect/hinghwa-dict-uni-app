/**
 * 跳转到上传商品页面
 */
export function toUploadProductsPage() {
  uni.navigateTo({
    url: '/pages/products/upload',
  });
}

/**
 * 跳转到商城页面
 */
export function toProductsPage() {
  uni.navigateTo({
    url: '/pages/products/index',
  });
}
