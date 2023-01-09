<template>
  <view>
    <cu-custom title="语记·分数海报" />
    <view>
      <image
        :src= "imagesUrl"
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
export default {
  data() {
    return {
      totalScore: 0,
      imagesUrl: ''
    }
  },
  onLoad(options) {
    this.totalScore = options.totalScore
    if(this.totalScore >= 60 && this.totalScore < 75) {
      this.imagesUrl = 'https://cos.edialect.top/website/quiz/pass.png'
    } else if(this.totalScore >= 75 && this.totalScore < 85) {
      this.imagesUrl = 'https://cos.edialect.top/website/quiz/good.png'
    } else if(this.totalScore >= 85) {
      this.imagesUrl = 'https://cos.edialect.top/website/quiz/excellent.png'
    } else {
      this.imagesUrl = 'https://cos.edialect.top/website/quiz/fail.png'
    }
  },
  /**
   * 分享事件
   */
  onShareAppMessage() {
    return {
      title: "分享分数海报: " + this.totalScore + "分",
      path: `/pages/component/poster/poster`,
      success: () => {
        uni.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        });
      },
      fail: () => {
        uni.showToast({
          title: '分享失败',
          icon: 'none',
          duration: 2000
        });
      }
    };
  },
  methods: {
    save(url){
      uni.showModal({
        title: '图片保存',
        content: '确定要保存图片吗',
        success: (res) => {
          if (res.confirm) {
            uni.downloadFile({
              url: url,
              success:(res) => {
                if (res.statusCode === 200) {
                  let file = res.tempFilePath;
                  uni.saveImageToPhotosAlbum({
                    filePath: file,
                    success: () => {
                      uni.hideLoading();
                      uni.showToast({
                        title:"已保存至相册",
                      });
                    },
                    fail: () => {
                      uni.hideLoading();
                      uni.showToast({
                        title:"图片保存失败",
                      });
                    }
                  });
                }
              }
            });
          }
        }
      });
    }
  }
}
</script>

<style scoped>

</style>