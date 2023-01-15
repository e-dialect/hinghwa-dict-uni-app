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
      <view class="flex">
        <view
          v-for="(scope,index) in searchScopes"
          class="flex-sub text-center"
        >
          <button
            v-if="index===searchScopeIndex"
            :key="index"
            class="bg-blue text-white"
            @tap="checkout(index)"
          >
            {{ scope }}
          </button>
          <button
            v-else
            :key="index"
            class="flex-sub text-center text-black"
            @tap="checkout(index)"
          >
            {{ scope }}
          </button>
        </view>
      </view>

      <!--搜索结果-->
      <view v-if="searchContent">
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

      <!--TODO 搜索历史-->
      <!--      <view v-else>-->
      <!--        暂无搜索历史-->
      <!--      </view>-->
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
import { defaultMessage } from '@/routers/shareMessages';

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
  },
  /**
   * 右上角分享事件
   */
  onShareAppMessage() {
    const path = `/pages/search?index=${this.searchScopeIndex}&keywords=${this.keywords}`;
    return {
      title: '语记·搜索',
      path,
      ...defaultMessage(),
    };
  },
  methods: {
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
    },
  },
};
</script>
