<template>
  <view>
    <cu-custom title="词单·试卷" />
    <view class="container">
      <!-- 上部分：题目和选项 -->
      <view class="question-section">
        <p class="totalQuestion">
          第 {{ currentQuizIndex + 1 }} 题 / 总{{ length }}题：
        </p>

        <text class="question">
          {{ currentQuiz.question }}
        </text>

        <view>
          <radio-group
            class="block padding"
            @change="radioChange"
          >
            <label
              v-for="(item, index) in currentQuiz.options"
              :key="index"
              class="cu-form-group"
            >
              <radio
                :value="index.toString()"
                :checked="index === current"
              />
              <view class="title text-black">
                {{ String.fromCharCode(index + 65) }}.{{ item }}
              </view>
            </label>
          </radio-group>
          <view class="padding submit-btn">
            <button
              class="cu-btn bg-gradual-blue"
              @click="submitResult(currentQuiz.answer,currentQuizIndex,currentQuiz.id)"
            >
              提 交
            </button>
          </view>
        </view>
        <view class="divider" />
        <view
          style=" display: flex; align-items: center; "
        >
          <image
            :src="currentQuiz.author.avatar"
            style="width: 100rpx; height: 100rpx; border-radius: 50%; margin-left: 50rpx;"
          />
          <text class="authorName">
            from: {{ currentQuiz.author.nickname }}
          </text>
        </view>
        <!--已经提交的题目就传递给答题卡-->
        <view class="divider" />

        <view class="answer-section">
          <!-- 答案 -->
          <view v-if="showAnswerFlag">
            <text>答案: {{ String.fromCharCode(currentQuiz.answer + 65) }}</text>
          </view>

          <!-- 解析 -->
          <view v-if="showExplanationFlag">
            <text>解析: {{ currentQuiz.explanation }}</text>
          </view>
        </view>

        <!-- 按钮 -->
        <view
          class="pageBottom "
        >
          <view class="divider" />
          <view class="buttons">
            <button @tap="prevQuestion">
              上一题
            </button>
            <button @tap="nextQuestion">
              下一题
            </button>
            <button @tap="showAnswer">
              答 &nbsp;&nbsp;案
            </button>
            <button @tap="showExplanation">
              解 &nbsp;&nbsp;析
            </button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getPaperDetail, uploadMyAnswer } from '@/services/quizset';

const app = getApp();
export default {
  data() {
    return {
      questionList: [],
      length: 0,
      quizData: {
        id: 'string',
        title: 'string',
        quizzes: [
          {
            question: '穿过彩云之间 闪闪发光 心中满足 似要溢出 不知何时 脸颊莹莹闪光 炽热地 炽热地将其濡湿',
            options: ['string1', 'string2', 'string3'],
            answer: 1,
            explanation: 'string',
            id: 0,
            author: {
              id: 0,
              username: 'string',
              nickname: '大树快车',
              email: 'string',
              telephone: 'string',
              birthday: 'string',
              avatar: 'https://pic.imgdb.cn/item/655b0560c458853aef2246b9.jpg',
              is_admin: true,
              county: 'string',
              town: 'string',
              points_sum: 0,
              points_now: 0,
              title: {
                title: 'string',
                color: 'string',
              },
              registration_time: 'string',
              login_time: 'string',
              wechat: true,
              level: 0,
            },
            visibility: true,
            voice_source: 'string',
            type: 'string',
          },
          {
            question: ' 似要溢出 不知何时 脸颊莹莹闪光 炽热地 炽热地将其濡湿',
            options: ['string1', 'string2', 'string3'],
            answer: 1,
            explanation: 'string',
            id: 2,
            author: {
              id: 0,
              username: 'string',
              nickname: '名将怒涛',
              email: 'string',
              telephone: 'string',
              birthday: 'string',
              avatar: 'https://pic.imgdb.cn/item/655b055ac458853aef223403.jpg',
              is_admin: true,
              county: 'string',
              town: 'string',
              points_sum: 0,
              points_now: 0,
              title: {
                title: 'string',
                color: 'string',
              },
              registration_time: 'string',
              login_time: 'string',
              wechat: true,
              level: 0,
            },
            visibility: true,
            voice_source: 'string',
            type: 'string',
          },
        ],
      },
      currentQuizIndex: 0,
      showAnswerFlag: false,
      showExplanationFlag: false,
      current: 99,
      submitted: [],
      uploadMyAnswer,
    };
  },
  computed: {
    currentQuiz() {
      if (this.quizData.quizzes[this.currentQuizIndex] === undefined) {
        return {
          question: '穿过彩云之间 闪闪发光 心中满足 似要溢出 不知何时 脸颊莹莹闪光 炽热地 炽热地将其濡湿',
          options: ['string1', 'string2', 'string3'],
          answer: 1,
          explanation: 'string',
          id: 0,
          author: {
            id: 0,
            username: 'string',
            nickname: '大树快车',
            email: 'string',
            telephone: 'string',
            birthday: 'string',
            avatar: 'https://pic.imgdb.cn/item/655b0560c458853aef2246b9.jpg',
            is_admin: true,
            county: 'string',
            town: 'string',
            points_sum: 0,
            points_now: 0,
            title: {
              title: 'string',
              color: 'string',
            },
            registration_time: 'string',
            login_time: 'string',
            wechat: true,
            level: 0,
          },
          visibility: true,
          voice_source: 'string',
          type: 'string',
        };
      }
      return this.quizData.quizzes[this.currentQuizIndex];
    },
  },
  onLoad(query) {
    uni.pageScrollTo({
      scrollTop: 0,
      duration: 0,
    });
    this.questionList = JSON.parse(uni.getStorageSync('rq') || '[]');
    if (query.index) {
      this.currentQuizIndex = parseInt(query.index, 10);
    }
    const paperid = this.$route.query.id;
    getPaperDetail(paperid).then((res) => {
      this.quizData = res;
      this.submitted = Array(this.quizData.quizzes.length).fill(99);
      this.length = this.quizData.quizzes.length;
    });
    if (this.submitted[this.currentQuizIndex] === true) {
      this.showAnswerFlag = true;
      this.showExplanationFlag = true;
    }
  },
  methods: {
    radioChange(e) {
      this.current = Number(e.detail.value);
    },

    prevQuestion() {
      if (this.currentQuizIndex > 0) {
        this.currentQuizIndex -= 1;
        this.resetFlags();
        this.current = 99;
      } else if (this.currentQuizIndex === 0) {
        uni.showToast({
          title: '已经是第一题！',
          icon: 'none',
          duration: 2000,
        });
      }
    },

    nextQuestion() {
      if (this.currentQuizIndex < this.quizData.quizzes.length - 1) {
        this.currentQuizIndex += 1;
        this.resetFlags();
        this.current = 99;
      } else if (this.currentQuizIndex === this.quizData.quizzes.length - 1) {
        uni.showToast({
          title: '已经是最后一题！',
          icon: 'none',
          duration: 2000,
        });
      }
    },
    showAnswer() {
      if (this.current === 99) {
        uni.showToast({
          title: '请先作答再查看答案！',
          icon: 'none',
        });
      } else {
        this.showAnswerFlag = !this.showAnswerFlag;
        this.showExplanationFlag = false;
      }
    },
    showExplanation() {
      if (this.current === 99) {
        uni.showToast({
          title: '请先作答再查看解析！',
          icon: 'none',
        });
      } else {
        this.showExplanationFlag = !this.showExplanationFlag;
        this.showAnswerFlag = false;
      }
    },
    resetFlags() {
      this.showAnswerFlag = false;
      this.showExplanationFlag = false;
    },

    /* 提交答案 */
    submitResult(answer, index, id) {
      if (this.questionList[index] !== 99) {
        uni.showToast({
          title: '该题已经提交过了！',
          icon: 'none',
        });
      } else if (this.current === 99) {
        uni.showToast({
          title: '还没有做出选择哦',
          icon: 'none',
        });
      } else {
        uni.showModal({
          title: '提交',
          content: '确定要提交吗？',
          success: (res) => {
            if (res.confirm) {
              if (this.current === answer) {
                this.questionList[index] = 1;
                uni.setStorageSync('rq', JSON.stringify(this.questionList));
                uni.showToast({
                  title: '答对啦！',
                });
                uploadMyAnswer(id, id, app.globalData.id, this.current, true);
              } else {
                this.questionList[index] = 2;
                uni.setStorageSync('rq', JSON.stringify(this.questionList));
                uni.showToast({
                  title: '太可惜了！',
                  icon: 'none',
                });
                uploadMyAnswer(id, id, app.globalData.id, this.current, false);
              }
              this.showAnswerFlag = true;
              this.showExplanationFlag = true;
            }
          },
        });
      }
    },
  },
};
</script>

<style scoped>

.page {
  background-color: #FFFFFF;
}

.cu-form-group {
  justify-content: flex-start
}

.cu-form-group .title {
  padding-left: 30rpx;
  padding-right: 0rpx;
}

.cu-form-group + .cu-form-group {
  border-top: none;
}

.cu-bar-title {
  min-height: 50rpx;
}

.container {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.question-section {
  margin-bottom: 20px;
}

.question {
  margin-top: 20rpx;
  font-size: 40rpx;
  font-weight: bold;
  margin-bottom: 10px;
}

.options {
  display: flex;
  flex-direction: column;
}

.options text {
  cursor: pointer;
  margin-bottom: 5px;
}

.info-section {
  margin-bottom: 100rpx;
}

.info {
  font-size: 14px;
}

.buttons {
  display: flex;
  justify-content: space-between;
}

button {
  background-color: #39C5BB;
  color: #fff;
  border: none;
  cursor: pointer;
}

.pageBottom {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  margin-bottom: 50rpx;
}

/*分割线用代码*/
.divider {
  margin-bottom: 30rpx;
  margin-top: 30rpx;
  background: #E0E3DA;
  width: 100%;
  height: 3rpx;
}

.answer-section {
  margin-top: 10rpx;
  padding: 10rpx;
  border-radius: 5rpx;
}

.answer-section text {
  color: #333;
  font-size: 30rpx;
}

.submit-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.authorName {
  margin-left: 70rpx;
  color: #39C5BB;
  font-size: 40rpx;
  font-family: "幼圆";
}

.totalQuestion {
  font-size: 30rpx;
  margin-bottom: 10rpx;
}
</style>
