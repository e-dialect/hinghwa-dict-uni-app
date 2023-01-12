<template>
  <view>
    <scroll-view
      scroll-y
      class="scrollPage"
    >
      <image
        src="/static/images/word.png"
        mode="aspectFill"
        style="width: 100%"
      />
      <view
        class="text-xl text-white back"
        @tap="back"
      >
        <text class="cuIcon-back" />
      </view>
      <!-- <view style="box-shadow:0 -10px 40px 60px #f7f7f7;position:relative;z-index:100;"></view> -->
      <view
        class="layout-index"
        style="z-index: 100"
      >
        <view class="flex card padding-sm">
          <view
            class="flex-sub text-center text-bold text-slp margin-right-sm"
            style="border: 1px solid grey"
          >
            {{ word.word }}
          </view>
          <view class="flex-twice flex flex-direction justify-center">
            <view class="flex justify-between">
              <view class="text-grey">
                日期：
                <text class="text-blue">
                  {{ date }}
                </text>
              </view>
              <view class="text-grey">
                <text class="cuIcon-attention" />
                {{ word.views }}
              </view>
            </view>
            <view class="margin-top-sm text-grey">
              来源：
              <text
                class="text-blue"
                @tap="toVisitor"
              >
                {{ word.contributor.username }}
              </text>
            </view>
          </view>
        </view>
        <view class="card padding margin-top-lg">
          <view class="text-bold text-xl">
            释义
          </view>
          <view class="text-grey margin-top-sm">
            {{ word.definition }}
          </view>
        </view>
        <view class="flex">
          <view class="flex-sub card-other padding">
            <view>
              <text class="text-bold text-xl">
                相关词语
              </text>
              <text class="text-grey text-sm">
                （{{ word.related_words.length }}个）
              </text>
            </view>
            <view
              v-for="(item, index) in related_words"
              :key="index"
              class="flex justify-between margin-top-sm"
              :data-id="index"
              @tap="getMore"
            >
              <view class="text-df">
                {{ item.word }}
              </view>

              <view class="cuIcon-right text-gray" />
            </view>
          </view>
          <view class="flex-sub card-pth padding">
            <view class="text-bold text-xl">
              普通话
            </view>
            <text
              v-for="(item, index) in word.mandarin"
              :key="index"
              class="text-df text-grey margin-top-sm"
            >
              {{ item }}
            </text>
          </view>
        </view>
        <view class="card padding-sm">
          <view>
            <text class="text-bold text-xl">
              相关文章
            </text>
            <text class="text-grey text-sm">
              （{{ word.related_articles.length }}篇）
            </text>
          </view>
          <view
            v-for="(item, index) in related_articles"
            :key="index"
            class="article"
          >
            <image
              :src="item.article.cover"
              mode="aspectFill"
            />

            <view class="des">
              <view class="flex justify-between">
                <view class="text-bold-less text-lg">
                  {{ item.article.title }}
                </view>
                <view class="text-grey margin-top-mini">
                  <text class="cuIcon-attention" />
                  {{ item.article.views }}
                </view>
              </view>
              <view class="content">
                {{ item.article.content }}
              </view>
            </view>
          </view>
        </view>
        <view class="card padding">
          <view class="flex justify-between">
            <view class="text-bold text-xl">
              附注
            </view>
            <view class="text-xl margin-right-xs margin-top-mini">
              <text class="cuIcon-write text-grey" />
            </view>
          </view>
          <view class="text-grey margin-top-sm">
            {{ word.annotation }}
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import {getArticles} from "@/services/article";
import {getWords}    from "@/services/word";

const app = getApp();
export default {
    data() {
        return {
            word: {
                word: '',

                contributor: {
                    username: ''
                },

                definition: '',
                related_words: [],
                mandarin: [],
                related_articles: [],
                annotation: ''
            },
            date: '',
            related_words: [],
            related_articles: []
        };
    },
    onLoad(options) {
        this.setData({
            word: JSON.parse(options.word)
        }); // 获取日期

        this.getDate(); // 获取相关词语

        this.getRelatedWords(); // 获取相关文章

        this.getRelatedArticles();
    },
    methods: {
        getDate() {
            var timestamp = Date.parse(new Date());
            var date = new Date(timestamp);
            var Y = date.getFullYear();
            var M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
            var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
            date = Y + '-' + M + '-' + D;
            this.setData({
                date: date
            });
        },

        toVisitor() {
            let id = this.word.contributor.id;
            uni.navigateTo({
                url: '/pages/about/visitor/visitor?id=' + id
            });
        },

        getRelatedWords() {
          getWords(this.word.related_words).then(res=>{
            this.related_words=this.words
          })
        },

        getRelatedArticles() {
            getArticles(this.word.related_articles).then(res => {
              this.related_articles=this.articles
            });
        },

        getMore(e) {
            let index = e.currentTarget.dataset.id;
            let word = JSON.stringify(this.related_words[index]);
            uni.navigateTo({
                url: '/pages/basics/word/word?word=' + word
            });
        },

        back() {
            uni.navigateBack({
                delta: 1
            });
        }
    }
};
</script>
<style>
.word-bg {
    background-size: cover;
    height: 600rpx;
    display: flex;
    padding-top: 40rpx;
    overflow: hidden;
    position: relative;
    flex-direction: column;
    color: #ffffff;
    font-weight: 400;
    text-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
}

.back {
    position: absolute;
    top: 5vh;
    left: 5vw;
}

.card {
    background-color: #ffffff;
    border-radius: 20rpx;
    margin: 4vw;
}

.card-other {
    background-color: #ffffff;
    border-radius: 20rpx;
    margin-left: 4vw;
    margin-right: 2vw;
}

.card-pth {
    background-color: #ffffff;
    border-radius: 20rpx;
    margin-left: 2vw;
    margin-right: 4vw;
}

.article {
    display: flex;
    padding: 30rpx 0;
}

.article image {
    width: 240rpx;
    height: 6.4em;
    margin-right: 20rpx;
    border-radius: 6rpx;
}

.des {
    flex: 1;
    /* display: flex; */
    /* flex-direction: column; */
    /* justify-content: space-between; */
}

.content {
    margin-top: 15rpx;
    font-size: 26rpx;
    color: #888;
    height: 4.2em;
    display: -webkit-box;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
