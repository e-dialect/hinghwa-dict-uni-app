<template>
  <view>
    <cu-custom title="我的积分" />

    <view class="myPoints">
      总积分: {{ points.amount }}
    </view>

    <!-- 积分列表 -->
    <view
      v-if="points.results&&points.results.length===0"
      class="nohistory"
    >
      暂时没有积分历史哦
    </view>
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
    <button
      class="PointMall"
      @tap="goToPointMall"
    >
      积分商城
    </button>
  </view>
</template>
<script>

import { getMyPoints } from '@/services/point';
import { toPointMall, toUploadGoods } from '@/routers/points';

const app = getApp();
export default {
  data() {
    return {
      points: {},
      toPointMall,
      toUploadGoods,
    };
  },
  async onLoad() {
    uni.pageScrollTo({
      scrollTop: 0,
      duration: 0,
    });
    this.getSMyPoints();
  },
  methods: {
    getSMyPoints() {
      const ress = getMyPoints(app.globalData.id);
      ress.then((res) => {
        this.points = res;
      });
    },
    goToPointMall() {
      uni.navigateTo({
        url: '/pages/products/index',
      });
    },
  },
};
</script>

<style scoped>
/* 样式可以根据需求进行自定义 */

.myPoints {
  background-color: #39C5BB;
  color: #fff;
  padding: 10px;
  font-size: 20px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  text-align: center;
  border: 5px solid #31aba1;
  letter-spacing: 3.9px; /*微操大师，凯申遗风*/
  font-family: '幼圆';
  font-weight: bold;
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

.PointMall {
  background-color: #39C5BB;
  color: #ffffff;
  width: 80%;
  height: 5%;
  position: fixed;
  bottom: 50px;
  margin-left: 10%;
  border-radius: 50 rpx;
}

/*积分历史的时候*/
.nohistory {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #333;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-size: 16px;
}
</style>
