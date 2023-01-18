<template>
  <view>
    <cu-custom title="我的评论" />
    <view
      v-if="publish_comments.length === 0"
      class="text-lg margin"
    >
      <text>这里暂时空空如也~</text>
    </view>
    <view
      v-for="(item, index) in publish_comments"
      v-else
      :key="index"
      class="solid-bottom padding-top-sm padding-bottom-sm"
    >
      <!--
      <view @tap="toArticlePage(item.article)">
        <ArticleComment :comment="item" />
      </view>-->
      <view
        :data-index="index"
        @tap="toArticlePage(item.article)"
      >
        <view class="flex">
          <image
            class="cu-avatar round margin-right-sm"
            :src="avatar"
            mode="aspectFill"
          />
          <view class="flex flex-sub justify-between">
            <view class="flex flex-direction">
              <view class="text-name">
                {{ nickname }}
              </view>
              <view class="text-date">
                {{ item.time }}
              </view>
            </view>
            <!--
            &lt;!&ndash;
            <view class="text-dz">
            <text class="cuIcon-appreciate" />
            </view>&ndash;&gt;-->
          </view>
        </view>
        <view class="text-content">
          {{ item.content }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getUserInfo } from '@/services/user';
import { getComment } from '@/services/article';
import { toArticlePage } from '@/routers/article';

const app = getApp();
export default {
  data() {
    return {
      toArticlePage,
      avatar: '',
      nickname: '',
      publish_comments: [],
    };
  },
  onLoad() {
    this.getMyComments();
  },
  methods: {
    /**
     * 获取用户评论
     * @returns {Promise<void>}
     */
    async getMyComments() {
      const userInfo = await getUserInfo(app.globalData.id);
      this.avatar = userInfo.user.avatar;
      this.nickname = userInfo.user.nickname;
      const myComments = await getComment(userInfo.publish_comments);
      this.publish_comments = myComments.comments;
    },
  },
};
</script>
<style>
.text-name {
  color: #666666;
  font-size: 30rpx;
}

.text-date {
  color: #9b9b9b;
  font-size: 24rpx;
}

.text-dz {
  color: #999999;
  font-size: 36rpx;
  align-self: center;
}

.text-content {
  position: relative;
  width: 85vw;
  left: 10vw;
  margin-top: 15rpx;
}
</style>
