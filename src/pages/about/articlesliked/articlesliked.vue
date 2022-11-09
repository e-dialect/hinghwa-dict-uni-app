<template>
  <view>
    <cu-custom
      bg-color="bg-white"
      :is-back="true"
    >
      <view
        slot="content"
        class="text-black"
      >
        点赞文章
      </view>
    </cu-custom>
    <view
      v-if="likeArticlesList.length === 0"
      class="text-lg margin"
    >
      <text>这里暂时空空如也~</text>
    </view>
    <ArticleList :article-list="likeArticlesList" />
  </view>
</template>

<script>
import {getUserInfo}  from "@/services/user";
import {getArticles}  from "@/services/article";
import ArticleList    from "@/components/ArticleList";

const app = getApp();
export default {
  components: {
    ArticleList
  },
  data() {
    return {
      likeArticlesList: {}
    };
  },
  onLoad() {
    this.getLikeArticles();
  },
  methods: {
    /**
     * 获取用户点赞文章
     * @returns {Promise<void>}
     */
    async getLikeArticles() {
      const userInfo = await getUserInfo(app.globalData.id)
      const articleInfo = await getArticles(userInfo.like_articles)
      this.likeArticlesList = articleInfo.articles
    },
  }
};
</script>
<style>
/* pages/about/articlesliked/articlesliked.wxss */
.word-card {
  background-color: #ffffff;
  border-radius: 20rpx;
  margin-right: 1vw;
}
</style>
