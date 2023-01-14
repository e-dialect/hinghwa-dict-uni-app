<template>
  <view>
    <view
      :data-source="wordList || []"
      :pagination="pagination"
    >
      <view
        v-for="(item,index) in wordList"
        :key="index"
        class="padding"
      >
        <view
          :hoverable="true"
          class="flex align-center"
          style="width: 100%;"
        >
          <view
            :description="item.definition.slice(0,100)"
            style="width: 75%;"
          >
            <view class="text-xl text-bold">
              {{ item.word }}
            </view>
            <view>
              <view
                class="text-lg"
              >
                {{ item.standard_pinyin }}
              </view>
              <view
                class="text-lg text-gray"
              >
                {{ item.standard_ipa }}
              </view>
            </view>
            <view class="definition">
              {{ item.definition }}
            </view>
          </view>
          <view class="margin-right margin-bottom">
            <button
              type="link"
              class="cu-btn bg-blue shadow"
            >
              <view @tap="toWordPage(item.id)">
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
import { toWordPage } from '@/routers';

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
      toWordPage,
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
.definition{
  overflow: hidden;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
</style>
