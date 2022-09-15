<template>
  <view>
    <cu-custom bg-color="bg-white">
      <view
        slot="content"
        class="text-black"
      >
        语记·工具
      </view>
    </cu-custom>
    <scroll-view
      scroll-y
      style="height: 100%"
    >
      <view
        class="cu-card"
        style="margin-bottom: 120upx;"
      >
        <view
          v-for="(item, index) in list"
          :key="index"
          class="cu-item bg-img shadow-blur"
          :style="'background-image:url(' + item.img + ');height:15vh;'"
          :data-url="item.url"
          @tap="getTools"
        >
          <view class="cardTitle" />
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          img: 'https://HinghwaDict-1259415432.cos.ap-shanghai.myqcloud.com/files/image/6/2022/01/19/vDbjXVbhUzZ34tx.png',
          url: '/component/pinyin/pinyin'
        },
        {
          img: 'https://hinghwadict-1259415432.cos.ap-shanghai.myqcloud.com/website/%E6%8B%BC%E9%9F%B3%E9%80%9F%E6%9F%A5.png',
          url: '/basics/search/search?index=2'
        },
        {
          img: 'https://HinghwaDict-1259415432.cos.ap-shanghai.myqcloud.com/files/image/6/2021/12/05/WrUXiZC8fTxXZAc.png',
          url: '/component/condition/condition'
        },
        {
          img: 'https://hinghwadict-1259415432.cos.ap-shanghai.myqcloud.com/website/%E6%97%A5%E5%B8%B8%E7%94%A8%E8%AF%AD.png',
          url: '/component/daily/daily'
        },
        {
          img: 'https://hinghwadict-1259415432.cos.ap-shanghai.myqcloud.com/website/%E8%81%AA%E6%98%8E%E8%8A%B1%E5%BC%80.png',
          url: '/component/quizzes/quizzes'
        }// {
        //   img: 'https://wx1.sinaimg.cn/mw690/0084vph8ly1gubp33fhtjj60p00dwn0x02.jpg',
        //   url: '/component/voice/voice'
        // }
      ]
    };
  },
  options: {
    addGlobalClass: true
  },
  methods: {
    getTools(e) {
      uni.navigateTo({
        url: '/pages' + e.currentTarget.dataset.url
      });
    }
  }
};
</script>
<style>
.cardTitle {
  color: #fff;
  padding: 90rpx 60rpx;
  font-size: 40rpx;
  font-weight: 300;
  transform: skew(-10deg, 0deg);
  position: relative;
  text-shadow: 0px 0px 6rpx rgba(0, 0, 0, 0.3);
}

.cardTitle::before {
  content: '';
  position: absolute;
  width: 60rpx;
  height: 6rpx;
  border-radius: 20rpx;
  background-color: #fff;
  display: block;
  top: 60rpx;
  left: 50rpx;
  transform: skew(10deg, 0deg);
}

.cardTitle::after {
  content: '';
  position: absolute;
  width: 140rpx;
  border-radius: 6rpx;
  height: 24rpx;
  background-color: #fff;
  display: block;
  bottom: 76rpx;
  left: 90rpx;
  transform: skew(10deg, 0deg);
  opacity: 0.1;
}
</style>
