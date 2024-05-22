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
        @tap="gotoQuestionCard(paper.id)"
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
import data, { getAllPapers, getPaperDetail } from '@/services/quizset';
import { navigatorToDetail, gotoAllRecords, gotoQuestionCard } from '@/routers/quiz';

export default {
  data() {
    return {
      total: 0,
      papers: [],
      Answered: data.questions,
      getAllPapers,
      getPaperDetail,
      navigatorToDetail,
      gotoAllRecords,
      gotoQuestionCard,
    };
  },
  onLoad() {
    uni.pageScrollTo({
      scrollTop: 0,
      duration: 0,
    });
    getAllPapers().then((res) => {
      this.papers = res.paper;
      this.total = res.total;
    });
    this.saveQuestions();
  },
  methods: {
    saveQuestions() {
      uni.setStorageSync('rq', JSON.stringify(this.Answered));
    },
  },

};
</script>

<style scoped>
/*标题高亮：*/
.counter {
  color: deepskyblue;
  font-size: 18px;
  font-weight: bold;
  margin: 20px;
  text-align: center;
  letter-spacing: 5 upx;
  font-family: "微软雅黑";
  transition: color 0.5s ease-out;
}

.total {
  color: deepskyblue;
}

.highlight {
  color: #ff4500;
}

.paper-list {
  justify-content: space-around;
}

.paper-item {
  width: 80%;
  border-radius: 30rpx;
  height: 155rpx;
  margin-left: 10%;
  margin-bottom: 30rpx;
  /* padding: 100rpx; */
  border: 1px solid #ddd; /* 边框样式 */
  box-shadow: 0 10rpx 10rpx rgba(0, 0, 0, 0.5); /* 阴影效果 */
  background: linear-gradient(to left, #39c5bb, #ffffff);
  background-size: 200% 50%;
  display: block; /* 每个.paper-item占一行*/
}

.paper-title {
  line-height: 155rpx;
  align-self: center;
  margin-left: 10%;
  font-size: 50rpx;
  font-weight: bold;
  font-family: "幼圆";
  color: #5c5c5c;
}

/*分割线用代码*/
.divider {
  margin-bottom: 30rpx;
  margin-top: 30rpx;
  background: #E0E3DA;
  width: 100%;
  height: 3rpx;
}

/*圆形按钮*/
.circle-btn {
  width: 200rpx;
  height: 100rpx;
  line-height: 90rpx;
  text-align: center;
  background-color: #39C5BB;
  color: #fff;
  border-radius: 30rpx;
  padding: 10rpx;
  position: fixed;
  margin-top: 10%;
  margin-left: 65%;
  font-size: 30rpx;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);

}
</style>
