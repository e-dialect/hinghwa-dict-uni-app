<template>
  <view>
    <cu-custom
      title="词单详情"
      :is-back="true"
    />
    <view class="word-list-detail">
      <view class="word-list-info">
        <view class="word-list-header">
          <view class="word-list-name">
            {{ wordList.name }}
          </view>
          <view class="author-info">
            <image
              :src="wordList.author.avatar"
              mode="aspectFill"
              class="avatar"
            />
            <view class="author-details">
              <view class="author-name">
                {{ wordList.author.nickname }}
              </view>
              <view class="create-time">
                {{ wordList.createTime }}
              </view>
            </view>
          </view>
        </view>
        <view class="word-list-description">
          {{ wordList.description }}
        </view>
      </view>
      <view
        v-for="word in wordList.words"
        :key="word.id"
        @tap="toWordPage(word.id)"
      >
        <view class="word-list-info1">
          <view

            slot="title"
            class="wordText"
          >
            {{ word.word }}
          </view>
          <view
            slot="content"
            class="decriptionText"
          >
            {{ word.definition }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getWordListDetails } from '@/services/lists';
import { toWordPage } from '@/routers/word';

export default {
  data() {
    return {
      wordList: {
        name: 'string',
        author: {
          nickname: 'string',
          avatar: 'string',
          id: 0,
        },
        createTime: '2019-08-24T14:15:22Z',
        updateTime: '2019-08-24T14:15:22Z',
        description: 'string',
        words: [
          {
            id: 0,
            word: 'string',
            definition: 'string',
            contributor: 0,
            annotation: 'string',
            mandarin: [
              'string',
            ],
            views: 0,
            standard_ipa: 'string',
            standard_pinyin: 'string',
          },
        ],
        length: 0,
        id: 'string',
      },
    };
  },
  async onLoad(options) {
    uni.pageScrollTo({
      scrollTop: 0,
      duration: 0,
    });
    const { id } = options;
    await this.loadDetails(id);
  },
  methods: {
    async loadDetails(id) {
      const res = await getWordListDetails(id);
      this.wordList = res;
    },
    toWordPage,
  },
};
</script>
r
<style>
.word-list-detail {
  padding: 20px;
}

.word-list-info {
  padding: 20 rpx;
}

.word-list-info1 {
  background-color: #fff;
  padding: 20 rpx;
  margin-bottom: 40 rpx;
  border-radius: 15 rpx;
  box-shadow: 0 4 rpx 8 rpx rgba(0, 0, 0, 0.1);
}

.word-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20 rpx;
}

.word-list-name {
  font-size: 60 rpx;
  font-weight: bold;
  color: #333;
}

.author-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 65 rpx;
  height: 65 rpx;
  border-radius: 50%;
  margin-right: 10 rpx;
}

.author-details {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-size: 35 rpx;
  color: #666;
}

.create-time {
  font-size: 15 rpx;
  color: #999;
}

.word-list-description {
  font-size: 30 rpx;
  color: #666;
  margin-bottom: 15 rpx;
}

.decriptionText {
  font-size: 30 rpx;
  color: #666;
  max-width: 16em;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.wordText {
  font-size: 45 rpx;
  margin-bottom: 15 rpx;
  letter-spacing: 5 rpx;
}
</style>
