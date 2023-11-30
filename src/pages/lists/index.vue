<template>
  <view>
    <cu-custom title="语记·词单" />
    <div class="title-text">
      <h1 class="animated-title">
        当前总词单数：{{ listNum }}
      </h1>
    </div>
    <scroll-view
      :scroll-y="true"
      style="height: 85vh"
      :refresher-enabled="true"
      refresher-default-style="none"
      refresher-background="white"
      :refresher-triggered="triggered"
      @refresherpulling="onPulling"
      @refresherrefresh="onRefresh"
      @scrolltolower="loadMorelists"
    >
      <view class="word-list">
        <view
          v-for="list in showlists"
          :key="list.id"
          @tap="viewlist(list.id)"
        >
          <view class="list-item">
            <view class="list-title">
              {{ list.name }}
            </view>
            <img
              :src="list.author.avatar"
              class="list-avatar"
              alt="Avatar"
            >
            <!--            <view class="right-description"> -->
            <view class="list-description">
              简介：{{ list.description }}
            </view>
            <!--            </view> -->
            <view class="list-info">
              <view class="list-nickname">
                {{ list.author.nickname }}
              </view>
              <view class="list-time">
                创建时间：{{ list.createTime }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="send-button">
      <button @click="uploadList">
        上传词单
      </button>
    </view>
  </view>
</template>
<script>
import { ref, onMounted } from 'vue';
import { getWordLists } from '@/services/lists';

const app = getApp();

export default {
  data() {
    return {
      showlists: [],
      triggered: false,
      listNum: 0,
      freshing: false,
    };
  },
  async onLoad() {
    uni.pageScrollTo({
      scrollTop: 0,
      duration: 0,
    });
    await this.loadlists();
  },
  methods: {
    async loadlists() {
      const res = await getWordLists();
      this.showlists = res.lists;
      this.freshing = false;
      this.listNum = res.total;
    },

    viewlist(id) {
      uni.navigateTo({
        url: `./details?id=${id}`,
      });
    },
    async uploadList() {
      uni.navigateTo({
        url: './upload',
      });
    },
    onPulling() {
      this.triggered = true;
    },

    // 下拉刷新
    onRefresh() {
      if (this.freshing) {
        return;
      }
      this.freshing = true;
      this.loadlists();
      setTimeout(() => {
        this.triggered = false;
        this.freshing = false;
      }, 500);
    },

    // 加载更多词单
    loadMoreLists() {
      /* uni.showLoading();
      const { page } = this;
      const originLists = this.showLists;
      getAllMails(this.page + 1).then((res) => {
        this.showlists = originlists.concat(res.notifications);
        this.page += 1;
        setTimeout(() => {
          uni.hideLoading();
        }, 500);
      }); */
      // 打印一下当前page和showlists
    },
  },
};
</script>

<style scoped>
.word-list {
  padding: 20px;
}

.list-item {
  border-radius: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.list-item:hover {
  background-color: #f4f4f4;
}

.list-title {
  font-weight: bold;
  font-size: 24px;
}

.list-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  color: #666;
}

.list-nickname {
  font-size: 14px;
}

.list-time {
  font-size: 12px;
}

.list-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-top: 20 rpx;
}

.empty-message {
  text-align: center;
  font-size: 16px;
  color: #999;
  margin-top: 20px;
}

.send-button {
  text-align: center;
  position: fixed;
  bottom: 20px;
  left: 15%;
  width: 70%;
}

.send-button button {
  background-color: #39C5BB;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.send-button button:hover {
  background-color: #2fa299;
}

.list-description {
  margin-top: 10 rpx;
  font-size: 20 rpx;
  color: #3b3838;
  overflow: hidden;
  width: 16em;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 10 rpx;
}

/*玩一下渐变色*/
.title-text {
  text-align: center;
  margin-top: 10 rpx;
  margin-bottom: 10 rpx;
  font-family: "幼圆";
  letter-spacing: 5 rpx;
}

.animated-title {
  margin-top: 30 rpx;
  font-size: 50 rpx;
  animation: colorChange 3s infinite; /* 颜色渐变动画，5秒一次，无限循环 */
}

@keyframes colorChange {
  0% {
    color: #BC95C6;
  }
  25% {
    color: #959dc6;
  }
  50% {
    color: #7DC4CC;
  }
  75% {
    color: #7a9bcc;
  }
  100% {
    color: #BC95C6;
  }
}
</style>
