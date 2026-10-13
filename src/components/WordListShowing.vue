<template>
  <view class="cu-list">
    <template v-if="compact">
      <view
        v-for="item in wordList"
        :key="item.termId"
        class="kinship-word"
      >
        <view class="kinship-word-heading">
          <text
            class="kinship-word-title"
            @tap="openCompactWord(item)"
          >
            {{ item.word }}
          </text>
          <text
            v-if="item.status === 'missingWord'"
            class="kinship-badge"
          >
            待补录
          </text>
          <button
            v-if="item.status === 'bound' && !item.loadError"
            class="kinship-details"
            aria-label="查看词条"
            @tap="toWordPage(item.id)"
          >
            ›
          </button>
        </view>
        <view
          v-if="item.standard_pinyin || item.standard_ipa"
          class="kinship-pronunciation"
        >
          <text>{{ item.standard_pinyin }}</text>
          <text v-if="item.standard_ipa">
            / {{ item.standard_ipa }} /
          </text>
        </view>
        <view
          v-if="item.status === 'bound'"
          class="kinship-definition"
        >
          {{ item.definition }}
        </view>
        <button
          v-if="item.loadError"
          class="kinship-retry"
          @tap="$emit('retry')"
        >
          重试加载
        </button>
      </view>
    </template>
    <template v-else>
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
    </template>
    <view
      v-if="showContributionInvitation"
      class="kinship-contribution"
    >
      <text>有更多说法？</text>
      <text
        class="text-blue"
        @tap="toTuxiaochaoPage()"
      >
        反馈
      </text>
      <text>·</text>
      <text
        class="text-blue"
        @tap="toWebPage()"
      >
        补充词条
      </text>
      <button
        class="kinship-help"
        aria-label="投稿说明"
        :aria-expanded="contributionHelpOpen"
        @tap="contributionHelpOpen = !contributionHelpOpen"
      >
        ?
      </button>
    </view>
    <view
      v-if="showContributionInvitation && contributionHelpOpen"
      class="kinship-help-panel"
    >
      也欢迎把纸面说法整理成正式词条。投稿目前仅进入词库，审核后还需维护者手动关联亲戚计算器，不会自动更新计算结果。
    </view>
    <view
      v-if="showEmptyState && wordList.length === 0"
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
    compact: {
      type: Boolean,
      default: false,
    },
    showEmptyState: {
      type: Boolean,
      default: true,
    },
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
      contributionHelpOpen: false,
      toWordPage,
      toTuxiaochaoPage,
    };
  },
  methods: {
    openCompactWord(item) {
      if (item.status === 'bound' && !item.loadError) this.toWordPage(item.id);
    },
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
.kinship-word {
  padding: 12px 0;
  border-bottom: 1px solid #f0f2f6;
}
.kinship-word:last-child {
  border-bottom: 0;
}
.kinship-word-heading {
  display: flex;
  align-items: center;
  gap: 8px;
}
.kinship-word-title {
  color: #27374b;
  font-size: 23px;
  font-weight: 600;
}
.kinship-badge {
  color: #9aa3af;
  background: #f3f5f8;
  border-radius: 4px;
  padding: 1px 5px;
  font-size: 10px;
}
.kinship-details {
  margin: 0 0 0 auto;
  padding: 0 4px;
  color: #a3adba;
  background: transparent;
  font-size: 23px;
  line-height: 30px;
}
.kinship-pronunciation {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  color: #87909e;
  font-size: 12px;
  margin-top: 4px;
}
.kinship-definition {
  color: #647083;
  font-size: 12px;
  line-height: 1.7;
  margin-top: 5px;
}
.kinship-retry {
  padding: 0;
  margin: 5px 0 0;
  width: fit-content;
  background: transparent;
  color: #1989d6;
  font-size: 12px;
  line-height: 28px;
}
.kinship-contribution {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  padding-top: 22px;
  color: #9aa3af;
  font-size: 11px;
}
.kinship-help {
  width: 17px;
  height: 17px;
  line-height: 15px;
  padding: 0;
  margin: 0;
  border: 1px solid #d9e0e8;
  border-radius: 50%;
  background: transparent;
  color: #87909e;
  font-size: 10px;
}
.kinship-help-panel {
  padding: 12px;
  margin-top: 12px;
  color: #7b8593;
  background: #f6f8fb;
  border-radius: 8px;
  font-size: 11px;
  line-height: 1.7;
}
.kinship-details::after, .kinship-retry::after, .kinship-help::after {
  border: none;
}
.definition{
  overflow: hidden;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
</style>
