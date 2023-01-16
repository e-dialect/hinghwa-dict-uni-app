<template>
  <view>
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
.bg-image {
  z-index: 0;
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
