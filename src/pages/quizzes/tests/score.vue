<template>
  <view>
    <cu-custom title="语记·分数海报" />
    <view class="score-container">
      <image
        :src="imagesUrl"
        mode="widthFix"
      />
      <view
        v-if="userInfo.nickname"
        class="user text-bold"
      >
        <img
          :src="userInfo.avatar"
          alt=""
          class="avatar"
        >
        <view
          :style="fontStyle"
          class="nickname"
        >
          {{ userInfo.nickname }}
        </view>
      </view>
    </view>
    <!-- #ifdef MP-WEIXIN -->
    <view class="cu-bar btn-group margin-top padding-bottom">
      <button
        class="cu-btn bg-white shadow solid text-xxl"
        style="width: 30%; height: 100upx"
        @tap="save(imagesUrl)"
      >
        保存海报
      </button>
      <button
        class="cu-btn bg-white shadow solid text-xxl"
        open-type="share"
        style="width: 30%; height: 100upx"
      >
        分享海报
      </button>
    </view>
    <!-- #endif -->
  </view>
</template>

<script>
import { defaultMessage } from '@/services/shareMessages';
import { toTestPage } from '@/routers/quiz';

export default {
  data() {
    return {
      totalScore: 0,
      imagesUrl: '',
      userInfo: {
        nickname: '',
        avatar: '',
      },
      fontStyle: {
        fontSize: '30upx',
      },
    };
  },
  onLoad(options) {
    const pages = getCurrentPages();
    const beforePage = pages[pages.length - 2];
    if (!beforePage || beforePage.route !== 'pages/quizzes/tests/answer') {
      toTestPage();
      return;
    }
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
    const app = getApp();
    if (app.globalData.userInfo) {
      this.userInfo.avatar = app.globalData.userInfo.avatar;
      this.userInfo.nickname = app.globalData.userInfo.nickname;
      // this.fontStyle.fontSize = `${Math.ceil((36 - this.userInfo.nickname.length) * 1.4)}upx`;
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

<style lang="scss" scoped>

.score-container {
  image {
    width: 100%;
  }

  .user {
    position: absolute;
    top: 116upx;
    left: 580upx;
    width: 180upx;
    text-align: center;
    font-size: 36upx;

    .avatar {
      width: 80%;
      border-radius: 50%;
    }

    .nickname {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
