/**
 * 跳转至首页
 */
export function toIndexPage(closeAll = false) {
  if (closeAll) {
    uni.reLaunch({
      url: '/pages/index',
    });
  } else {
    uni.navigateTo({
      url: '/pages/index',
    });
  }
}

/**
 * 前往搜索页面
 */
export function toSearchPage() {
  uni.navigateTo({
    url: '/pages/search',
  });
}
