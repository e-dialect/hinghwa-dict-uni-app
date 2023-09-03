<script setup>
import { ref } from 'vue';
import { toProductsPage } from '@/routers/product';

// 页面标题
const pageTitle = '我的积分';

// 当前积分
const currentPoints = ref(2000);

// 积分变更历史
const history = ref([
  // 积分变更历史
  {
    timestamp: '2023-07-10', reason: '购买了一只55', action: 'deduct', points: -500,
  },
  {
    timestamp: '2023-07-05', reason: '贡献了一篇文章！', action: 'earn', points: 100,
  },
  {
    timestamp: '2023-07-01', reason: '贡献了一条语音！', action: 'earn', points: 50,
  },
]);

</script>

<template>
  <view>
    <cu-custom title="我的积分" />

    <!-- 当前积分显示 -->
    <view class="current-points">
      <text class="points-label">
        当前积分：
      </text>
      <text class="points-value">
        {{ currentPoints }}
      </text>
    </view>

    <!-- 积分变更历史 -->
    <view class="points-history">
      <view class="history-header">
        积分变更历史
      </view>
      <view
        v-if="history.length > 0"
        class="history-list"
      >
        <view
          v-for="(entry, index) in history"
          :key="index"
          class="history-item"
        >
          <text>{{ entry.timestamp }}</text>
          <text>{{ entry.reason }}</text>
          <text :class="entry.action === 'earn' ? 'increase' : 'decrease'">
            {{ entry.points }}
          </text>
        </view>
      </view>
      <view
        v-else
        class="no-history"
      >
        暂无积分变更记录
      </view>
    </view>

    <view
      class="details-button"
      @click="toProductsPage()"
    >
      <text>积分商城</text>
    </view>
  </view>
</template>

<style>
/* Add your custom styles for the component here */

.current-points {
  margin-top: 20px;
  text-align: center;
}

.points-label {
  font-weight: bold;
}

.points-value {
  font-size: 24px;
}

.points-history {
  margin-top: 20px;
  text-align: center;
}

.history-header {
  font-weight: bold;
}

.history-list {
  margin-top: 10px;
}

.history-item {
  display: flex;
  justify-content: space-between;
}

.increase {
  color: green;
}

.decrease {
  color: red;
}

.no-history {
  margin-top: 10px;
  color: #999;
  font-style: italic;
  text-align: center;
}

.details-button {
  display: block;
  margin: 20px auto;
  text-align: center;
  border: 1px solid #007bff;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

/* 样式 */
.current-points {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}

.points-label {
  font-weight: bold;
  margin-right: 10px;
}

.points-value {
  font-size: 24px;
  color: #007aff;
}

.history-header {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.history-list {
  margin-bottom: 20px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.history-item text {
  flex: 1;
}

.increase {
  color: #2ecc71;
}

.decrease {
  color: #e74c3c;
}

.no-history {
  color: #888;
  text-align: center;
  margin: 20px 0;
}

.details-button {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #39c5bb;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.details-button text {
  font-size: 18px;
}

</style>
