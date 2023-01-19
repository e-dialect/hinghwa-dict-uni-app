<template>
  <view>
    <cu-custom title="语记·搜索" />
    <scroll-view
      scroll-y
      class="scrollPage"
    >
      <!--搜索栏-->
      <view class="cu-bar search bg-white">
        <view class="search-form round">
          <text class="cuIcon-search" />
          <input
            v-model="keywords"
            type="text"
            placeholder="兴化语记"
            :focus="true"
            confirm-type="search"
            @confirm="search"
            @input="keyFun"
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

      <!--搜索类型-->
      <view class="flex bg-white">
        <view
          v-for="(scope,index) in searchScopes"
          :key="index"
          class="flex-sub text-center title"
        >
          <view
            :class="index===searchScopeIndex ? 'w_after' : 'w_active'"
            @click="checkout(index)"
          >
            {{ scope }}
          </view>
        </view>
      </view>

      <!-- 搜索历史 -->
      <view v-show="!isShow">
        <view class="padding">
          <view class="margin-bottom">
            <text class="text-bold">
              搜索历史:
            </text>
          </view>
          <view
            v-if="historyList.length === 0"
            class="text-gray text-center"
          >
            <text>—— 暂时没有任何搜索记录 ——</text>
          </view>
          <view
            v-else
            class="flex flex-wrap"
          >
            <view
              v-for="(item, index) in historyList"
              :key="index"
              class="cu-btn round bg-white margin-right-xs margin-bottom-sm"
              style="height: 55upx;line-height: 55upx"
            >
              <text
                @tap="keywords = item"
                @click="search"
              >
                {{ item }}
              </text>
            </view>
          </view>
          <view class="margin-top-sm text-center">
            <text
              class="text-gray cuIcon-delete"
              @click="cleanHistory"
            >
              清空历史
            </text>
          </view>
        </view>
      </view>

      <!--搜索结果-->
      <view
        v-show="isShow"
        v-if="searchContent"
      >
        <word-full-list
          v-if="searchScopes[searchScopeIndex]==='词语'"
          :words="words || []"
        />
        <character-pinyin-list
          v-else-if="searchScopes[searchScopeIndex]==='字音'"
          :characters="characters || []"
        />
        <ArticleList
          v-else-if="searchScopes[searchScopeIndex]==='文章'"
          :article-list="articles || []"
        />
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { searchCharacters } from '@/services/character';
import { getWords, searchWords } from '@/services/word';
import { searchArticles } from '@/services/article';
import ArticleList from '@/components/ArticleList';
import WordFullList from '@/components/WordFullList';
import CharacterPinyinList from '@/components/CharacterPinyinList';
import { defaultMessage } from '@/services/shareMessages';

export default {
  components: {
    CharacterPinyinList,
    WordFullList,
    ArticleList,
  },
  data() {
    return {
      searchContent: 0, // 当前搜索内容
      searchScopeIndex: 0, // 当前搜索范围序号
      searchScopes: ['词语', '字音', '文章'], // 搜索范围
      keywords: '', // 搜索关键字（输入）
      characters: null, // 搜索结果：字音
      words: null, // 搜索结果：词语
      articles: null, // 搜索结果：文章
      historyList: [], // 历史记录列表
      isShow: false, // 历史记录展示
    };
  },
  onLoad(option) {
    if (option.index) {
      this.searchScopeIndex = Number(option.index);
    }
    if (option.keywords) {
      this.keywords = option.keywords;
      this.search();
    }
    try {
      this.historyList = JSON.parse(uni.getStorageSync('search_history'));
    } catch (error) {
      this.historyList = [];
    }
  },
  /**
   * 右上角分享事件
   */
  onShareAppMessage() {
    const path = `/pages/search?index=${this.searchScopeIndex}&keywords=${this.keywords}`;
    return {
      title: `语记·搜索：${this.keywords}`,
      path,
      ...defaultMessage(),
    };
  },
  methods: {
    /**
     * 调整历史记录显示
     */
    keyFun() {
      if (this.keywords === '') {
        this.isShow = false;
      }
    },

    /**
     * 搜索
     */
    search() {
      if (this.keywords === '') {
        uni.showToast({
          title: '搜索内容为空！',
          icon: 'error',
        });
        return;
      }
      this.searchContent = this.keywords;
      this.articles = null;
      this.words = null;
      this.characters = null;
      this.searchJob(this.keywords);
    },

    /**
     * 切换搜索类型
     * @param index 搜索类型序号
     */
    checkout(index) {
      this.searchScopeIndex = index;
      if (this.searchContent) this.searchJob(this.searchContent);
    },

    /**
     * 执行搜索任务
     * @param keywords 关键词
     * @returns {Promise<void>}
     */
    async searchJob(keywords) {
      switch (this.searchScopes[this.searchScopeIndex]) {
        case '词语':
          if (this.words === null) {
            const res = await searchWords(keywords);
            await getWords(res.words).then(async (res1) => {
              this.words = res1.words;
            });
          }
          break;
        case '字音':
          if (this.characters === null) {
            await searchCharacters(keywords).then(async (res) => {
              this.characters = res.characters;
            });
          }
          break;
        case '文章':
          if (this.articles === null) {
            this.articles = await searchArticles(keywords);
          }
          break;
        default:
          uni.showToast({
            title: '未知搜索项',
            icon: 'none',
          });
      }
      this.isShow = true;
      if (!this.historyList.includes(keywords)) {
        this.historyList.unshift(keywords);
        uni.setStorage({
          key: 'search_history',
          data: JSON.stringify(this.historyList),
        });
      } else {
        // 已有搜索记录
        const i = this.historyList.indexOf(keywords);
        this.historyList.splice(i, 1);
        this.historyList.unshift(keywords);
        uni.setStorage({
          key: 'search_history',
          data: JSON.stringify(this.historyList),
        });
      }
    },

    /**
     * 清空历史记录
     */
    cleanHistory() {
      if (this.historyList.length === 0) {
        uni.showToast({
          icon: 'none',
          title: '没有任何搜索记录',
        });
      } else {
        uni.showModal({
          content: '确定要清空全部历史记录吗？',
          success: (res) => {
            if (res.confirm) {
              uni.removeStorage({
                key: 'search_history',
              });
              this.historyList = [];
            }
          },
        });
      }
    },
  },
};
</script>

<style scoped>
.title {
width: 530rpx;
height: 78rpx;
margin: auto;
justify-content: space-between;
margin-top: 47rpx;
color: #7F7F7F;
font-size: 40rpx;
font-weight: bold;
text-align: center;
}

.w_after {
color: #212121;
}

.w_after::after {
content: ' ';
display: block;
width: 28rpx;
height: 6rpx;
background: #2B87FF;
border-radius: 3rpx;
margin: auto;
}
</style>
