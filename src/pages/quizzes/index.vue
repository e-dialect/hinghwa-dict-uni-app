<template>
  <view>
    <cu-custom title="聪明花开" />
    <!--搜索单个测试-->
    <view class="cu-bar search bg-white">
      <view class="action">
        <text>
          搜题
        </text>
      </view>
      <view class="search-form round">
        <text class="cuIcon-search" />
        <input
          placeholder="兴化语记"
          @tap="toSearchQuizPage()"
        >
      </view>
      <view class="action">
        <text class="text-blue">
          搜索
        </text>
      </view>
    </view>
    <!--说明卡片-->
    <view class="cu-card dynamic">
      <view class="cu-item padding">
        <view class="cu-bar">
          <view class="action sub-title">
            <text class="text-xl text-bold text-blue">
              聪明花开
            </text>
            <text class="text-ABC text-blue">
              Quiz
            </text>
          </view>
        </view>
        <text class="text-content indent">
          莆仙方言的学习不仅仅在语言与文字上，更在于方言背后所蕴含的文化。
        </text>
        <text class="text-content indent">
          让我们通过一些小测试，来看看你对莆仙文化的了解，并在测试中加深对莆仙文化的学习吧~
        </text>
        <!--开始答题按钮
        <view class="quiz-btn">
          <button
            style="height: 100upx;width: 200upx"
            class="cu-btn bg-blue shadow"
            @tap="toRandomQuizPage()"
          >
            <text class="text-lg">
              开始答题
            </text>
          </button>
        </view>-->
      </view>
      <!--随机测试-->
      <view
        class="cu-item padding"
        style="background-image: linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%)"
      >
        <view class="cu-bar">
          <view class="action">
            <text class="text-xl text-bold text-blue">
              随机测试
            </text>
          </view>
        </view>
        <view class="flex">
          <text
            class="text-content padding-left"
            style="max-width: 60vw"
          >
            方言俚语、莆仙文化小知识等等有趣的莆仙话小测试都在这里~
          </text>
          <!--开始答题按钮-->
          <view class="quiz-btn">
            <button
              style="height: 80upx;width: 160upx"
              class="cu-btn bg-blue shadow"
              @tap="toRandomQuizPage()"
            >
              <text class="text-sm">
                开始答题
              </text>
            </button>
          </view>
        </view>
      </view>
      <!--试卷-->
      <view
        class="cu-item padding"
        style="background-image: linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%)"
      >
        <view class="cu-bar">
          <view class="action">
            <text class="text-xl text-bold text-blue">
              方言能力小测验！
            </text>
          </view>
        </view>
        <view class="flex">
          <text
            class="text-content padding-left"
            style="max-width: 60vw"
          >
            一个小小的能力测验~快看看你能拿多少分数吧！
          </text>
          <!--开始答题按钮-->
          <view class="quiz-btn">
            <button
              style="height: 80upx;width: 160upx"
              class="cu-btn bg-blue shadow"
              @tap="toTestPage()"
            >
              <text class="text-sm">
                开始测验
              </text>
            </button>
          </view>
        </view>
      </view>
      <view
        class="cu-item padding"
        style="background-image: linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%)"
      >
        <view class="cu-bar">
          <view class="action">
            <text class="text-xl text-bold text-blue">
              方言能力小测验！
            </text>
          </view>
        </view>
        <!--组卷测试，3.0增加-->
        <view class="flex">
          <text
            class="text-content padding-left"
            style="max-width: 60vw"
          >
            组卷测试~快来看看你能答对多少题吧！
          </text>
          <!--开始答题按钮-->
          <view class="quiz-btn">
            <button
              style="height: 80upx;width: 160upx"
              class="cu-btn bg-blue shadow"
              @tap="toPaperPage()"
            >
              <text class="text-sm">
                组卷测试
              </text>
            </button>
          </view>
        </view>
      </view>
    </view>
    <!--添题和纠错
    <view class="cu-bar tabbar bg-white shadow foot">
      <view class="action">
        <view class="cuIcon-cu-image">
          <text class="lg text-gray cuIcon-add" />
        </view>
        <view class="text-gray">
          添加题目
        </view>
      </view>
      <view class="action">
        <view class="cuIcon-cu-image">
          <text class="lg text-gray cuIcon-write" />
        </view>
        <view class="text-gray">
          提供建议
        </view>
      </view>
    </view>-->
  </view>
</template>

<script>
import {
  toRandomQuizPage, toSearchQuizPage, toTestPage, toPaperPage,
} from '@/routers/quiz';
import { defaultMessage } from '@/services/shareMessages';

const app = getApp();

export default {
  data() {
    return {
      toRandomQuizPage,
      toTestPage,
      toSearchQuizPage,
      toPaperPage,
    };
  },

  /**
   * 右上角分享事件
   */
  onShareAppMessage() {
    return {
      title: '聪明花开',
      path: '/pages/quizzes/index',
      ...defaultMessage(),
    };
  },
};
</script>

<style>
.indent {
  text-indent: 2em;
  display: block;
}

.quiz-btn {
  margin: 30rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
