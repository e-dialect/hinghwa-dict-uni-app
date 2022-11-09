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
    <!--    <view
      v-for="(item, index) in likeArticlesList"
      v-else
      :key="index"
      class="word-card padding-xs shadow -gray cu-card article no-card"
      style="margin: 3vw;"
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
                &nbsp;{{ item.author.nickname }}&nbsp;&nbsp;
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
    </view>-->
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
