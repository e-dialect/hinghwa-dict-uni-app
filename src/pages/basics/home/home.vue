<template>
  <view>
    <scroll-view
      scroll-y
      class="scrollPage"
      :refresher-enabled="true"
      refresher-default-style="none"
      refresher-background="white"
      :refresher-triggered="triggered"
      @refresherrefresh="onRefresh"
    >
      <!--背景图-->
      <image
        src="https://cos.edialect.top/miniprogram/fm.gif"
        mode="widthFix"
        style="width: 100%"
      />
      <!--正文-->
      <view
        class="layout-index"
        style="z-index: 100"
      >
        <view class="welcome-card shadow -gray">
          <!--一键登录模块-->
          <view
            v-if="!hasLogin"
            class="padding solid-bottom flex justify-between align-center"
          >
            <view>
              <view class="text-bold text-xl">
                欢迎来到兴化语记
              </view>
              <view class="text-gray margin-top-sm">
                记住乡愁 留下乡音
              </view>
            </view>
            <view>
              <button
                class="cu-btn bg-black shadow"
                style="width: fit-content"
                @tap="login"
              >
                一键登录
              </button>
            </view>
          </view>

          <!--搜索框-->
          <view
            class="cu-bar search"
            @tap="search"
          >
            <view class="search-form round">
              <text class="cuIcon-search" />
              <input
                type="text"
                placeholder="搜索词语、单字、拼音和文章"
                confirm-type="search"
                :disabled="true"
              >
            </view>
          </view>
        </view>

        <!--每日一词-->
        <view
          class="word-card padding shadow -gray"
          style="margin: 5vw"
        >
          <view
            class="text-gray"
            style="direction: rtl"
            @tap="randomWord"
          >
            随机跳词
          </view>
          <view
            class="text-bold text-center padding text-xxlp solid-bottom"
            @tap="getWordDetails"
          >
            {{ word.word }}
          </view>
          <view
            class="text-gray padding-top"
            @tap="getWordDetails"
          >
            {{ word.definition }}
          </view>
        </view>

        <!--公告列表-->
        <view
          v-for="(item, index) in announcements"
          :key="index"
          class="word-card padding shadow -gray"
          style="margin: 5vw"
          :data-index="index"
          @tap="toArticle"
        >
          <image
            :src="item.article.cover"
            mode="widthFix"
            style="width: 100%"
          />
        </view>

        <view class="stand-view" />
      </view>
    </scroll-view>
  </view>
</template>

<script>
import {mpLogin, getLoginStatus}           from "../../../services/login.js";
import {getAnnouncements, getWordOfTheDay} from "@/services/website";
import {toArticlePage, toSearchPage, toWordPage} from "@/routers";

const app = getApp();
export default {
  data() {
    return {
      hasLogin: false,
      word: {
        word: '',
        definition: ''
      },
      carousels: [],
      triggered: false,
      announcements: []
    };
  },
  options: {
    addGlobalClass: true
  },
  async mounted() {
    this.word          = await getWordOfTheDay()
    this.announcements = await getAnnouncements()
    this.hasLogin      = await getLoginStatus()
  },
  methods: {
    /**
     * 下拉刷新
     * @returns {Promise<void>}
     */
    async onRefresh() {
      if (this._freshing) {
        return;
      }
      this._freshing = true;
      uni.showLoading({
        title: '刷新中'
      });
      this.word          = await getWordOfTheDay()
      this.announcements = await getAnnouncements()
      uni.hideLoading();
      this.triggered = false
      this._freshing = false;
    },

    /**
     * 一键登录模块
     */
    login() {
      mpLogin()
    },

    /**
     * 随机跳词
     */
    randomWord() {
      const random_id = Math.floor(Math.random() * 6099) + 1;
      toWordPage(random_id)
    },

    /**
     * 获取每日一词的详细信息
     */
    getWordDetails() {
      const id = this.word.id;
      toWordPage(id)
    },

    /**
     * 跳转到公告文章页面
     * @param e
     */
    toArticle(e) {
      const index = e.currentTarget.dataset.index;
      const id    = this.announcements[index].article.id;
      toArticlePage(id)
    },

    /**
     * 跳转到搜索页面
     */
    search() {
      toSearchPage()
    },
  }
};
</script>
<style>
.welcome-card {
  background-color: #ffffff;
  border-radius: 20rpx;
  margin: 5vw;
}

.word-card {
  background-color: #ffffff;
  border-radius: 20rpx;
  margin-right: 1vw;
}
</style>
