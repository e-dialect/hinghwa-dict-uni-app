<template>
  <view>
    <cu-custom title="答题卡" />
    <Detail
      v-show="false"
    />
    <view
      v-if="length===0"
      class="noContent"
    >
      暂时没有题目哦~
    </view>
    <view class="quesNum">
      共有{{ length }}题，已完成{{ answeredQ }}题
    </view>
    <view class="divider" />
    <view class="question-card">
      <view
        v-for="(quiz, index) in quizss.quizzes"
        :key="index"
        :class="{'submitted-correct': questionFill[index] === 1,
                 'submitted-incorrect': questionFill[index] === 2,
                 'submitted-none': questionFill[index] === 99}"
        @tap="goToQuestion(index)"
      >
        {{ index + 1 }}
      </view>
    </view>
    <view
      class="fixbutton"
      @tap="submitPaper"
    >
      <p class="buttonFont">
        提交
      </p>
    </view>
  </view>
</template>
<script>
import data, { getPaperDetail, uploadPaper } from '@/services/quizset';
import { onPullDownRefresh } from '@dcloudio/uni-app';

const app = getApp();
/* const app = App(); */
export default {

  // :class="{ 'question-square': true, 'submitted-correct': submitted[index] === true }"，没做成功..
  /* ' */
  data() {
    return {
      paperID: '',
      length: 0,
      questionFill: data.questions,
      answeredQ: 0,
      quizss: {}, // 先放着
      /* submit: Array(quizss.length).fill(99), */
      getPaperDetail,
      uploadPaper,
    };
  },
  onLoad() {
    uni.pageScrollTo({
      scrollTop: 0,
      duration: 0,

    });
    const paperid = this.$route.query.id;
    this.paperID = paperid;
    getPaperDetail(paperid).then((res) => {
      this.quizss = res;
      this.length = this.quizss.quizzes.length;
    });
    this.questionFill = JSON.parse(uni.getStorageSync('rq') || '[]');
    this.countNo99();
    uni.reLaunch(`/pages/quizzes/quizset/questionCard?id=${paperid}`);
    // 现在卷子没内容，我先注释掉，可以看
    /* this.submit = new Array(this.quizss.length).fill(99); */
    this.onPullDownRefresh();
  },
  methods: {
    goToQuestion(index) {
      // 点击题号后跳转到对应的详细问题页面
      const qid = this.$route.query.id;
      uni.navigateTo({ url: `/pages/quizzes/quizset/detail?id=${qid}&index=${index}` });
    },
    countNo99() {
      let count = 0;
      for (let i = 0; i < this.questionFill.length; i += 1) {
        if (this.questionFill[i] !== 99) {
          count += 1;
        }
      }
      this.answeredQ = count;
    },
    onPullDownRefresh() {
      setTimeout(() => {
        uni.stopPullDownRefresh();
      }, 1000);
    },
    submitPaper() {
      if (this.length > this.answeredQ) {
        uni.showToast({
          title: '做完所有题目再提交哦',
          icon: 'none',
        });
      } else {
        uni.showModal({
          title: '提交整张试卷',
          content: '确定要提交吗？',
          success: (res) => {
            if (res.confirm) {
              uploadPaper(app.globalData.id, this.paperID);
              uni.showToast({
                title: '提交成功！',
              });
              setTimeout(
                () => {
                  uni.reLaunch({ url: '/pages/quizzes/quizset/index' });
                },
                1500,
              );

              // 在这里可以处理用户点击确定后的逻辑
            }
          },
        });
      }
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
