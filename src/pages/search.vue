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

      <view
        v-show="!isShow"
        class="align-center flex flex-direction cu-bar foot"
      >
        <button
          class="cu-btn icons bg-blue shadow margin-top"
          @longpress="startRecord"
          @touchend="stopRecord"
        >
          <text
            class="cuIcon-voice"
            style="font-size: 50upx;"
          />
        </button>
        <view class="text-bold margin-bottom">
          <text v-if="status === 0">
            长按开始语音搜索
          </text>
          <text v-else>
            松开结束搜索
          </text>
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
import { defaultMessage } from '@/services/shareMessages';
import ArticleList from '@/components/ArticleList.vue';
import WordFullList from '@/components/WordFullList.vue';
import CharacterPinyinList from '@/components/CharacterPinyinList.vue';
import { pronunciationTranslation } from '../services/pronunciation';

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
      status: -1,
      source: '',
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(option) {
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

    // 准备录音器
    const that = this;
    // #ifdef H5
    // 查看是否支持本浏览器
    if (navigator.mediaDevices.getUserMedia) {
      // 尝试获取麦克风权限
      const constraints = { audio: true };
      navigator.mediaDevices.getUserMedia(constraints).then(
        // 成功回调
        (stream) => {
          this.recorderManager = new MediaRecorder(stream);
          let chunks = [];

          // 录音开始
          this.recorderManager.onstart = () => {
            chunks = [];
          };
          // 录音过程中
          this.recorderManager.ondataavailable = (e) => {
            chunks.push(e.data);
          };
          // 录音停止
          this.recorderManager.onstop = () => {
            const blob = new Blob(chunks, { type: that.recorderManager.mimeType });
            that.setSource(window.URL.createObjectURL(blob));
          };

          this.status = 0;
        },
        // 失败回调
        () => {
          uni.showToast({
            title: '授权录音失败',
            icon: 'error',
          });
        },
      );
    } else {
      uni.showToast({
        title: '不支持本浏览器',
        icon: 'error',
      });
    }
    // #endif

    // #ifndef H5
    this.recorderManager = uni.getRecorderManager();
    /* this.recorderManager.onError(() => {
      uni.showToast({
        title: '录音失败',
        icon: 'none',
      });
    }); */
    this.recorderManager.onStop((res) => {
      that.setSource(res.tempFilePath);
    });
    this.status = 0;
    // #endif
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

    /**
     * 开始录音
     */
    startRecord() {
      if (this.status === -1) {
        uni.showToast({
          title: '请先授权录音',
          icon: 'error',
        });
        return;
      }
      this.status = 1;
      uni.showToast({
        title: '正在识别...',
        icon: 'none',
      });
      this.recorderManager.start();
    },

    /**
     * 停止录音
     */
    async stopRecord() {
      this.status = 0;
      this.recorderManager.stop();
      await this.translateRecord();
    },

    /**
     * 设置录音文件
     * @param source {string} 录音文件路径
     */
    setSource(source) {
      this.source = source;
      uni.showToast({
        title: '识别成功',
      });
    },

    /**
     * 重新录音
     */
    reRecord() {
      this.source = '';
    },

    /**
     * 翻译
     */
    async translateRecord() {
      await pronunciationTranslation(this.source).then((res) => {
        this.keywords = res;
      });
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
