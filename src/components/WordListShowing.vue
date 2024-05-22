<template>
  <view class="cu-list">
    <view
      v-for="(item,index) in wordList"
      :key="index"
      class="padding cu-item"
    >
      <view
        class="flex align-center"
        style="width: 100%;"
      >
        <view style="width: 75%;">
          <view class="text-xl text-bold">
            {{ item.word }}
          </view>
          <view>
            <view class="text-lg">
              {{ item.standard_pinyin }}
            </view>
            <view class="text-lg text-gray">
              {{ item.standard_ipa }}
            </view>
          </view>
          <view class="definition">
            {{ item.definition }}
          </view>
        </view>

        <view
          v-if="item.id !== null"
          class="margin-right"
        >
          <button
            type="link"
            class="cu-btn bg-blue shadow"
          >
            <view
              @tap="toWordPage(item.id)"
            >
              更多
            </view>
          </button>
        </view>
      </view>
      <view
        v-if="item.id === null"
        class="text-gray text-sm margin-top-sm"
      >
        <text>词条欠缺，请</text>
        <text
          class="text-blue cuIcon-link"
          @tap="toTuxiaochaoPage()"
        >
          反馈
        </text>
        <text>给管理员或在</text>
        <text
          class="text-blue cuIcon-link"
          @tap="toWebPage()"
        >
          网页端
        </text>
        <text>补充词条~</text>
      </view>
    </view>
    <view
      v-if="wordList.length === 0"
      class="text-center margin"
    >
      <text class="text-lg text-gray">
        --- 暂无数据 ---
      </text>
    </view>
  </view>
</template>

<script>
import { toWordPage } from '@/routers/word';
import { toTuxiaochaoPage } from '@/routers';

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
      toTuxiaochaoPage,
    };
  },
  methods: {
    toWebPage() {
      switch (uni.getSystemInfoSync().uniPlatform) {
        case 'web':
          window.location.href = 'https://hinghwa.cn/words/Create';
          break;
        default:
          uni.setClipboardData({
            data: 'https://hinghwa.cn/words/Create',
            success: () => uni.showToast({ title: '网址已复制' }),
          });
      }
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
