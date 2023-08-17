<template>
  <view>
    <cu-custom
      title="语记·工具"
      :is-back="false"
    />
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
          :data-url="item.url"
          class="cu-item bg-img shadow-blur"
          :style="'background-image:url(' + item.img + ');height:15vh;'"
          @tap="getTools"
        >
          <view class="cardTitle" />
        </view>
      </view>
      <view class="stand-view" />
    </scroll-view>
  </view>
</template>

<script>
import { defaultMessage } from '@/services/shareMessages';

export default {
  data() {
    return {
      list: [
        {
          img: 'https://cos.edialect.top/files/image/6/2022/01/19/vDbjXVbhUzZ34tx.png',
          url: '/tools/pinyin',
        },
        {
          img: 'https://cos.edialect.top/website/%E9%9F%B3%E5%BA%8F%E6%9F%A5%E8%AF%8D.png',
          url: '/tools/dictionary',
        },
        {
          img: 'https://cos.edialect.top/website/%E8%81%AA%E6%98%8E%E8%8A%B1%E5%BC%80.png',
          url: '/quizzes/index',
        },
        {
          img: 'https://cos.edialect.top/files/image/6/2021/12/05/WrUXiZC8fTxXZAc.png',
          url: '/tools/condition',
        },
        {
          img: 'https://cos.edialect.top/website/%E6%97%A5%E5%B8%B8%E7%94%A8%E8%AF%AD.png',
          url: '/tools/daily-expression/index',
        },
        {
          img: 'https://cos.edialect.top/website/排行榜单.png',
          url: '/words/pronunciations/ranking',
        },
        {
          img: 'https://cos.edialect.top/website/亲戚计算.png',
          url: '/tools/relative',
        },
        {
	        img: 'https://pic.imgdb.cn/item/64d45b0e1ddac507ccef0460.png',
          url: '/tools/wordList',
		    },
      ],
    };
  },
  options: {
    addGlobalClass: true,
  },
  onShareAppMessage() {
    return {
      title: '语记·工具',
      path: '/pages/tools/index',
      ...defaultMessage(),
    };
  },
  methods: {
    getTools(e) {
      uni.navigateTo({
        url: `/pages${e.currentTarget.dataset.url}`,
      });
    },
  },
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
</style>
