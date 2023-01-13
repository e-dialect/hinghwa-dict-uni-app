<template>
  <view>
    <!-- <scroll-view scroll-y class="scrollPage">
  <view class="user-bg img-edge-cover">
    <view class="text-xl text-white back" bindtap="back">
      <text class="cuIcon-back"></text>
    </view>
    <view class="cu-avatar round" style="width:170rpx;height:170rpx">
      <image src="{{user.avatar}}" class="cu-avatar round" mode="aspectFill"></image>
    </view>
    <view class="text-xxl margin text-bold">{{user.username}}</view>
  </view>
  <view class="padding flex text-center text-grey bg-white shadow-warp">
    <view class="flex flex-sub flex-direction solid-right">
      <view class="text-xlp text-orange">{{contribution.pronunciation}}</view>
      <view class="margin-top-sm">
        <text class="cuIcon-voice"></text> Records
      </view>
    </view>
    <view class="flex flex-sub flex-direction solid-right">
      <view class="text-xlp text-blue">{{contribution.word}}</view>
      <view class="margin-top-sm">
        <text class="cuIcon-font"></text> Words
      </view>
    </view>
    <view class="flex flex-sub flex-direction">
      <view class="text-xlp text-green">{{contribution.listened}}</view>
      <view class="margin-top-sm">
        <text class="cuIcon-attention"></text> View
      </view>
    </view>
  </view>
</scroll-view> -->

    <cu-custom
      bg-color="bg-white"
      :is-back="true"
    >
      <view
        slot="content"
        class="text-black"
      >
        语记·用户
      </view>
    </cu-custom>
    <scroll-view
      scroll-y
      class="scrollPage"
    >
      <image
        class="bg-image"
        src="https://cos.edialect.top/miniprogram/user.png"
        mode="aspectFill"
      />
      <view class="bg-info">
        <view class="avatar">
          <image
            class="cu-avatar round"
            :src="avatar"
            mode="aspectFill"
          />
        </view>
        <view class="text">
          {{ nickname }}
        </view>
      </view>
      <view class="padding flex text-center text-grey bg-white shadow-warp">
        <view
          class="flex flex-sub flex-direction solid-right"
          @tap="getMyRecords"
        >
          <view class="text-xlp text-orange">
            {{ recordsCount }}
          </view>
          <view class="margin-top-sm">
            <text class="cuIcon-voice" />
            语音量
          </view>
        </view>
        <view class="flex flex-sub flex-direction solid-right">
          <view class="text-xlp text-blue">
            {{ wordsCount }}
          </view>
          <view class="margin-top-sm">
            <text class="cuIcon-font" />
            词语量
          </view>
        </view>
        <view class="flex flex-sub flex-direction">
          <view class="text-xlp text-green">
            {{ visitTotal }}
          </view>
          <view class="margin-top-sm">
            <text class="cuIcon-attention" />
            播放量
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { getUserInfo } from '@/services/user';

const app = getApp();
export default {
  data() {
    return {
      id: 0,
      avatar: '',
      nickname: '',
      recordsCount: 0,
      wordsCount: 0,
      visitTotal: 0,
    };
  },
  onLoad(options) {
    const { id } = options;
    this.getInfo(id);
  },
  methods: {
    // 获取用户信息
    getInfo(id) {
      getUserInfo(id).then((res) => {
        this.id = res.user.id;
        this.avatar = res.user.avatar;
        this.nickname = res.nickname;
        this.recordsCount = res.contribution.pronunciation;
        this.wordsCount = res.contribution.word;
        this.visitTotal = res.contribution.listened;
      });
    },

    // 返回上一页面
    // back() {
    //   wx.navigateBack({
    //     delta: 1
    //   })
    // }
    getMyRecords() {
      const { id } = this;
      uni.navigateTo({
        url: `/pages/component/voice/voice?id=${id}`,
      });
    },
  },
};
</script>
<style>
/* .user-bg {
  background-image: url("https://wx3.sinaimg.cn/mw690/0084vph8ly1gszctmzgg2j337q37q4i3.jpg");
  background-size: cover;
  height: 500rpx;
  display: flex;
  justify-content: center;
  padding-top: 40rpx;
  overflow: hidden;
  position: relative;
  flex-direction: column;
  align-items: center;
  color: #fff;
  font-weight: 300;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
}

.user-bg image {
  width: 160rpx;
  height: 160rpx;
}

.back {
  position: absolute;
  top: 5vh;
  left: 5vw;
} */

.bg-image {
    z-index: -1;
    position: absolute;
    width: 100vw;
    height: 28vh;
}

.bg-info {
    z-index: 1024;
    height: 28vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.bg-info .avatar {
    width: 190rpx;
    height: 190rpx;
}

.bg-info .text {
    position: absolute;
    top: 22vh;
    font-size: 36rpx;
    font-weight: 700;
    color: white;
}

.bg-info image {
    width: 180rpx;
    height: 180rpx;
    margin-left: 6rpx;
}
</style>
