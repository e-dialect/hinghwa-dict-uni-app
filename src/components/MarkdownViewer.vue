<template>
  <view>
    <u-parse :content="text"></u-parse>
  </view>
</template>

<script>
import {marked} from 'marked';
import uParse   from '../utils/u-parse/u-parse';

export default {
  name: "MarkdownViewer",
  components: {
    uParse
  },
  props: {
    markdown: {
      type: String,
      default: '',
    },
  },
  computed: {
    text() {
      console.log(marked(this.markdown))
      return marked(this.markdown);
    }
  },
}
</script>

<style scoped>

</style>
