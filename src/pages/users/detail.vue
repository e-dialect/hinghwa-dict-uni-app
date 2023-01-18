<template>
  <view>
    <cu-custom title="语记·用户" />
    <scroll-view
      :scroll-y="true"
      style="height: 100vh"
      :refresher-enabled="true"
      refresher-default-style="none"
      refresher-background="white"
      :refresher-triggered="triggered"
      @refresherpulling="onPulling"
      @refresherrefresh="onRefresh"
      @scrolltolower="loadMoreArticles"
    >
      <image
        class="bg-image"
        src="https://cos.edialect.top/miniprogram/user.png"
        mode="aspectFill"
      />
      <view class="bg-info">
        <view class="avatar">
          <image
            class="cu-avatar round"
            :src="userInfo.user.avatar"
            mode="aspectFill"
          />
        </view>
      </view>
      <view class="padding-sm flex text-center text-black text-lg bg-white">
        <view class="text flex flex-sub flex-direction">
          昵称：{{ userInfo.user.nickname }}
        </view>
        <view class="text flex flex-sub flex-direction">
          身份：{{ userInfo.user.is_admin ? '管理员' : '普通用户' }}
        </view>
      </view>
      <view class="padding-sm flex text-center text-black text-lg bg-white">
        <view class="text flex flex-sub flex-direction">
          区县：{{ userInfo.user.county }}
        </view>
        <view class="text flex flex-sub flex-direction">
          乡镇：{{ userInfo.user.town }}
        </view>
      </view>
      <view class="padding flex text-center text-grey bg-white shadow-warp">
        <view
          class="flex flex-sub flex-direction solid-right"
          @tap="toMyRecordsPage(id)"
        >
          <view class="text-xlp text-orange">
            {{ userInfo.contribution.pronunciation }}
          </view>
          <view class="margin-top-sm">
            <text class="cuIcon-voice" />
            语音量
          </view>
        </view>
        <view class="flex flex-sub flex-direction solid-right">
          <view class="text-xlp text-blue">
            {{ userInfo.contribution.word }}
          </view>
          <view class="margin-top-sm">
            <text class="cuIcon-font" />
            词语量
          </view>
        </view>
        <view class="flex flex-sub flex-direction">
          <view class="text-xlp text-green">
            {{ userInfo.contribution.listened }}
          </view>
          <view class="margin-top-sm">
            <text class="cuIcon-attention" />
            播放量
          </view>
        </view>
      </view>
      <!--统计文章-->
      <view class="title flex">
        <view
          :class="status === 0 ? 'w_after' : 'w_active'"
          @click="changingTabs(0);getArticlesList()"
        >
          ta创作的文章
        </view>
        <view
          :class="status === 1 ? 'w_after' : 'w_active'"
          @click="changingTabs(1);getArticlesList()"
        >
          ta点赞的文章
        </view>
      </view>
      <ArticleList :article-list="displayArticles" />
    </scroll-view>
  </view>
</template>

<script>
import { getUserInfo } from '@/services/user';
import { toMyRecordsPage } from '@/routers';
import { getArticles } from '@/services/article';
import ArticleList from '@/components/ArticleList';

const app = getApp();
export default {
  components: {
    ArticleList,
  },
  data() {
    return {
      toMyRecordsPage,
      id: 0,
      userInfo: {},
      status: 0,
      current: 0,
      page: 1,
      displayArticles: [],
      articles: [],
      publish_articles: [],
      like_articles: [],
      triggered: false,
    };
  },
  async onLoad(options) {
    const { id } = options;
    this.id = id;
    await this.getInfo(id);
    this.userInfo = await getUserInfo(id);
    this.publish_articles = this.userInfo.publish_articles;
    await this.getArticlesList();
    this.freshing = false;
  },
  methods: {
    /**
     * 获取用户信息
     * @returns {Promise<void>}
     */
    async getInfo(id) {
      this.userInfo = await getUserInfo(id);
      this.publish_articles = this.userInfo.publish_articles;
      this.like_articles = this.userInfo.like_articles;
    },

    /**
     * 改变状态
     */
    changingTabs(index) {
      this.status = index;
      this.current = index;
    },

    onPulling() {
      this.triggered = true;
    },

    /**
     * 下拉刷新
     */
    onRefresh() {
      if (this.freshing) {
        return;
      }
      this.freshing = true;
      this.getArticlesList();
      setTimeout(() => {
        this.triggered = false;
        this.freshing = false;
      }, 500);
    },

    /**
     * 加载更多文章
     */
    loadMoreArticles() {
      uni.showLoading();
      const { page } = this;
      const originArticles = this.displayArticles;
      const concatArticles = this.articles.slice(page * 4, page * 4 + 4);
      this.page += 1;
      this.displayArticles = originArticles.concat(concatArticles);
      setTimeout(() => {
        uni.hideLoading();
      }, 500);
    },

    /**
     * 获取文章列表
     * @returns {Promise<void>}
     */
    async getArticlesList() {
      if (this.status === 1) {
        const articleInfo = await getArticles(this.like_articles);
        this.articles = articleInfo.articles;
      } else {
        const articleInfo = await getArticles(this.publish_articles);
        this.articles = articleInfo.articles;
      }
      this.displayArticles = this.articles.slice(0, 4);
    },
  },
};
</script>
<style>

.bg-image {
  z-index: 0;
  position: absolute;
  width: 100vw;
  height: 28vh;
}

.bg-info {
  z-index: 1024;
  height: 28vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.bg-info .avatar {
  width: 190rpx;
  height: 190rpx;
}

.bg-info .text {
  position: absolute;
  top: 22vh;
  font-size: 36rpx;
  font-weight: 700;
  color: white;
}

.bg-info image {
  width: 180rpx;
  height: 180rpx;
  margin-left: 6rpx;
}

.title {
  width: 530rpx;
  height: 45rpx;
  margin: auto;
  justify-content: space-between;
  margin-top: 47rpx;
  color: #7F7F7F;
  font-size: 30rpx;
  font-weight: bold;
  text-align: center;
}

.w_after {
  color: #212121;
}

.w_after::after {
  content: ' ';
  display: block;
  width: 50rpx;
  height: 6rpx;
  background: #2B87FF;
  border-radius: 3rpx;
  margin: auto;
}
</style>
