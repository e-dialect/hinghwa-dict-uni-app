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
        更多语音
      </view>
    </cu-custom>
    <button
      class="cu-btn icon lg bg-blue shadow write"
      @tap="uploadPronunciation"
    >
      <text class="cuIcon-voice" />
    </button>
    <view style="background-color: white">
      <view class="solid-bottom padding text-bold text-sl">
        {{ word }}
      </view>
      <view
        v-for="(item, index) in pronunciation"
        :key="index"
        class="padding solid-bottom"
      >
        <view class="flex justify-between align-center">
          <view>
            <view class="text-lg">
              <text>{{ item.pronunciation.pinyin }}</text>
              <text
                class="text-grey"
                decode
              >
                &nbsp;&nbsp;/{{ item.pronunciation.ipa }}/&nbsp;&nbsp;
              </text>
              <text
                class="cuIcon-notificationfill text-blue"
                :data-index="index"
                @tap="play"
              />
            </view>
            <view class="margin-top">
              <text>来源：</text>
              <text
                class="text-blue"
                :data-id="item.contributor.id"
                @tap="toVisitor"
              >
                {{ item.contributor.nickname }}
              </text>
              <text decode>
                &nbsp;&nbsp;
                （{{ item.pronunciation.county }}&nbsp;&nbsp;{{ item.pronunciation.town }}）
              </text>
            </view>
          </view>
          <view class="text-xl">
            <text class="cuIcon-like" />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getPronunciationDetails } from '@/services/pronunciation';
import { playAudio } from '@/utils/audio';

const app = getApp();
export default {
  data() {
    return {
      id: 0,
      word: '',
      pronunciation: [],
      return: false,
    };
  },
  onLoad(options) {
    this.id = options.id;
    this.word = options.word;
    this.getPronunciation();
  },
  onShow() {
    if (this.return) {
      this.getPronunciation();
    } else {
      this.return = true;
    }
  },
  methods: {
    // 获取字词发音
    getPronunciation() {
      this.pronunciation = getPronunciationDetails(this.id);
    },

    toVisitor(e) {
      const { id } = e.currentTarget.dataset;
      uni.navigateTo({
        url: `/pages/about/visitor/visitor?id=${id}`,
      });
    },

    uploadPronunciation() {
      const { id } = this;
      const { word } = this;
      uni.navigateTo({
        url: `/pages/Words/PronunciationUpload/PronunciationUpload?id=${id}&word=${word}`,
      });
    },

    play(e) {
      const { index } = e.currentTarget.dataset;
      const src = this.pronunciation[index].pronunciation.source;
      playAudio(src);
    },
  },
};
</script>
<style>
.write {
    position: fixed;
    bottom: 10vh;
    right: 6vw;
    z-index: 1024;
}
</style>
