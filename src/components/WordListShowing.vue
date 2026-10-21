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
          v-if="item.id !== null && !item.loadError"
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
        v-if="item.id === null && !showContributionInvitation"
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
      <view
        v-if="item.rolePending"
        class="text-gray text-sm margin-top-sm"
      >
        关系角色已登记，方言称谓仍待核定；欢迎提供有来源的实际说法，请勿直接把角色占位当作词形。
      </view>
      <button
        v-if="item.loadError"
        class="cu-btn bg-gray margin-top-sm"
        @tap="$emit('retry')"
      >
        重试加载
      </button>
    </view>
    <view
      v-if="showContributionInvitation"
      class="text-gray text-sm padding"
    >
      <text>你还有更多说法，或想把纸面说法整理成正式词条？欢迎通过</text>
      <text
        class="text-blue"
        @tap="toTuxiaochaoPage()"
      >
        反馈
      </text>
      <text>或在</text>
      <text
        class="text-blue"
        @tap="toWebPage()"
      >
        网页端补充词条
      </text>
      <text>。投稿目前仅进入词库，审核后还需维护者手动关联亲戚计算器，不会自动更新计算结果。</text>
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
    showContributionInvitation: {
      type: Boolean,
      default: false,
    },
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
