<template>
  <view>
    <!--导航栏-->
    <cu-custom title="日常用语" />

    <view class="cu-bar search bg-white">
      <view class="search-form round">
        <text class="cuIcon-search" />
        <input
          type="text"
          placeholder="欢迎光临"
          :value="keywordTmp"
          confirm-type="search"
          @input="getInput"
          @confirm="search"
        >
      </view>
      <view
        class="action"
        @tap="search"
      >
        <text class="text-blue">
          搜索
        </text>
      </view>
    </view>

    <view class="padding bg-white text-smp">
      <view class="flex margin-bottom-sm text-center solid-bottom solid-top text-bold">
        <view class="flex-sub padding-sm margin-xs">
          普通话
        </view>
        <view class="flex-sub padding-sm margin-xs">
          英语
        </view>
        <view class="flex-sub padding-sm margin-xs">
          莆仙正字
        </view>
        <view class="flex-twice padding-sm margin-xs">
          莆仙拼音
        </view>
      </view>
      <view
        v-for="(item, index) in pageData"
        :key="index"
        class="flex margin-bottom-sm text-center solid-bottom"
      >
        <view class="flex-sub padding-sm margin-xs">
          {{ item.mandarin }}
        </view>

        <view class="flex-sub padding-sm margin-xs">
          {{ item.english }}
        </view>

        <view class="flex-sub padding-sm margin-xs">
          {{ item.character }}
        </view>

        <view class="flex-twice padding-sm margin-xs">
          {{ item.pinyin }}
        </view>
      </view>
    </view>

    <view class="flex margin-bottom-sm text-center text-smp">
      <view class="flex-sub padding-sm margin-xs" />
      <button
        class="flex-twice padding-sm margin-xs cu-btn bg-blue shadow"
        @tap="previous"
      >
        上一页
      </button>
      <view class="flex-treble padding-sm margin-xs">
        {{ curPage }}/{{ pageNum }}
      </view>
      <button
        class="flex-twice padding-sm margin-xs cu-btn bg-blue shadow"
        @tap="next"
      >
        下一页
      </button>
      <view class="flex-treble padding-sm margin-xs">
        共{{ itemNum }}条
      </view>
    </view>
    <view class="stand-view" />
  </view>
</template>

<script>
import { getDailyExpressions } from '@/services/website';
import { defaultMessage } from '@/services/shareMessages';

const app = getApp();
export default {
  data() {
    return {
      StatusBar: app.globalData.StatusBar,
      CustomBar: app.globalData.CustomBar,
      pageData: [],
      pageNum: 0,
      itemNum: 0,
      curPage: 1,
      keyword: '',
      keywordTmp: '',
    };
  },
  onLoad() {
    const keyword = '';
    const page = 1;
    this.getPageData(keyword, page);
  },
  /**
   * 右上角分享事件
   */
  onShareAppMessage() {
    return {
      title: '日常用语',
      path: '/pages/tools/daily-expression/index',
      ...defaultMessage(),
    };
  },
  methods: {
    getPageData(keyword, page) {
      getDailyExpressions(keyword, page, 15).then((res) => {
        this.pageData = res.results;
        this.pageNum = res.total.page;
        this.itemNum = res.total.item;
      });
    },

    getInput(e) {
      this.keywordTmp = e.detail.value;
    },

    search() {
      const { keywordTmp } = this;

      if (keywordTmp === '') {
        uni.showToast({
          title: '搜索内容为空！',
          icon: 'none',
        });
      } else {
        this.keyword = keywordTmp;
        this.curPage = 1;
        this.getPageData(this.keyword, 1);
      }
    },

    previous() {
      const { curPage } = this;

      if (curPage === 1) {
        uni.showToast({
          title: '当前页为第一页！',
          icon: 'none',
        });
      } else {
        this.curPage = curPage - 1;
        this.getPageData(this.keyword, curPage - 1);
      }
    },

    next() {
      const { curPage } = this;

      if (curPage >= this.pageNum) {
        uni.showToast({
          title: '当前页为末尾页！',
          icon: 'none',
        });
      } else {
        this.curPage = curPage + 1;
        this.getPageData(this.keyword, curPage + 1);
      }
    },
  },
};
</script>
<style>
page {
  background-color: white;
}

.box {
  margin: 20rpx 0;
}

.box view.cu-bar {
  margin-top: 20rpx;
}
</style>
