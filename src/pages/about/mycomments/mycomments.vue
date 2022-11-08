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
        我的评论
      </view>
    </cu-custom>
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
      <view
        :data-index="index"
        @tap="toArticle"
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
            <view class="text-dz">
            <text class="cuIcon-appreciate" />
            </view>-->
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
const app = getApp();
export default {
  data() {
    return {
      avatar: '',
      nickname: '',
      publish_comments: []
    };
  },
  onLoad() {
    this.setData({
      avatar: app.globalData.userInfo.avatar,
      nickname: app.globalData.userInfo.nickname
    }); // 获取我的评论

    this.getComments();
  },
  methods: {
    getComments() {
      let that = this;
      uni.request({
        url: app.globalData.server + 'articles/comments',
        method: 'PUT',
        data: {
          comments: app.globalData.publish_comments
        },
        header: {
          'content-type': 'application/json'
        },

        success(res) {
          if (res.statusCode == 200) {
            that.setData({
              publish_comments: res.data.comments
            });
          }
        }
      });
    },

    toArticle(e) {
      let index = e.currentTarget.dataset.index;
      let id = this.publish_comments[index].article;
      uni.navigateTo({
        url: '/pages/plugin/article/article?id=' + id
      });
    }
  }
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
