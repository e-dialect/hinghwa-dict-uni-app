<template>
  <view>
    <scroll-view
      scroll-y
      class="scrollPage"
      :refresher-enabled="true"
      refresher-default-style="none"
      refresher-background="white"
      :refresher-triggered="triggered"
      @refresherrefresh="onRefresh"
    >
      <image
        src="https://cos.edialect.top/miniprogram/fm.gif"
        mode="widthFix"
        style="width: 100%"
      />
      <!-- <view class="layout-index-login" style="z-index:100;">
    <view wx:if="{{status==0}}" class="index-card bg-img" style="background-image:url(https://wx3.sinaimg.cn/mw690/0084vph8ly1gsxy5mqf1oj36y01jkqd9.jpg)">
      <view class="card-name">兴化语记</view>
      <view class="card-slogan">记住乡愁 留下乡音</view>
      <button class="card-btn cu-btn round bg-black shadow" bindtap="login" style="width:22vw">一键登录</button>
    </view>
  </view> -->
      <!-- <view style="box-shadow:0 -10px 40px 45px #f7f7f7;position:relative;z-index:100;"></view> -->
      <view
        class="layout-index"
        style="z-index: 100"
      >
        <view class="welcome-card shadow -gray">
          <view
            v-if="status == 0"
            class="padding solid-bottom flex justify-between align-center"
          >
            <view>
              <view class="text-bold text-xl">
                欢迎来到兴化语记
              </view>
              <view class="text-gray margin-top-sm">
                记住乡愁 留下乡音
              </view>
            </view>
            <view>
              <button
                class="cu-btn bg-black shadow"
                style="width: fit-content"
                @tap="login"
              >
                一键登录
              </button>
            </view>
          </view>
          <view
            class="cu-bar search"
            @tap="search"
          >
            <view class="search-form round">
              <text class="cuIcon-search" />
              <input
                type="text"
                placeholder="搜索词语、单字、拼音和文章"
                confirm-type="search"
                :disabled="true"
              >
            </view>
          </view>
          <!-- <view class="flex padding align-center text-center">
        <view class="flex-sub" data-id="1" bindtap="getTools">
          <view>
            <image src="https://cos.edialect.top/miniprogram/1.png" mode="widthFix" style="width:100%"></image>
          </view>
          <view class="text-bold">拼音方案</view>
        </view>
        <view class="flex-sub" data-id="2" bindtap="getTools">
          <view>
            <image src="https://cos.edialect.top/miniprogram/2.png" mode="widthFix" style="width:100%"></image>
          </view>
          <view class="text-bold">拼音速查</view>
        </view>
        <view class="flex-sub" data-id="3" bindtap="getTools">
          <view>
            <image src="https://cos.edialect.top/miniprogram/3.png" mode="widthFix" style="width:100%"></image>
          </view>
          <view class="text-bold">条件查字</view>
        </view>
        <view class="flex-sub" data-id="4" bindtap="getTools">
          <view>
            <image src="https://cos.edialect.top/miniprogram/4.png" mode="widthFix" style="width:100%"></image>
          </view>
          <view class="text-bold">日常用语</view>
        </view>
      </view> -->
        </view>
        <!-- <view class="flex" style="margin:5vw"> -->
        <view
          class="word-card padding shadow -gray"
          style="margin: 5vw"
        >
          <view
            class="text-gray"
            style="direction: rtl"
            @tap="randomWord"
          >
            随机跳词
          </view>
          <view
            class="text-bold text-center padding text-xxlp solid-bottom"
            @tap="getMore"
          >
            {{ word.word }}
          </view>
          <view
            class="text-gray padding-top"
            @tap="getMore"
          >
            {{ word.definition }}
          </view>
        </view>
        <!-- <view class="flex-sub">
        <view class="search-card padding shadow -gray" bindtap="search">
          <view class="text-bold text-center padding text-xl">搜索</view>
          <view class="cu-bar search">
            <view class="search-form round">
              <text class="cuIcon-search"></text>
              <input placeholder="兴化语记" disabled="true"></input>
            </view>
          </view>
        </view>
        <view class="article-card padding shadow -gray" bindtap="getAnnouncement">
          <view class="text-bold text-center padding text-xl">公告</view>
          <view class="text-gray text-center">点击进入>></view>
        </view>
      </view> -->
        <!-- </view> -->
        <!-- <view class="index-search" style="border-radius:5000rpx;" bindtap="search">
      <view class="cu-bar search">
        <view class="search-form round">
          <text class="cuIcon-search"></text>
          <input type="text" placeholder="搜索词语、单字、拼音和文章" confirm-type="search" disabled="true"></input>
        </view>
      </view>
    </view> -->
        <!-- <view class="index-word shadow -gray">
      <view class="flex solid-bottom justify-between">
        <view class="padding-sm margin-xs">
          <text class="text-bold">每日一词</text>
        </view>
        <view class="padding-sm margin-xs text-grey" bindtap="randomWord">随机跳词</view>
      </view>
      <view class="flex" bindtap="getMore">
        <view class="flex-sub padding-sm margin text-center solid-right">
          <view class="text-bold text-sl">{{word.word}}</view>
        </view>
        <view class="word-sy flex-sub margin-xs text-grey">
          {{word.definition}}
        </view>
      </view>
    </view> -->
        <!-- <swiper class="screen-swiper round-dot" indicator-dots="true" circular="true" autoplay="true" interval="5000" duration="500">
      <swiper-item data-index="{{index}}" bindtap="toArticle" wx:for="{{carousels}}" wx:key>
        <image src="{{item.url}}" mode="aspectFill"></image>
      </swiper-item>
    </swiper> -->
        <!-- <view class="index-search" bindtap="search">
      <view class="flex">
        <view class="flex-treble padding-sm margin-xs radius">
          <view class="text-xl text-bold">语记·搜索</view>
          <view class="text-grey text-bold" style="margin-top:5rpx">学习了解更多莆仙方言</view>
        </view>
        <view class="flex-sub padding-sm margin-sm radius bg-img"
          style="background-image:url(https://wx2.sinaimg.cn/mw690/0084vph8ly1gsw0m4zm6wj30so0iqact.jpg)">
        </view>
      </view>
    </view> -->
        <view
          v-for="(item, index) in announcements"
          :key="index"
          class="word-card padding shadow -gray"
          style="margin: 5vw"
          :data-index="index"
          @tap="toArticle"
        >
          <image
            :src="item.article.cover"
            mode="widthFix"
            style="width: 100%"
          />
        </view>
        <view class="stand-view" />
      </view>
    </scroll-view>
  </view>
</template>

<script>
import {mpLogin} from "../../../services/login.js";
const app = getApp();
export default {
    data() {
        return {
            status: 0,
            word: {
                word: '',
                definition: ''
            },
            carousels: [],
            triggered: false,
            announcements: []
        };
    },
    options: {
        addGlobalClass: true
    },
    beforeMount: function () {
        console.log('aaaa'); // 在组件实例进入页面节点树时执行

        this.setData({
            status: app.globalData.status,
            word: app.globalData.word
        });
        this.getWord(); // this.getArticles()

        this.getAnnouncements();

        if (this.status == 0) {
            app.globalData.token = uni.getStorageSync('token');
            app.globalData.id = uni.getStorageSync('id'); // 该用户已经注册登录

            if (app.globalData.token.length != 0) {
                app.globalData.status = 1;
                this.setData({
                    status: 1
                });
                uni.request({
                    url: app.globalData.server + 'users/' + app.globalData.id,
                    method: 'GET',
                    data: {},
                    header: {
                        'content-type': 'application/json'
                    },

                    success(res) {
                        if (res.statusCode == 200) {
                            app.globalData.userInfo = res.data.user;
                            app.globalData.publish_articles = res.data.publish_articles;
                            app.globalData.publish_comments = res.data.publish_comments;
                            app.globalData.like_articles = res.data.like_articles;
                            app.globalData.contribution = res.data.contribution;
                        } else {
                            uni.showToast({
                                title: '服务器错误'
                            });
                        }
                    },

                    fail(err) {
                        uni.showToast({
                            title: '网络异常'
                        });
                    }
                });
            }
        }
    },
    destroyed: function () {
        // 在组件实例被从页面节点树移除时执行
    },
    methods: {
        // 下拉刷新
        onRefresh() {
            if (this._freshing) {
                return;
            }

            this._freshing = true;
            uni.showLoading();
            setTimeout(() => {
                uni.hideLoading();
                this.setData({
                    triggered: false
                });
                this._freshing = false;
            }, 500);
        },

        getWord() {
            if (!this.word.id) {
                var that = this;
                uni.request({
                    url: app.globalData.server + 'website/word_of_the_day',
                    method: 'GET',
                    data: {},
                    header: {
                        'content-type': 'application/json'
                    },

                    success(res) {
                        if (res.statusCode == 200) {
                            that.getWordDetails(res.data.word_of_the_day.id);
                        } else {
                            uni.showToast({
                                title: '服务器错误'
                            });
                        }
                    },

                    fail(err) {
                        console.log(err);
                        uni.showToast({
                            title: '网络异常'
                        });
                    }
                });
            }
        },

        getArticles() {
            let that = this;
            uni.request({
                url: app.globalData.server + 'website/carousel',
                method: 'GET',
                data: {},
                header: {
                    'content-type': 'application/json'
                },

                success(res) {
                    if (res.statusCode == 200) {
                        console.log(res.data);
                        that.setData({
                            carousels: res.data.carousel
                        });
                    }
                }
            });
        },

        getWordDetails(id) {
            let that = this;
            uni.request({
                url: app.globalData.server + 'words/' + id,
                method: 'GET',
                data: {},
                header: {
                    'content-type': 'application/json'
                },

                success(res) {
                    if (res.statusCode == 200) {
                        app.globalData.word = res.data.word;
                        that.setData({
                            word: res.data.word
                        });
                    } else {
                        uni.showToast({
                            title: '服务器错误',
                            icon: 'error'
                        });
                    }
                }
            });
        },

        login() {
            mpLogin()
        },

        // jump to a word randomly
        randomWord() {
            let random_id = Math.floor(Math.random() * 6099) + 1;
            uni.navigateTo({
                url: '/pages/basics/words/words?id=' + random_id
            });
        },

        getMore() {
            // let word = JSON.stringify(this.data.word)
            let id = this.word.id;
            uni.navigateTo({
                url: '/pages/basics/words/words?id=' + id
            });
        },

        toArticle(e) {
            let index = e.currentTarget.dataset.index;
            let id = this.announcements[index].article.id;
            uni.navigateTo({
                url: '/pages/plugin/article/article?id=' + id
            });
        },

        search() {
            uni.navigateTo({
                url: '/pages/basics/search/search'
            });
        },

        getTools(e) {
            let id = e.currentTarget.dataset.id;

            if (id === '1') {
                uni.navigateTo({
                    url: '/pages/component/pinyin/pinyin'
                });
            } else if (id === '2') {
                uni.navigateTo({
                    url: '/pages/basics/search/search?index=2'
                });
            } else if (id === '3') {
                uni.navigateTo({
                    url: '/pages/component/condition/condition'
                });
            } else {
                uni.navigateTo({
                    url: '/pages/component/daily/daily'
                });
            }
        },

        getAnnouncements() {
            let that = this;
            uni.request({
                url: app.globalData.server + 'website/announcements',
                method: 'GET',
                header: {
                    'content-type': 'application/json'
                },

                success(res) {
                    if (res.statusCode === 200) {
                        that.setData({
                            announcements: res.data.announcements
                        });
                        console.log(that.announcements);
                    }
                }
            });
        }
    }
};
</script>
<style>
.welcome-card {
    background-color: #ffffff;
    border-radius: 20rpx;
    margin: 5vw;
}

.word-card {
    background-color: #ffffff;
    border-radius: 20rpx;
    margin-right: 1vw;
}

.search-card {
    background-color: #ffffff;
    border-radius: 20rpx;
    margin-left: 1vw;
}

.article-card {
    background-color: #ffffff;
    border-radius: 20rpx;
    margin-top: 2vw;
}
</style>
