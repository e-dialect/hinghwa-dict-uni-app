<template>
  <view>
    <cu-custom title="语记·测试" />
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
        <view class="cu-bar ">
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
        <!--开始答题按钮-->
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
        </view>
      </view>
    </view>
    <!--添题和纠错-->
    <view class="cu-bar tabbar bg-white shadow foot">
      <view class="action">
        <view class="cuIcon-cu-image">
          <text class="lg text-gray cuIcon-add" />
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
      </view>
    </view>
  </view>
</template>

<script>
import {toRandomQuizPage, toSearchQuizPage}   from "@/routers";
const app = getApp();

export default {
  data(){
    return{
      toRandomQuizPage: toRandomQuizPage,
      toSearchQuizPage: toSearchQuizPage,
    }
  }
}
</script>

<style>
.indent{
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