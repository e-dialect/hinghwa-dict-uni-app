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
    <view
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
    </view>
    <view class="stand-view" />
  </view>
</template>

<script>
const app = getApp();
export default {
  data() {
    return {
      likeArticlesList: []
    };
  },
  onLoad() {
    this.getArticles();
  },
  methods: {
    getArticles() {
      uni.showLoading({
        title: '加载中'
      });
      let that = this; // 获取点赞文章
      uni.request({
        url: app.globalData.server + 'users/' + app.globalData.id,
        method: 'GET',
        data: {},
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          if (res.statusCode === 200) {
            let likeArticlesId = res.data.like_articles;
            uni.request({
              url: app.globalData.server + 'articles',
              method: 'PUT',
              data: {
                articles: likeArticlesId
              },
              header: {
                'content-type': 'application/json'
              },

              success(res) {
                if (res.statusCode === 200) {
                  that.setData({
                    likeArticlesList: res.data.articles
                  });
                  uni.hideLoading();
                }
              }
            });
          }
        }
      });
    },

    // 进入文章
    article(e) {
      let index = e.currentTarget.dataset.index;
      let id = this.likeArticlesList[index].article.id;
      uni.navigateTo({
        url: '/pages/plugin/article/article?id=' + id
      });
    }
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
