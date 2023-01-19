<template>
  <view>
    <cu-custom title="语记·分数海报" />
    <view>
      <image
        :src="imagesUrl"
        mode="widthFix"
      />
    </view>
    <view class="cu-bar btn-group margin-top padding-bottom">
      <button
        class="cu-btn bg-white shadow solid text-xxl"
        style="width: 30%; height: 100upx"
        @tap="save(imagesUrl)"
      >
        保存海报
      </button>
      <button
        open-type="share"
        class="cu-btn bg-white shadow solid text-xxl"
        style="width: 30%; height: 100upx"
      >
        分享海报
      </button>
    </view>
  </view>
</template>

<script>
import { defaultMessage } from '@/services/shareMessages';

export default {
  data() {
    return {
      totalScore: 0,
      imagesUrl: '',
    };
  },
  onLoad(options) {
    this.totalScore = options.totalScore;
    if (this.totalScore >= 60 && this.totalScore < 75) {
      this.imagesUrl = 'https://cos.edialect.top/website/quiz/pass.png';
    } else if (this.totalScore >= 75 && this.totalScore < 85) {
      this.imagesUrl = 'https://cos.edialect.top/website/quiz/good.png';
    } else if (this.totalScore >= 85) {
      this.imagesUrl = 'https://cos.edialect.top/website/quiz/excellent.png';
    } else {
      this.imagesUrl = 'https://cos.edialect.top/website/quiz/fail.png';
    }
  },
  /**
   * 分享事件
   */
  onShareAppMessage() {
    return {
      title: `我的莆仙方言测试题获得 ${this.totalScore}分，你也来试试吧！`,
      path: '/pages/quizzes/index',
      ...defaultMessage(),
    };
  },
  methods: {
    save(url) {
      uni.showModal({
        title: '图片保存',
        content: '确定要保存图片吗',
        success: (modal) => {
          if (modal.confirm) {
            uni.downloadFile({
              url,
              success: (res) => {
                if (res.statusCode === 200) {
                  const file = res.tempFilePath;
                  uni.saveImageToPhotosAlbum({
                    filePath: file,
                    success: () => {
                      uni.hideLoading();
                      uni.showToast({
                        title: '已保存至相册',
                      });
                    },
                    fail: () => {
                      uni.hideLoading();
                      uni.showToast({
                        title: '图片保存失败',
                      });
                    },
                  });
                }
              },
            });
          }
        },
      });
    },
  },
};
</script>

<style scoped>

</style>
