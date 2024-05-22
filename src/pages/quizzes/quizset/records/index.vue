<template>
  <view>
    <cu-custom title="我的记录" />
    <view class="title">
      <image
        class="user-avater"
        :src="avatar"
      />

      <text class="total-record">
        {{ username }} 完成了 {{ total }} 份卷子！
      </text>
    </view>

    <view class="paper-list">
      <view
        v-for="record in records"
        :key="record.id"
        class="paper-item"
        @tap="gotoRecordDetail(record.id)"
      >
        <text class="paper-title">
          {{ record.paper.title }}
        </text>
        <br>

        <text class="paper-time">
          {{ record.timestamp }}
        </text>
      </view>
    </view>
  </view>
</template>

<script>
import { getAllRecords, getRecord } from '@/services/quizset';
import { getUserInfo } from '@/services/user';
import { gotoRecordDetail } from '@/routers/quiz';

const app = getApp();
export default {
  data() {
    return {
      avatar: '',
      username: '',
      records: [{
        id: '1',
        user: {
          nickname: 'John Doe',
          avatar: 'https://example.com/avatar1.jpg',
          id: 1,
        },
        timestamp: '2024-01-25',
        paper: {
          title: '哈哈哈',
        },
      },
      {
        id: '2',
        user: {
          nickname: 'John Doe',
          avatar: 'https://daonan/haha.jpg',
          id: 1,
        },
        timestamp: '2024-01-25',
        paper: {
          title: '你好',
        },
      }],
      total: 0,
      getAllRecords,
      getRecord,
      getUserInfo,
      gotoRecordDetail,
    };
  },
  onLoad() {
    uni.pageScrollTo({
      duration: 0,
      scrollTop: 0,
    });
    getAllRecords().then((res) => {
      this.records = res.records;
      this.total = res.total;
    });
    getUserInfo(app.globalData.id).then((res) => {
      this.avatar = res.user.avatar;
      this.username = res.user.username;
    });
  },

};
</script>
<style>
.user-avater {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-top: 20rpx;
  margin-left: 55rpx;

}

.total-record {
  position: absolute;
  margin-top: 55rpx;
  margin-left: 205rpx;
  font-size: 35rpx;
  font-weight: bold;
  color: #39c5bb

}

.paper-list {
  justify-content: space-around;
}

.paper-item {
  margin: 50rpx;
  padding: 30rpx;
  border: 1px solid #ddd; /* 边框样式 */
  border-radius: 20rpx; /* 圆角 */
  box-shadow: 0 10rpx 10rpx rgba(0, 0, 0, 0.1); /* 阴影效果 */
  background: linear-gradient(to left, #39c5bb, #ffffff);
  background-size: 200% 50%;

}

.paper-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
}

.paper-time {
  margin-left: 450 upx;
  font-size: 20rpx;
  font-weight: bold;
  color: #333;
  opacity: 70%;
}

.title {
  display: flex;
}

</style>
