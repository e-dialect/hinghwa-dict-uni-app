<template>
  <view class="record-list">
    <view
      v-for="(record, index) in records"
      :key="index"
      class="record-item"
    >
      <text class="title">
        {{ record.paper.title }}
      </text>
      <text class="time">
        {{ record.timestamp }}
      </text>
    </view>
  </view>
</template>

<script>
// eslint-disable-next-line import/named
import { getMyRecord } from '@/services/quizset';

const app = getApp();

export default {
  data() {
    return {
      records: [], // 从 API 获取的记录数据
    };
  },
  // 假设你有一个方法从 API 获取记录数据
  onLoad() {
    uni.pageScrollTo({
      scrollTop: 0,
      duration: 0,
    });
    this.getRecords().then((res) => res);
  },
  methods: {
    async getRecords() {
      await getMyRecord(app.globalData.id).then((res) => {
        this.records = res.records;
      });
    },
  },
};
</script>

<style scoped>
.record-list {
  padding: 20px;
}

.record-item {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.time {
  font-size: 14px;
  color: #666;
}
</style>
