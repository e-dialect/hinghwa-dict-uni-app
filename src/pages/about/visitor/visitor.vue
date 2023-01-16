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
        语记·用户
      </view>
    </cu-custom>
    <scroll-view
      scroll-y
      class="scrollPage"
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
            :src="avatar"
            mode="aspectFill"
          />
        </view>
        <view class="text">
          {{ nickname }}
        </view>
      </view>
      <view class="padding flex text-center text-grey bg-white shadow-warp">
        <view
          class="flex flex-sub flex-direction solid-right"
          @tap="toMyRecordsPage(id)"
        >
          <view class="text-xlp text-orange">
            {{ recordsCount }}
          </view>
          <view class="margin-top-sm">
            <text class="cuIcon-voice" />
            语音量
          </view>
        </view>
        <view class="flex flex-sub flex-direction solid-right">
          <view class="text-xlp text-blue">
            {{ wordsCount }}
          </view>
          <view class="margin-top-sm">
            <text class="cuIcon-font" />
            词语量
          </view>
        </view>
        <view class="flex flex-sub flex-direction">
          <view class="text-xlp text-green">
            {{ visitTotal }}
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
      <ArticleList :article-list="articles" />
    </scroll-view>
  </view>
</template>

<script>
import { getUserInfo } from '@/services/user';
import { toMyRecordsPage } from '@/routers';
import { getArticles } from "@/services/article";
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
      avatar: '',
      nickname: '',
      recordsCount: 0,
      wordsCount: 0,
      visitTotal: 0,
      status: 0,
      current: 0,
      articles: [],
      publish_articles: [],
      like_articles: []
    };
  },
  onLoad(options) {
    const { id } = options;
    this.getInfo(id);
    this.getArticlesList();
  },
  methods: {
    /**
     * 获取用户信息
     * @returns {Promise<void>}
     */
    getInfo(id) {
      getUserInfo(id).then((res) => {
        this.id = res.user.id;
        this.avatar = res.user.avatar;
        this.nickname = res.user.nickname;
        this.recordsCount = res.contribution.pronunciation;
        this.wordsCount = res.contribution.word;
        this.visitTotal = res.contribution.listened;
        this.publish_articles = res.publish_articles;
        this.like_articles = res.like_articles;
      });
    },

    /**
     * 改变状态
     */
    changingTabs(index) {
      this.status = index;
      this.current = index;
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
    },
  },
};
</script>
<style>
page{
  background-color: #FFFFFF;
}

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
  height: 30rpx;
  background: #FFFFFF;
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
