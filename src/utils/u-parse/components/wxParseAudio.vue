<template>
  <!--增加audio标签支持-->
  <audio
      :id="node.attr.id"
      :author="node.attr.author"
      :class="node.classStr"
      :loop="node.attr.loop"
      :name="node.attr.name"
      :poster="node.attr.poster"
      :src="node.attr.src"
      :style="node.styleStr"
      controls></audio>
</template>

<script>
export default {
  name: 'wxParseAudio',
  props: {
    node: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>
