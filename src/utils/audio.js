/**
 * 播放录音
 */
export function playAudio(src) {
  if (!src) {
    uni.showToast({
      title: '不是一个可用文件',
      icon: 'error',
    });
    return;
  }

  // 播放录音文件用
  const innerAudioContext = uni.createInnerAudioContext();
  innerAudioContext.onError(() => {
    uni.showToast({
      title: '播放失败',
      icon: 'none',
    });
  });

  uni.showToast({
    title: '正在播放...',
    icon: 'none',
  });

  innerAudioContext.src = src;
  innerAudioContext.play();
}
