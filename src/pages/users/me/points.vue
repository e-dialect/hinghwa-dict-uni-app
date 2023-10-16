<template>
  <view>
    <cu-custom title="我的积分" />

    <view class="total-points">
      总积分: {{ amount }}
    </view>

    <!-- 积分列表 -->
    <view class="point-list">
      <view
        v-for="point in points.results"
        :key="point.id"
        class="point-item"
      >
        <image
          class="user-avatar"
          :src="point.user.avatar"
        />
        <view class="user-info">
          <text class="user-nickname">
            {{ point.user.nickname }}
          </text>
          <text class="point-reason">
            {{ point.reason }}
          </text>
          <text class="point-amount">
            {{ point.points }}积分
          </text>
          <text
            v-if="point.action ==='earn'"
            class="earnAction"
          >
            {{ point.action }}
          </text>

          <text
            v-else
            class="deAction"
          >
            {{ point.action }}
          </text>
        </view>
      </view>
    </view>
    <view
      class="fixed-button"
      @tap="toUploadGoods"
    >
      <text class="add-icon">
        +
      </text>
    </view>
    <button
      class="PointMall"
      @tap="toPointMall"
    >
      积分商城
    </button>
  </view>
</template>

<script>

import { getMyPoints } from '@/services/point';
import { toPointMall, toUploadGoods } from '@/routers/points';

export default {
  data() {
    return {
      points: {},
      toPointMall,
      toUploadGoods,
    };
  },
  beforeMount() {
    getMyPoints();
  },
  methods: {
    getMyPoints() {
      const res = getMyPoints(185);
      this.points = res.data;
    },
    goToUploadGoods() {
      uni.navigateTo({
        url: './uploadgoods.vue',
      });
    },
    goToPointMall() {
      uni.navigateTo({
        url: './pointmall.vue',
      });
    },
  },
};
</script>

<style scoped>
/* 样式可以根据需求进行自定义 */
.my-points {
  padding: 20px;
}

.page-title {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}

.total-points {
  font-size: 45 rpx;
  margin-bottom: 20 rpx;
  margin-top: 20 rpx;
  margin-left: 20 rpx;
  color: #39c5BB;
}

.point-list {
  background-color: #f5f5f5;
  padding: 10px;
}

.point-item {
  display: flex;
  align-items: center;
  background-color: #fff;
  margin-bottom: 10px;
  padding: 10px;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-nickname {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
}

.point-reason {
  margin-left: 30 rpx;
  font-size: 14px;
  color: #666;
}

.point-amount {
  margin-left: 30 rpx;
  font-size: 18px;
  color: #ff9900;
  font-weight: bold;
  margin-top: 5px;
}

.earnAction {
  margin-left: 50 rpx;
  font-size: 15px;
  color: #ff9900;
}

.deAction {
  margin-left: 50 rpx;
  font-size: 15px;
  color: #39C5BB;
}

.fixed-button {
  position: fixed;
  right: 50 rpx;
  bottom: 255 rpx;
  width: 50px;
  height: 50px;
  background-color: #39C5BB;
  border-radius: 50%;
  text-align: center;
  line-height: 50px;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
}

.PointMall {
  background-color: #39C5BB;
  color: #ffffff;
  width: 80%;
  height: 5%;
  position: fixed;
  bottom: 50 rpx;
  margin-left: 10%;
  border-radius: 10 rpx;
}
</style>
