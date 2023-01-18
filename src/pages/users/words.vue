<template>
  <view>
    <!-- TODO 分页-->
    <cu-custom title="用户词语" />
    <word-list-showing :word-list="words || []" />
  </view>
</template>

<script>
import { filterUserWords } from '@/services/word';
import CuCustom from '@/colorui/components/cu-custom';
import WordListShowing from '@/components/WordListShowing';

export default {
  name: 'UserWords',
  components: { WordListShowing, CuCustom },
  data() {
    return {
      words: null,
    };
  },
  async onLoad(options) {
    await this.getUserWords(options.id);
  },
  methods: {
    async getUserWords(id) {
      await filterUserWords(id).then((res) => {
        this.words = res.result;
      });
    },
  },
};
</script>

<style scoped>

</style>
