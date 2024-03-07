<template>
  <view>
    <cu-custom title="我的文章" />
    <ArticleList :article-list="publish_articles" />
  </view>
</template>

<script>
import { getUserInfo } from '@/services/user';
import { getArticles } from '@/services/article';
import ArticleList from '@/components/ArticleList.vue';

const app = getApp();
export default {
  components: {
    ArticleList,
  },
  data() {
    return {
      publish_articles: [],
    };
  },
  async onShow() {
    await this.getPublishArticles();
  },
  methods: {
    /**
     * 获取用户发表文章
     * @returns {Promise<void>}
     */
    async getPublishArticles() {
      const userInfo = await getUserInfo(app.globalData.id);
      const articleInfo = await getArticles(userInfo.publish_articles);
      this.publish_articles = articleInfo.articles;
    },
  },
};
</script>
<style>
/* pages/about/myarticles/myarticles.wxss */
</style>
