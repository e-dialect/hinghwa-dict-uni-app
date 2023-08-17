<template>
  <view>
    <cu-custom title="词单列表" />
    <view class="cu-bar search bg-white">
      <view class="search-form round">
        <text class="cuIcon-search" />
        <input
          type="text"
          placeholder="请输入词单关键词哦"
          :value="keywordTmp"
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
    <scroll-view
      :scroll-y="true"
      style="height: 85vh"
      :refresher-enabled="true"
      refresher-default-style="none"
      refresher-background="white"
      :refresher-triggered="triggered"
      @refresherpulling="onPulling"
      @refresherrefresh="onRefresh"
    >
      <ListPage :word-list="lists" />
      <view class="stand-view" />
    </scroll-view>
  </view>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import ListPage from '@/components/ListPage.vue';
import { getWordLists, getWordListDetails } from '@/services/website';

const app = getApp();
export default {
  components: {
    ListPage,
  },
  data() {
    return {
      lists: [],
	  page: 1,
	  triggered: false,
	  keyword: '',
	  keywordTmp: '',
	  curpage: 1,
    };
  },
  onLoad() {
    this.freshing = false;
  },
  beforeMount() {
    this.getWordLists();
  },
  methods: {
	  /**
	   * 获取词单列表
	   * @returns {Promise<void>}
	   */
	  async getWordLists() {
	    const res = await getWordLists();
	    this.lists = res.lists;
	  },
	  onPulling() {
	    this.triggered = true;
	  },

	  // 下拉刷新
	  onRefresh() {
	    if (this.freshing) {
	      return;
	    }
	    this.freshing = true;
	    this.getWordList();
	    setTimeout(() => {
	      this.triggered = false;
	      this.freshing = false;
	    }, 500);
	  },
	  getInput(e) {
	    this.keywordTmp = e.detail.value;
	  },

	  search() {
	    const { keywordTmp } = this;

	    if (keywordTmp === '') {
	      uni.showToast({
	        title: '请输入要查询的关键词！',
	        icon: 'none',
	      });
	    } else {
	      this.keyword = keywordTmp;
	      this.curPage = 1;
	      this.getPageData(this.keyword, 1);
	    }
	  },
  },
};

</script>

<style scoped>
.word-lists {
  padding: 16px;
}

.list-item {
  border-bottom: 1px solid #ccc;
  padding: 8px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-name {
  font-size: 18px;
  font-weight: bold;
}

.update-time {
  font-size: 14px;
  color: #999;
}

</style>
