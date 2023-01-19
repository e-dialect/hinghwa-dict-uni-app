export function message(successMessage, failMessage) {
  return {
    success() {
      uni.showToast({
        title: successMessage,
        icon: 'success',
      });
    },
    fail() {
      uni.showToast({
        title: failMessage,
        icon: 'error',
      });
    },
  };
}

export function defaultMessage() {
  return message('分享成功', '分享失败');
}
export default {
  onShareTimeline() {
    return {
      title: '兴化语记：莆仙方言在线工具',
      path: '/pages/index',
      imageUrl: 'https://cos.edialect.top/miniprogram/fm.gif',
      ...defaultMessage(),
    };
  },
};
