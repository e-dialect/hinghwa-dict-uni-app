<template>
  <view>
    <cu-custom bg-color="bg-white">
      <view
        slot="content"
        class="text-black"
      >
        语记·互动
      </view>
    </cu-custom>
    <!-- <button class="cu-btn icon lg bg-blue shadow write" bindtap="writeArticle">
  <text class="cuIcon-write"></text>
</button> -->
    <view
      class="flex padding text-center"
      style="background-color: white"
    >
      <view
        :class="'flex-sub ' + (status == 0 ? 'text-bold' : '')"
        data-index="0"
        @tap="changeStatus"
      >
        热门文章
      </view>
      <view
        :class="'flex-sub ' + (status == 1 ? 'text-bold' : '')"
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
      @refresherrefresh="onRefresh"
      @scrolltolower="loadMoreArticles"
    >
      <view
        v-for="(item, index) in status == 0 ? hot_articles : displayArticles"
        :key="index"
        class="word-card padding-xs shadow -gray cu-card article no-card"
        style="margin: 3vw"
        :data-index="index"
        @tap="article"
      >
        <view class="cu-item shadow margin-bottom-sm">
          <view class="flex justify-between">
            <view
              class="title flex align-center"
              style="width: 80%;"
            >
              <view class="text-cut">
                {{ item.article.title }}
              </view>
              <view class="cu-tag bg-blue light sm round margin">
                <text class="cuIcon-appreciate">
                  {{ item.article.likes }}
                </text>
              </view>
            </view>
            <text class="cuIcon-attention text-grey margin-top-sm margin-right">
              {{ item.article.views }}
            </text>
          </view>
          <view class="content">
            <view class="desc">
              <view
                class="text-df"
                style="margin-bottom: 17upx;"
              >
                <image
                  class="cu-avatar round ssm"
                  :src="item.author.avatar"
                  mode="aspectFill"
                />
                <text
                  :decode="true"
                  class="margin-xs"
                >
                  {{ item.author.nickname }}
                </text>
              </view>
              <view class="text-content">
                {{ item.article.description }}
              </view>
            </view>
            <image
              :src="item.article.cover"
              mode="aspectFill"
              class="margin-top"
            />
          </view>
          <view class="time">
            <text class="text-grey fr margin-right-xl margin-top-xs">
              {{ item.article.publish_time }}
            </text>
          </view>
        </view>
      </view>
      <view class="stand-view" />
    </scroll-view>
  </view>
</template>

<script>
import {getHotArticles} from "@/services/website";
import {getArticles, getAllArticles} from "@/services/article";

const app = getApp();
export default {
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
  options: {
    addGlobalClass: true
  },
  beforeMount() {
    let that = this;
    this.getHotArticlesList();
  },
  methods: {
    /**
     * 获取热门文章列表
     * @returns {Promise<void>}
     */
    async getHotArticlesList() {
      uni.showLoading();
      const res         = await getHotArticles()
      this.hot_articles = res.hot_articles
      await this.getArticlesList()
    },

    /**
     * 获取全部文章列表
     * @returns {Promise<void>}
     */
    async getArticlesList() {
      const res            = await getArticles()
      const articlesId     = res.articles
      const res1 = await getAllArticles(articlesId)
      this.allArticles = res1.articles
      this.displayArticles = res1.articles.slice(0, 4)
      uni.hideLoading();
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
      this.setData({
        status: index
      });
    },

    article(e) {
      let index = e.currentTarget.dataset.index;
      let id = 0;

      if (this.status == 0) {
        id = this.hot_articles[index].article.id;
      } else {
        id = this.allArticles[index].article.id;
      }

      uni.navigateTo({
        url: '/pages/plugin/article/article?id=' + id
      });
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
.word-card {
  background-color: #ffffff;
  border-radius: 20rpx;
  margin-right: 1vw;
}
</style>

