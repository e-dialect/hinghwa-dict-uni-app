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
      v-if="like_articles.length === 0"
      class="text-lg margin"
    >
      <text>这里暂时空空如也~</text>
    </view>
    <view
      v-for="(item, index) in like_articles"
      v-else
      :key="index"
      class="cu-card article no-card"
      :data-index="index"
      @tap="article"
    >
      <view
        class="cu-item shadow"
        style="margin-bottom: 20rpx"
      >
        <view class="flex justify-between">
          <view class="title flex">
            <view class="text-cut">
              {{ item.article.title }}
            </view>
            <view class="cu-tag bg-blue light sm round margin-top-smp margin-left-xs">
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
            <view class="text-df">
              <image
                class="cu-avatar round ssm"
                :src="item.author.avatar"
                mode="aspectFill"
              />
              <text :decode="true">
                &nbsp;{{ item.author.nickname }}&nbsp;&nbsp;
              </text>
              <text class="text-grey">
                {{ item.article.publish_time }}
              </text>
            </view>
            <view class="text-content">
              {{ item.article.description }}
            </view>
          </view>
          <image
            :src="item.article.cover"
            mode="aspectFill"
          />
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
      like_articles: []
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
        url: app.globalData.server + 'articles',
        method: 'PUT',
        data: {
          articles: app.globalData.like_articles
        },
        header: {
          'content-type': 'application/json'
        },

        success(res) {
          if (res.statusCode == 200) {
            that.setData({
              like_articles: res.data.articles
            });
            uni.hideLoading();
          }
        }
      });
    },

    // 进入文章
    article(e) {
      let index = e.currentTarget.dataset.index;
      let id = this.like_articles[index].article.id;
      uni.navigateTo({
        url: '/pages/plugin/article/article?id=' + id
      });
    }
  }
};
</script>
<style>
/* pages/about/articlesliked/articlesliked.wxss */
</style>
