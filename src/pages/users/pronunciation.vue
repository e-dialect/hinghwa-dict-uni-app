<template>
  <view>
    <cu-custom title="语记·语音" />
    <view @tap="toVoiceRankListPage()">
      <button
        class="cu-btn bg-gradual-blue shadow text-df margin"
        style="display: flex; justify-content: center"
      >
        <text class="cuIcon-rank">
          语音排行榜
        </text>
      </button>
    </view>
    <view
      v-if="pronunciation.length === 0"
      class="text-lg margin cu-list"
    >
      <text>这里暂时空空如也~</text>
    </view>
    <view
      v-for="(item, index) in pronunciation"
      v-else
      :key="index"
      class="padding-sm cu-item"
    >
      <view
        class="voice flex align-center"
        :data-index="index"
      >
        <view
          class="word solid-right"
          @tap="toWordPage(item.pronunciation.word_id)"
        >
          {{ item.pronunciation.word_word }}
        </view>
        <view
          class="info"
          @tap="playAudio(item.pronunciation.source)"
        >
          <view>
            <view class="text-df margin-bottom-sm">
              <text decode>
                {{ item.pronunciation.pinyin }}&nbsp;&nbsp;
              </text>
            </view>
            <view class="text-df margin-bottom-sm">
              <text class="text-grey">
                /{{ item.pronunciation.ipa }}/
              </text>
            </view>
            <view class="text-df">
              <text>地区：</text>
              <text decode>
                {{ item.pronunciation.county }}&nbsp;&nbsp;{{ item.pronunciation.town }}
              </text>
            </view>
          </view>
        </view>
        <view
          class="margin-right"
          @tap="playAudio(item.pronunciation.source)"
        >
          <text class="text-blue cuIcon-notificationfill" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getPronunciations } from '@/services/pronunciation';
import { playAudio } from '@/utils/audio';
import { toVoiceRankListPage } from '@/routers';
import CuCustom from '@/colorui/components/cu-custom';
import { toWordPage } from '@/routers/word';

const app = getApp();
export default {
  components: { CuCustom },
  data() {
    return {
      id: -1,
      pronunciation: [],
    };
  },
  onLoad(options) {
    this.id = options.id;
    getPronunciations({ contributor: this.id }).then((res) => {
      if (res) {
        this.pronunciation = res;
      }
    });
  },
  methods: {
    toWordPage,
    playAudio,
    toVoiceRankListPage,
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
  height: 20vw;
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
