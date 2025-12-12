<template>
  <text
    v-if="isValid"
    class="cuIcon-notificationfill text-xl text-blue margin-sm"
    @tap="play"
  />
</template>

<script>
import { playAudio } from '@/utils/audio';
import { combinePronunciationByIpa, combinePronunciationByPinyin, getPronunciations } from '@/services/pronunciation';

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
    wordId: {
      type: [Number, String],
      default: null,
    },
  },
  data() {
    return {
      url: '', // 音频地址
      attempt: false, // 是否进行过尝试
      accept: false, // 是否愿意语音合成
      firstPronunciation: null, // 词条的第一条语音
      loading: false, // 是否正在加载
    };
  },
  computed: {
    isValid() {
      if (this.source && this.source !== 'null') return true;
      if (this.firstPronunciation?.pronunciation?.source) return true;
      if (!this.attempt) return true;
      return !!this.url;
    },
  },
  async mounted() {
    if (this.wordId) {
      await this.loadFirstPronunciation();
    }
  },
  methods: {
    async loadFirstPronunciation() {
      if (this.loading) return;
      this.loading = true;
      try {
        const pronunciations = await getPronunciations({ word: this.wordId, pageSize: 1, page: 1 });
        if (pronunciations && pronunciations.length > 0) {
          const [firstPronunciation] = pronunciations;
          this.firstPronunciation = firstPronunciation;
        }
      } catch (e) {
        // Silently fail
      } finally {
        this.loading = false;
      }
    },
    async play() {
      // Priority 1: Complete match (exact IPA source)
      if (this.source && this.source !== 'null') {
        playAudio(this.source);
        return;
      }

      // Priority 2: First pronunciation of this word
      if (this.firstPronunciation?.pronunciation?.source) {
        playAudio(this.firstPronunciation.pronunciation.source);
        return;
      }

      // Priority 3: AI synthesis
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
