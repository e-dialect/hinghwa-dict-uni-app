<template>
  <view>
    <cu-custom
      title="语记·互动"
      :is-back="false"
    />
    <!-- <button class="cu-btn icon lg bg-blue shadow write" bindtap="writeArticle">
  <text class="cuIcon-write"></text>
</button> -->
    <view
      class="flex padding text-center"
      style="background-color: white"
    >
      <view
        :class="'flex-sub ' + (status === 0 ? 'text-bold' : '')"
        data-index="0"
        @tap="changeStatus"
      >
        热门文章
      </view>
      <view
        :class="'flex-sub ' + (status === 1 ? 'text-bold' : '')"
        data-index="1"
        @tap="changeStatus"
      >
        全部文章
      </view>
    </view>
    <scroll-view
      :scroll-y="true"
      style="height: 85vh"
      :refresher-enabled="true"
      refresher-default-style="none"
      refresher-background="white"
      :refresher-triggered="triggered"
      @refresherpulling="onPulling"
      @refresherrefresh="onRefresh"
      @scrolltolower="loadMoreArticles"
    >
      <ArticleList :article-list="status === 0 ? hot_articles : displayArticles" />
      <view class="stand-view" />
    </scroll-view>
  </view>
</template>

<script>
import {getHotArticles} from "@/services/website";
import {searchArticle} from "@/services/article";
import ArticleList from "@/components/ArticleList";

const app = getApp();
export default {
  components: {
    ArticleList
  },
  data() {
    return {
      hot_articles: [],
      allArticles: [],
      displayArticles: [],
      page: 1,
      status: 0,
      triggered: false
    };
  },
  onLoad() {
    this._freshing = false;
  },
  options: {
    addGlobalClass: true
  },
  beforeMount() {
    this.getHotArticlesList();
  },
  methods: {
    /**
     * 获取热门文章列表
     * @returns {Promise<void>}
     */
    async getHotArticlesList() {
      const res         = await getHotArticles()
      this.hot_articles = res.hot_articles
      await this.getArticlesList()
    },

    /**
     * 获取全部文章列表
     * @returns {Promise<void>}
     */
    async getArticlesList() {
      await searchArticle().then(async (res) => {
        this.allArticles = res;
        this.displayArticles = res.slice(0, 4)
      })
    },

    onPulling() {
      this.triggered = true;
    },

    // 下拉刷新
    onRefresh() {
      if (this._freshing) {
        return;
      }
      this._freshing = true;
      this.getHotArticlesList();
      setTimeout(() => {
        this.setData({
          triggered: false
        });
        this._freshing = false;
      }, 500);
    },

    // 加载更多文章
    loadMoreArticles() {
      uni.showLoading();
      let page = this.page;
      let origin_articles = this.displayArticles;
      let concat_articles = this.allArticles.slice(page * 4, page * 4 + 4);
      this.setData({
        page: page + 1,
        displayArticles: origin_articles.concat(concat_articles)
      });
      setTimeout(function () {
        uni.hideLoading();
      }, 500);
    },

    changeStatus(e) {
      let index = e.currentTarget.dataset.index;
      this.status = Number(index)
    },

    writeArticle() {
      uni.navigateTo({
        url: '/pages/plugin/write/write'
      });
    }
  }
};
</script>
<style>
.write {
  position: fixed;
  bottom: 10vh;
  right: 6vw;
  z-index: 1024;
}
</style>

