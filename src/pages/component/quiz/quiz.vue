<template>
  <view>
    <cu-custom title="语记·测试" />
    <!--题目-->
    <scroll-view
      scroll-y
      class="scrollPage"
    >
      <form>
        <!--题干-->
        <view class="cu-bar bg-white solid-bottom">
          <view class="action text-black">
            <text class="cuIcon-title text-blue text-bold">
              {{quiz.question}}
            </text>
          </view>
        </view>
        <!--选项-->
        <view>
          <radio-group
            class="block"
            @change="radioChange"
          >
            <view
              class="cu-form-group"
              v-for="(item, index) in quiz.options"
              :key="index"
            >
              <radio
                :value="index"
                :checked="index === this.current"
              />
              <view class="title text-black">
                {{index + 1}}.{{item}}
              </view>
            </view>
          </radio-group>
        </view>
        <!--提交-->
        <view class="padding submit-btn">
          <button
            class="cu-btn bg-gradual-blue"
            @click="submitResult"
          >
            提 交
          </button>
        </view>
        <!--答案和解析-->
        <view class="margin-top solid-top">
          <view
            v-show="isShow1"
            class="cu-bar"
          >
            <view class="action text-grey">
              <text>
                正确答案：
              </text>
              <text class="solid-bottom padding-left text-blue">
                {{quiz.answer + 1}}
              </text>
            </view>
          </view>
          <view
            v-show="isShow2"
            class="cu-bar bar-title"
          >
            <view class="action text-grey">
              <text>解析：</text>
            </view>
          </view>
          <view
            v-show="isShow2"
            class="text-content padding text-grey">
            {{quiz.explanation}}
          </view>
        </view>
      </form>
    </scroll-view>
    <view class="cu-bar tabbar bg-white shadow foot">
      <!--查看答案和解析-->
      <view
        class="action"
        @tap="showAnswer"
      >
        <view class="cuIcon-cu-image">
          <text class="lg text-gray cuIcon-question" />
        </view>
        <view class="text-gray">
          查看答案
        </view>
      </view>
      <view
        class="action"
        @tap="showExplian"
        data-target="modalError"
      >
        <view class="cuIcon-cu-image">
          <text class="lg text-gray cuIcon-creative" />
        </view>
        <view class="text-gray">
          查看解析
        </view>
      </view>
      <view
        class="action"
        @tap="showExplian"
        data-target="modalError">
        <view class="cuIcon-cu-image">
          <text class="lg text-gray cuIcon-post" />
        </view>
        <view class="text-gray">
          修改测试
        </view>
      </view>
    </view>

  </view>
</template>

<script>
import {getQuiz} from "@/services/quiz";

const app = getApp();

export default {
  data() {
    return {
      quiz: {
        question: '',
        options: [],
        answer: 0,
        explanation:'',
        id: 0
      },
      isShow1: false,
      isShow2: false,
      current: 99
    }
  },
  onLoad() {
    this.getOneQuiz();
  },
  methods: {
    /**
     * 获取单个测试
     * @returns {Promise<void>}
     */
    async getOneQuiz() {
      const res = await getQuiz()
      this.quiz = res.quiz
    },
    /**
     * 单选选中
     */
    radioChange(e) {
      this.current = Number(e.detail.value)
    },
    /**
     * 提交
     */
    submitResult(e) {
      if(this.current === 99){
        uni.showToast({
          title: '还没有做出选择哦',
          icon: 'none',
        });
      }
      else{
        uni.showModal({
          title: "提交",
          content: "确定要提交吗？",
          success: (res) => {
            if (res.confirm) {
              if (this.current === this.quiz.answer) {
                uni.showToast({
                  title: '答对啦！'
                });
              }
              else {
                uni.showToast({
                  title: '太可惜了！',
                  icon: 'none',
                });
              }
            }
          }
        });
      }
    },
    /**
     * 显示答案
     */
    showAnswer() {
      this.isShow1 = true
    },
    /**
     * 显示解析
     */
    showExplian() {
      this.isShow2 = true
    },
  }
}
</script>

<style>
page {
  background-color: #FFFFFF;
}

.cu-form-group {
  justify-content: flex-start
}

.cu-form-group .title {
  padding-left: 30upx;
  padding-right: 0upx;
}

.cu-form-group+.cu-form-group {
  border-top: none;
}

.cu-bar-title {
  min-height: 50upx;
}

.submit-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>