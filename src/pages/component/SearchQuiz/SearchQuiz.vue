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
        class="action"
        @tap="searchQuizzes(key)"
      >
        <text class="text-blue">
          搜索
        </text>
      </view>
    </view>
    <!-- 搜索历史 -->
    <view v-show="!isShow">
      <view class="padding">
        <view class="margin-bottom">
            <text class="text-bold">搜索历史:</text>
        </view>
        <view
          v-if="historyList.length === 0"
          class="text-gray text-center"
        >
          <text>—— 暂时没有任何搜索记录 ——</text>
        </view>
        <view
          v-else
          class="flex flex-wrap"
        >
          <view
            v-for="(item, index) in historyList"
            :key="index"
            class="cu-btn round bg-white margin-right-xs margin-bottom-sm"
            style="height: 55upx;line-height: 55upx"
          >
            <text @tap="this.key = item;searchQuizzes(item)">{{ item }}</text>
          </view>
        </view>
        <view class="margin-top-sm text-center">
          <text
            class="text-gray cuIcon-delete"
            @click="cleanHistory"
          >
            清空历史
          </text>
        </view>
      </view>
    </view>
    <!--搜索结果-->
    <view v-show="isShow">
      <view
        v-for="(item, index) in result"
        :key="index"
        class="cu-list menu padding solid-bottom margin-top-sm"
      >
        <view class="flex flex-direction justify-between">
          <view
            class="margin-bottom-sm"
            @tap="toOneQuizPage(item.id)"
          >
            <text class="text-xl text-bold text-blue ">
              {{ item.question }}
            </text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {searchQuiz}     from "@/services/quiz";
import {toOneQuizPage}  from "@/routers";
import MarkdownViewer from "@/components/MarkdownViewer";
const app = getApp();

export default {
  data() {
    return{
      toOneQuizPage: toOneQuizPage,
      key: '',
      result: [],
      historyList: [],
      isShow: false
    }
  },
  onLoad() {
      this.historyList = JSON.parse(uni.getStorageSync('search_history'));
  },
  methods: {
    /**
     * 同步关键词
     */
    keyFun(e) {
      this.key = e.detail.value
      if( e.detail.value === '') {
        this.isShow = false
      }
    },

    /**
     * 获取搜索内容和历史记录
     */
    searchQuizzes(key) {
      if (key === '') {
        uni.showToast({
          icon: "error",
          title: '搜索内容为空'
        });
      }
      else{
        searchQuiz(key).then(res => {
          if(res.result.length === 0) {
            uni.showToast({
              icon: "none",
              title: '没有搜索到相关内容'
            });
          }
          this.result = res.result
          this.isShow = true
        });
        if (!this.historyList.includes(this.key)) {
          this.historyList.unshift(this.key);
          uni.setStorage({
            key: 'search_history',
            data: JSON.stringify(this.historyList)
          });
        } else {
          //已有搜索记录
          let i = this.historyList.indexOf(this.key);
          this.historyList.splice(i, 1);
          this.historyList.unshift(this.key);
          uni.setStorage({
            key: 'search_history',
            data: JSON.stringify(this.historyList)
          });
        }
      }
    },
    /**
     * 清空历史记录
     */
    cleanHistory() {
      if(this.historyList.length === 0) {
        uni.showToast({
          icon: "none",
          title: '没有任何搜索记录'
        });
      } else {
        uni.showModal({
          content: "确定要清空全部历史记录吗？",
          success: (res) => {
            if (res.confirm) {
              uni.removeStorage({
                key: 'search_history'
              });
              this.historyList = [];
            }
          }
        });
      }
    }
  }
}
</script>

<style>
</style>