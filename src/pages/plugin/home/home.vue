<template>
  <view>
    <cu-custom
      title="语记·互动"
      :is-back="false"
    />
    <button
      class="cu-btn icon lg bg-blue shadow write"
      @tap="writeArticle"
    >
      <text class="cuIcon-write" />
    </button>
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
import { getHotArticles } from '@/services/website';
import { searchArticles } from '@/services/article';
import ArticleList from '@/components/ArticleList';
import { toArticleEditPage } from '@/routers/article';

const app = getApp();
export default {
  components: {
    ArticleList,
  },
  data() {
    return {
      hot_articles: [],
      allArticles: [],
      displayArticles: [],
      page: 1,
      status: 0,
      triggered: false,
    };
  },
  onLoad() {
    this.freshing = false;
  },
  options: {
    addGlobalClass: true,
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
      const res = await getHotArticles();
      this.hot_articles = res.hot_articles;
      await this.getArticlesList();
    },

    /**
     * 获取全部文章列表
     * @returns {Promise<void>}
     */
    async getArticlesList() {
      await searchArticles().then(async (res) => {
        this.allArticles = res;
        this.displayArticles = res.slice(0, 4);
      });
    },

    onPulling() {
      this.triggered = true;
    },

    // 下拉刷新
    onRefresh() {
      if (this.freshing) {
        return;
      }
      this.freshing = true;
      this.getHotArticlesList();
      setTimeout(() => {
        this.triggered = false;
        this.freshing = false;
      }, 500);
    },

    // 加载更多文章
    loadMoreArticles() {
      uni.showLoading();
      const { page } = this;
      const originArticles = this.displayArticles;
      const concatArticles = this.allArticles.slice(page * 4, page * 4 + 4);
      this.page ++;
      this.displayArticles = originArticles.concat(concatArticles);
      setTimeout(() => {
        uni.hideLoading();
      }, 500);
    },

    changeStatus(e) {
      const { index } = e.currentTarget.dataset;
      this.status = Number(index);
    },

    writeArticle() {
      toArticleEditPage(0);
    },
  },
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
