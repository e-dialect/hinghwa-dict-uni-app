<template>
  <text
    v-if="isValid"
    class="cuIcon-notificationfill text-xl text-blue margin-sm"
    @tap="play"
  />
</template>

<script>
import { playAudio } from '@/utils/audio';
import { combinePronunciationByIpa, combinePronunciationByPinyin } from '@/services/pronunciation';

export default {
  name: 'WordPronunciationButton',
  props: {
    source: {
      type: String,
      default: '',
    },
    pinyin: {
      type: String,
      default: '',
    },
    ipa: {
      type: String,
      default: '',
    },
    pronunciations: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      url: '', // 音频地址
      attempt: false, // 是否进行过尝试
      accept: false, // 是否愿意语音合成
    };
  },
  computed: {
    isValid() {
      if (this.source && this.source !== 'null') return true;
      if (this.hasRelatedPronunciation()) return true;
      if (!this.attempt) return true;
      return !!this.url;
    },
  },
  methods: {
    hasRelatedPronunciation() {
      return this.pronunciations && this.pronunciations.length > 0;
    },
    getFirstRelatedPronunciation() {
      if (!this.hasRelatedPronunciation()) return null;
      return this.pronunciations[0];
    },
    play() {
      if (this.source && this.source !== 'null') {
        playAudio(this.source);
        return;
      }
      
      // Try to play related pronunciation first
      const relatedPronunciation = this.getFirstRelatedPronunciation();
      if (relatedPronunciation && relatedPronunciation.pronunciation
          && relatedPronunciation.pronunciation.source) {
        playAudio(relatedPronunciation.pronunciation.source);
        return;
      }

      if (this.accept) this.playUrl();
      else {
        uni.showModal({
          title: '暂无有效人声录音',
          content: '是否尝试播放合成语音？合成语音仅供参考，不保证其正确性！',
          confirmText: '继续',
          success: async (res) => {
            if (res.confirm) {
              this.accept = true;
              await this.playUrl();
            }
          },
          complete: () => {
            this.attempt = true;
          },
        });
      }
    },
    async playUrl() {
      if (!this.url && this.ipa) this.url = await combinePronunciationByIpa(this.ipa);
      if (!this.url && this.pinyin) this.url = await combinePronunciationByPinyin(this.pinyin);
      if (this.url) {
        playAudio(this.url);
      } else {
        uni.showToast({
          title: '无法合成有效语音',
          icon: 'error',
        });
      }
    },
  },
};
</script>

<style scoped></style>
