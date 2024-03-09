<template>
  <view>
    <cu-custom title="组卷列表" />
    <view
      class="counter"
      :class="{ 'highlight': highlighted }"
    >
      当前组卷数量：
      <span class="total">{{ total }}</span>
    </view>
    <view class="divider" />
    <view class="paper-list">
      <view
        v-for="(paper, id) in papers"
        :key="id"
        class="paper-item"
        @tap="navigatorToDetail(id)"
      >
        <text class="paper-title">
          - {{ paper.title }}
        </text>
      </view>
    </view>
    <view
      class="circle-btn"
      @click="gotoAllRecords()"
    >
      答题记录
    </view>
  </view>
</template>
<script>
import { getAllPapers, getPaperDetail } from '@/services/quizset';
import { navigatorToDetail, gotoAllRecords } from '@/routers/quiz';

export default {
  data() {
    return {
      // 试卷数组
      total: 3,
      papers: [
        { id: 1, title: '迷星叫' },
        { id: 2, title: '壱雫空' },
        { id: 3, title: '影色舞' },
        { id: 4, title: '詩超絆' },
      ],
      navigatorToDetail,
      gotoAllRecords,
    };
  },

  methods: {
    // 获取所有试卷
    async getAllPaperInfo() {
      try {
        await getAllPapers().then((res) => {
          this.papers = res.paper;
        });
      } catch (e) { /* empty */
      }
    },
  },
};
</script>

<style>
/*标题高亮：*/
.counter {
  color: deepskyblue;
  font-size: 18px;
  font-weight: bold;
  margin: 20px;
  text-align: center;
  letter-spacing: 5 upx;
  font-family: "微软雅黑";
  transition: color 0.5s ease-out; /* 使用过渡效果 */
}

.total {
  color: deepskyblue;
}

.highlight {
  color: #ff4500; /* 设置高亮颜色 */
}

.paper-list {
  justify-content: space-around;
}

.paper-item {
  width: 80%;
  border-radius: 30 rpx;
  height: 155 rpx;
  margin-left: 10%;
  margin-bottom: 30 rpx;
  /* padding: 100 rpx; */
  border: 1px solid #ddd; /* 边框样式 */
  box-shadow: 0 10 rpx 10 rpx rgba(0, 0, 0, 0.5); /* 阴影效果 */
  background: linear-gradient(to left, #39c5bb, #ffffff);
  background-size: 200% 50%;
  display: block; /* 每个.paper-item占一行*/
}

.paper-title {
  line-height: 155 rpx;
  align-self: center;
  margin-left: 10%;
  font-size: 50 rpx;
  font-weight: bold;
  font-family: "幼圆";
  color: #5c5c5c;
}

/*分割线用代码*/
.divider {
  margin-bottom: 30 rpx;
  margin-top: 30 rpx;
  background: #E0E3DA;
  width: 100%;
  height: 3 rpx;
}

/*圆形按钮*/
.circle-btn {
  width: 150 upx;
  height: 150 upx;
  line-height: 150 upx;
  text-align: center;
  background-color: #39C5BB;
  color: #fff;
  border-radius: 30 rpx;
  padding: 10 rpx;
  position: fixed;
  margin-top: 70%;
  margin-left: 5%;
  font-size: 30 upx;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);

}
</style>
