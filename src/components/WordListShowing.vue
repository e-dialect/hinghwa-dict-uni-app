<template>
  <view>
    <view
      :data-source="wordList || []"
      :pagination="pagination"
    >
      <view
        v-for="(item,index) in wordList"
        :key="index"
      >
        <view
          :hoverable="true"
          style="width: 100%;"
        >
          <view :description="item.definition.slice(0,100)">
            <view>
              <view class="text-xl text-bold">
                <view
                  :to="{name:'WordDetails',params:{id:item.id.toString()}}"
                  style="color:black"
                >
                  {{ item.word }}
                </view>
              </view>
              <view
                class="text-lg"
                style="padding-left: 10px"
              >
                {{ item.standard_pinyin }}
              </view>
              <view
                class="text-lg"
                style="color: rgb(155,155,155);padding-left: 10px"
              >
                / {{ item.standard_ipa }}/
              </view>
            </view>
          </view>
          <view class="align-end">
            <button type="link">
              <view :to="{name:'WordDetails',params:{id:item.id.toString()}}">
                更多
                <view type="double-right" />
              </view>
            </button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'WordListShowing',
  props: {
    wordList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
    };
  },
  computed: {
    pagination() {
      return {
        showQuickJumper: true,
      };
    },
  },
};
</script>

<style scoped>

</style>
