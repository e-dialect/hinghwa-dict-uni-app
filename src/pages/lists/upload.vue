<template>
  <view>
    <cu-custom title="词单·创建" />
    <view class="container">
      <view>
        <p class="titleWord">
          创建属于你的词单吧~
        </p>
        <input
          v-model="name"
          type="text"
          placeholder="请输入词单名称"
        >
      </view>
      <view class="divider" />
      <view>
        <textarea
          v-model="description"
          style="height:150rpx;"
          placeholder="词单描述"
        />
      </view>
      <view>
        <button
          class="buttonStyle"
          @tap="hideMore"
        >
          {{ isShow ? '隐藏' : '显示' }}更多词汇
        </button>
      </view>
      <view class="divider" />
      <view />
      <view class="cu-bar search ">
        <view class="search-form round">
          <text class="cuIcon-search" />
          <input
            v-model="keywords"
            type="text"
            placeholder="输入想找的词语"
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
      <view
        v-for="(word, index) in wordNameList"
        :key="index"
        style="display: flex; align-items: center;"
      >
        <view class="chooseWords">
          {{ word }}
        </view>
        <view
          style="margin-left: 10rpx; font-size: 50rpx;"
          @tap="removeWord(index)"
        >
          ×
        </view>
      </view>
      <view
        v-show="isShow"
        v-if="searchContent"
      >
        <ChooseWordListAdd
          :words="words || []"
          @addCheck="addWord"
        />
      </view>
      <view>
        <button @tap="createWordList">
          创建词单
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import { getWords, searchWords, getWordDetailss } from '@/services/word';
import ChooseWordListAdd from '@/components/ChooseWordListAdd.vue';
import { postWordList } from '@/services/lists';

export default {
  components: {
    ChooseWordListAdd,
  },
  data() {
    return {
      isShow: false,
      name: '',
      description: '',
      searchContent: 0,
      keywords: null,
      words: null,
      wordName: '',
      wordNameList: [],
      wordlist: [],
    };
  },

  methods: {
    hideMore() {
      this.isShow = !this.isShow;
    },
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
    async searchJob(keywords) {
      if (this.words === null) {
        const res = await searchWords(keywords);
        await getWords(res.words).then(async (res1) => {
          this.words = res1.words;
        });
      }
      this.isShow = true;
    },
    addWord(data) {
      if (this.wordlist.indexOf(data) === -1) {
        this.wordlist.push(data);
        uni.showToast({
          title: '添加成功！',
          icon: 'success',
          duration: 2000,
        });
        getWordDetailss(data).then((res) => {
          this.wordName = res.word.word;
          this.wordNameList.push(this.wordName);
        });
      } else {
        uni.showToast({
          title: '添加失败！已经添加过该词！',
          icon: 'error',
          duration: 2000,
        });
      }
    },

    removeWord(index) {
      this.wordNameList.splice(index, 1);
      this.wordlist.splice(index, 1);
    },
    createWordList() {
      // 构造词单对象
      const wordList = {
        name: this.name,
        description: this.description,
        words: Array.from(this.wordlist),
      };
      postWordList(wordList).then((response) => {
        if (response.id != null) {
          uni.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 2000,
          });
        } else {
          uni.showToast({
            title: '操作失败',
            icon: 'none',
            duration: 2000,
          });
        }
      })
        .catch(() => {
          uni.showToast({
            title: '请求出错',
            icon: 'none',
            duration: 2000,
          });
        });
    },
  },
};
</script>

<style scoped>
.container {
  padding: 20px;
}

input,
textarea {
  width: 100%;
  margin-bottom: 10px;
}

.divider {
  height: 1rpx;
  background-color: #ccc;
  margin: 20rpx 0; /* 调整分割线的间距 */
}

button {
  margin-top: 10px;
}

.chooseWords {
  border: 1rpx solid #7a7a7a;
  border-radius: 100rpx;
  padding-left: 15rpx;
  padding-right: 15rpx;
  padding-top: 3rpx;
  padding-bottom: 3rpx;
  font-size: 35rpx;
  margin-bottom: 10rpx;
  margin-left: 20rpx;
}

.titleWord {
  text-align: center;
  padding: 20rpx;
  border-radius: 10rpx;
  background-image: linear-gradient(to right, #e3e0ff, #c1ddc3);
  font-size: 30rpx;
  font-family: "幼圆";
  margin-bottom: 15rpx;
  font-weight: bold;
  color: #39C5BB;
  letter-spacing: 5rpx;
}

.buttonStyle {
  background-color: #39C5BB;
  color: white;
}
</style>
