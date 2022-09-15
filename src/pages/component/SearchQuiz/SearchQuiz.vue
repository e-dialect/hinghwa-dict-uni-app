<template>
  <view>
    <cu-custom title="语记·测试" />
    <!--搜索单个测试-->
    <view class="cu-bar bg-white">
      <view class="search-form round">
        <text class="cuIcon-search" />
        <input
          type="text"
          placeholder="兴化语记"
          :focus="true"
          :value="key"
          @input="keyFun"
        >
      </view>
      <view
        @tap="searchQuizzes"
        class="action"
      >
        <text class="text-blue">
          搜索
        </text>
      </view>
    </view>

    <view
      v-for="(item, index) in result"
      :key="index"
      class="cu-list menu padding solid-bottom margin-top-sm"
    >
      <view class="flex flex-direction justify-between">
        <view
          @tap="toOneQuizPage(item.id)"
          class="margin-bottom-sm"
        >
          <text class="text-xl text-bold text-blue ">
            {{ item.question }}
          </text>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
import {searchQuiz}     from "@/services/quiz";
import {toOneQuizPage}  from "@/routers";
const app = getApp();

export default {
  data(){
    return{
      toOneQuizPage: toOneQuizPage,
      key: '',
      result: [],
    }
  },
  methods: {
    /**
     * 同步关键词
     */
    keyFun(e) {
      this.key = e.detail.value
    },
    searchQuizzes(key) {
      if (this.key === '') {
        uni.showToast({
          icon: "error",
          title: '搜索内容为空'
        });
      }
      else{
        searchQuiz(key).then(res => {
          this.result = res.result
        });
      }
    },
  }
}
</script>

<style>
</style>