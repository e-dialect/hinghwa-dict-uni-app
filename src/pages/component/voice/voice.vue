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
        语记·语音
      </view>
    </cu-custom>
    <view
      v-if="pronunciation.length === 0"
      class="text-lg margin"
    >
      <text>这里暂时空空如也~</text>
    </view>
    <view
      v-for="(item, index) in pronunciation"
      v-else
      :key="index"
      class="padding-sm"
    >
      <view
        class="voice"
        :data-index="index"
        @tap="play"
      >
        <view class="word solid-right">
          {{ item.pronunciation.word_word }}
        </view>
        <view class="info">
          <view>
            <view class="text-df margin-bottom-sm">
              <text decode>
                {{ item.pronunciation.pinyin }}&nbsp;&nbsp;
              </text>
              <text class="text-blue cuIcon-notificationfill" />
            </view>
            <view class="text-df margin-bottom-sm">
              <text class="text-grey">
                /{{ item.pronunciation.ipa }}/
              </text>
            </view>
            <view class="text-df margin-bottom-sm">
              <text>地区：</text>
              <text decode>
                {{ item.pronunciation.county }}&nbsp;&nbsp;{{ item.pronunciation.town }}
              </text>
            </view>
            <view class="text-df">
              <text>来源：</text>
              <text
                class="text-blue"
                :data-id="item.contributor.id"
                @tap="toVisitor"
              >
                {{ item.contributor.nickname }}
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getPronunciations } from '@/services/pronunciation';
import { playAudio } from '@/utils/audio';
import { toUserPage } from '@/routers';

const app = getApp();
export default {
  data() {
    return {
      id: -1,
      pronunciation: [],
    };
  },
  onLoad(options) {
    this.id = options.id;
    getPronunciations({ contributor: this.id }).then((res) => {
      this.pronunciation = res.pronunciation;
    });
  },
  methods: {

    play(e) {
      playAudio(this.pronunciation[index].pronunciation.source);
    },

    toVisitor(e) {
      toUserPage(e.currentTarget.dataset.id);
    },
  },
};
</script>
<style>
page {
  background-color: white;
}

.write {
  position: fixed;
  bottom: 10vh;
  right: 6vw;
  z-index: 1024;
}

.voice {
  display: flex;
  padding: 10rpx;
  border-radius: 10rpx;
  border: 1rpx solid #d3d3d3;
}

.word {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30vw;
  height: 28vw;
  margin-right: 20rpx;
  border-radius: 10rpx;
  font-size: 50rpx;
}

.info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
