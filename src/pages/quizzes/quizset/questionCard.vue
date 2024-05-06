<template>
  <view>
    <cu-custom title="答题卡" />
    <Detail
      v-show="false"
      :submit="submit"
      @updateSub="updateSub"
    />
    <view
      v-if="quizss.length===0"
      class="noContent"
    >
      暂时没有题目哦~
    </view>
    <view class="quesNum">
      共有{{ quizss.length }}题，已完成
    </view>
    <view class="divider" />
    <view class="question-card">
      <view
        v-for="(quiz, index) in quizss"
        :key="index"
        :class="{ 'submitted-correct': submit[index] === 1,
                  'submitted-incorrect': submit[index] === 2,
                  'submitted-none': submit[index] === 99 }"
        @click="goToQuestion(index)"
      >
        <!--这边的问题在于，数据没做持久化。。-->
        {{ index + 1 }}
      </view>
    </view>
    <view class="fixbutton">
      <p class="buttonFont">
        提交
      </p>
    </view>
  </view>
</template>
<script>
import { getPaperDetail } from '@/services/quizset';
import Detail from '@/pages/quizzes/quizset/detail.vue';

/* const app = App(); */
export default {
  components: {
    Detail,
  },
  // :class="{ 'question-square': true, 'submitted-correct': submitted[index] === true }"，没做成功..
  data() {
    return {
      quizss: [{ id: 1 }, { id: 2 }], // 先放着
      submit: Array(2).fill(99),
      getPaperDetail,

    };
  },
  watch: {
    submitted(newSubmitted) {
      this.submit = [...newSubmitted];
    },

  },
  onLoad() {
    uni.pageScrollTo({
      scrollTop: 0,
      duration: 0,

    });
    const paperid = this.$route.query.id;
    getPaperDetail(paperid).then((res) => {
      this.quizss = res.quizzes;
    });
    // 现在卷子没内容，我先注释掉，可以看
    /* this.submit = new Array(this.quizss.length).fill(99); */
  },
  methods: {
    goToQuestion(index) {
      // 点击题号后跳转到对应的详细问题页面
      const qid = this.$route.query.id;
      uni.navigateTo({ url: `/pages/quizzes/quizset/detail?id=${qid}&index=${index}` });
    },
  },
};
</script>

<style scoped>
.question-card {
  display: flex;
  flex-wrap: wrap;
}

.submitted-correct {
  width: 100rpx;
  height: 100rpx;
  border: 1rpx solid #ddd;
  border-radius: 20rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20rpx;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* 添加阴影
   transition: transform 0.3s ease; /* 添加动画效果 */
  background-color: #39C5BB; /* 绿色 */
}

.submitted-incorrect {
  width: 100rpx;
  height: 100rpx;
  border: 1rpx solid #ddd;
  border-radius: 20rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20rpx;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影 */
  transition: transform 0.3s ease; /* 添加动画效果 */
  background-color: #FFA500; /* 橙色 */
}

.submitted-none {
  width: 100rpx;
  height: 100rpx;
  border: 1rpx solid #ddd;
  border-radius: 20rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20rpx;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影 */
  transition: transform 0.3s ease; /* 添加动画效果 */
  background-color: #fff; /* 白色 */
}

.noContent {
  font-size: 40rpx;
  margin-top: 20rpx;
  margin-left: 20rpx;
}

.fixbutton {
  postion: fixed;
  width: 40%;
  margin-top: 100%;

  height: 100rpx;
  background-color: #39C5BB;
  color: #fff;
  border: none;
  border-radius: 50rpx;
  margin-left: 30%;
  cursor: pointer;
  font-size: 32rpx;
  line-height: 100rpx;
}

.quesNum {
  margin-top: 20rpx;
  font-size: 45rpx;
  color: #4e64c5;
  text-shadow: 0 8rpx 10rpx #5b8ce6;
  font-weight: bolder;
  text-align: center;
}

.divider {
  margin-bottom: 30rpx;
  margin-top: 30rpx;
  background: #E0E3DA;
  width: 100%;
  height: 3rpx;
}

.buttonFont {
  font-size: 40rpx;
  margin-left: 35%;
}
</style>
