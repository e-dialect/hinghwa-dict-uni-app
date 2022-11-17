<template>
  <view>
    <cu-custom title="点赞文章" />
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
      likeArticlesList: []
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
</style>
