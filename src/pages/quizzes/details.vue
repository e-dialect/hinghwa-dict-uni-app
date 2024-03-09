<template>
  <view>
    <cu-custom title="语记·测试" />
    <!--题目-->
    <scroll-view
      scroll-y
      class="scrollPage"
    >
      <form
        class="padding-top-xl padding-bottom-lg"
      >
        <!--题干-->
        <view class="cu-bar bg-white solid-bottom">
          <view class="action text-black">
            <text class="cuIcon-title text-blue text-bold padding">
              {{ quiz.question }}
            </text>
          </view>
        </view>
        <!--选项-->
        <view>
          <radio-group
            class="block padding"
            @change="radioChange"
          >
            <label
              v-for="(item, index) in quiz.options"
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
            <view class="action text-grey text-bold">
              <text>
                正确答案：
              </text>
              <text class="padding-left text-blue">
                {{ String.fromCharCode(quiz.answer + 65) }}
              </text>
            </view>
          </view>
          <view
            v-show="isShow2"
            class="cu-bar bar-title"
          >
            <view class="action text-grey text-bold">
              <text>解析：</text>
            </view>
          </view>
          <view
            v-show="isShow2"
            class="text-content padding-left text-grey"
          >
            {{ quiz.explanation }}
          </view>
        </view>
      </form>
    </scroll-view>
    <view class="cu-bar tabbar bg-white shadow foot">
      <!--播放音频-->
      <view
        v-if="quiz.voice_source"
        class="action"
        @tap="play(quiz.voice_source)"
      >
        <view class="cuIcon-cu-image">
          <text class="lg text-gray cuIcon-notification" />
        </view>
        <view class="text-gray">
          播放题目
        </view>
      </view>
      <!--重置题目-->
      <view
        class="action"
        @tap="resetQuiz"
      >
        <view class="cuIcon-cu-image">
          <text class="lg text-gray cuIcon-refresh" />
        </view>
        <view class="text-gray">
          重置题目
        </view>
      </view>
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
        data-target="modalError"
        class="action"
        @tap="showExplain"
      >
        <view class="cuIcon-cu-image">
          <text class="lg text-gray cuIcon-creative" />
        </view>
        <view class="text-gray">
          查看解析
        </view>
      </view>
      <!--
      <view
        data-target="modalError"
        class="action"
      >
        <view class="cuIcon-cu-image">
          <text class="lg text-gray cuIcon-post" />
        </view>
        <view class="text-gray">
          修改测试
        </view>
      </view>
      -->
    </view>
  </view>
</template>

<script>
import { getQuiz } from '@/services/quiz';
import { playAudio } from '@/utils/audio';
import { defaultMessage } from '@/services/shareMessages';

export default {
  data() {
    return {
      id: 0,
      quiz: {
        question: '',
        options: [],
        answer: 0,
        explanation: '',
        id: 0,
        voice_source: '',
        author: {
          id: 0,
        },
      },
      isShow1: false,
      isShow2: false,
      current: 99,
    };
  },
  onShareAppMessage() {
    return {
      title: `聪明花开：${this.quiz.question}`,
      path: `/pages/quizzes/details?id=${this.id}`,
      ...defaultMessage(),
    };
  },
  onLoad(options) {
    const { id } = options;
    this.getOneQuiz(id);
  },
  methods: {
    /**
     * 获取单个测试
     */
    async getOneQuiz(id) {
      const res = await getQuiz(id);
      this.quiz = res.quiz;
    },
    /**
     * 单选选中
     */
    radioChange(e) {
      this.current = Number(e.detail.value);
    },
    /**
     * 提交
     */
    submitResult() {
      if (this.current === 99) {
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
              if (this.current === this.quiz.answer) {
                uni.showToast({
                  title: '答对啦！',
                });
              } else {
                uni.showToast({
                  title: '太可惜了！',
                  icon: 'none',
                });
              }
              this.isShow1 = true;
              this.isShow2 = true;
            }
          },
        });
      }
    },
    /**
     * 播放语音
     */
    play(url) {
      playAudio(url);
    },
    /**
     * 重置题目
     */
    resetQuiz() {
      this.current = 99;
      this.isShow1 = false;
      this.isShow2 = false;
    },
    /**
     * 显示答案
     */
    showAnswer() {
      this.isShow1 = true;
    },
    /**
     * 显示解析
     */
    showExplain() {
      this.isShow2 = true;
    },
  },
};
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

.submit-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
