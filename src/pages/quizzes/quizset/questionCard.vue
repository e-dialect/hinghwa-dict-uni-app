<script>
import { getPaperDetail } from '@/services/quizset';

export default {

  props: {
    submitted: Array, // 包含题目提交情况的数组，true表示已提交且正确，false表示未提交或不正确
  },
  // :class="{ 'question-square': true, 'submitted-correct': submitted[index] === true }"，没做成功..
  data() {
    return {
      quizss: [{ id: 1 }, { id: 2 }], // 先放着
      submit: [],
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
      this.submit = new Array(res.quizzes.length).fill(false);
    });
    // 现在卷子没内容，我先注释掉，可以看
    this.submit = new Array(2).fill(false);
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

.question-square {
  width: 100rpx;
  height: 100rpx;
  border: 1rpx solid #ddd;
  border-radius: 20rpx;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20rpx;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影 */
  transition: transform 0.3s ease; /* 添加动画效果 */
}

.submitted-correct {
  background-color: #39C5BB;
}

.noContent {
  font-size: 40rpx;
  margin-top: 20rpx;
  margin-left: 20rpx;
}

button {
  padding: 10rpx 20rpx;
  width: 40%;
  height: 100rpx;
  background-color: #39C5BB;
  color: #fff;
  border: none;
  border-radius: 50rpx;
  cursor: pointer;
  font-size: 32rpx;
}

.quesNum {
  margin-top: 20rpx;

  font-size: 45rpx;
  color: #3366FF;
  text-shadow: 0 8rpx 10rpx #6699FF;
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

</style>
