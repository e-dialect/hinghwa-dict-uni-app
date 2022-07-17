<template>
    <view>
        <cu-custom bgColor="bg-white">
            <view class="text-black" slot="content">语记·互动</view>
        </cu-custom>
        <!-- <button class="cu-btn icon lg bg-blue shadow write" bindtap="writeArticle">
  <text class="cuIcon-write"></text>
</button> -->
        <view class="flex padding text-center" style="background-color: white">
            <view :class="'flex-sub ' + (status == 0 ? 'text-bold' : '')" data-index="0" @tap="changeStatus">热门文章</view>
            <view :class="'flex-sub ' + (status == 1 ? 'text-bold' : '')" data-index="1" @tap="changeStatus">全部文章</view>
        </view>
        <scroll-view
            :scroll-y="true"
            style="height: 85vh"
            :refresher-enabled="true"
            refresher-default-style="none"
            refresher-background="white"
            :refresher-triggered="triggered"
            @refresherrefresh="onRefresh"
            @scrolltolower="loadMoreArticles"
        >
            <view class="cu-card article no-card" @tap="article" :data-index="index" v-for="(item, index) in status == 0 ? hot_articles : display_all_articles" :key="index">
                <view class="cu-item shadow" style="margin-bottom: 20rpx">
                    <view class="flex justify-between">
                        <view class="title flex align-center">
                            <view class="text-cut">{{ item.article.title }}</view>
                            <view class="cu-tag bg-blue light sm round margin-left">
                                <text class="cuIcon-appreciate">{{ item.article.likes }}</text>
                            </view>
                        </view>
                        <text class="cuIcon-attention text-grey margin-top-sm margin-right">{{ item.article.views }}</text>
                    </view>
                    <view class="content">
                        <view class="desc">
                            <view class="text-df">
                                <image class="cu-avatar round ssm" :src="item.author.avatar" mode="aspectFill"></image>
                                <text :decode="true">&nbsp;{{ item.author.nickname }}&nbsp;&nbsp;</text>
                            </view>
                            <view class="text-content">{{ item.article.description }}</view>
                        </view>
                        <image :src="item.article.cover" mode="aspectFill"></image>
                    </view>
                    <view class="time">
                        <text class="text-grey fr margin-right-xl margin-top-xs">{{ item.article.publish_time }}</text>
                    </view>
                </view>
            </view>
            <view class="stand-view"></view>
        </scroll-view>
    </view>
</template>

<script>
const app = getApp();
export default {
    data() {
        return {
            hot_articles: [],
            all_articles: [],
            display_all_articles: [],
            page: 1,
            status: 0,
            triggered: false
        };
    },
    options: {
        addGlobalClass: true
    },
    beforeMount() {
        let that = this;
        this.getHotArticles();
    },
    methods: {
        // 获取热门文章
        getHotArticles() {
            uni.showLoading();
            let that = this;
            uni.request({
                url: app.globalData.server + 'website/hot_articles',
                method: 'GET',
                data: {},
                header: {
                    'content-type': 'application/json'
                },

                success(res) {
                    console.log(res);

                    if (res.statusCode == 200) {
                        that.setData({
                            hot_articles: res.data.hot_articles
                        });
                        that.getAllArticles();
                    }
                }
            });
        },

        // 获取全部文章
        getAllArticles() {
            let that = this;
            uni.request({
                url: app.globalData.server + 'articles',
                method: 'GET',
                data: {},
                header: {
                    'content-type': 'application/json'
                },

                success(res) {
                    if (res.statusCode == 200) {
                        // 获取文章id数组
                        let arr = res.data.articles; // 获取文章数组

                        uni.request({
                            url: app.globalData.server + 'articles',
                            method: 'PUT',
                            data: {
                                articles: arr
                            },
                            header: {
                                'content-type': 'application/json'
                            },

                            success(res) {
                                if (res.statusCode == 200) {
                                    that.setData({
                                        all_articles: res.data.articles,
                                        display_all_articles: res.data.articles.slice(0, 4)
                                    });
                                    uni.hideLoading();
                                }
                            }
                        });
                    }
                }
            });
        },

        // 下拉刷新
        onRefresh() {
            if (this._freshing) {
                return;
            }

            this._freshing = true;
            this.getHotArticles();
            setTimeout(() => {
                this.setData({
                    triggered: false
                });
                this._freshing = false;
            }, 500);
        },

        // 加载更多文章
        loadMoreArticles() {
            uni.showLoading();
            let page = this.page;
            let origin_articles = this.display_all_articles;
            let concat_articles = this.all_articles.slice(page * 4, page * 4 + 4);
            this.setData({
                page: page + 1,
                display_all_articles: origin_articles.concat(concat_articles)
            });
            setTimeout(function () {
                uni.hideLoading();
            }, 500);
        },

        changeStatus(e) {
            let index = e.currentTarget.dataset.index;
            this.setData({
                status: index
            });
        },

        article(e) {
            let index = e.currentTarget.dataset.index;
            let id = 0;

            if (this.status == 0) {
                id = this.hot_articles[index].article.id;
            } else {
                id = this.all_articles[index].article.id;
            }

            uni.navigateTo({
                url: '/pages/plugin/article/article?id=' + id
            });
        },

        writeArticle() {
            uni.navigateTo({
                url: '/pages/plugin/write/write'
            });
        }
    }
};
</script>
<style>
.write {
    position: fixed;
    bottom: 10vh;
    right: 6vw;
    z-index: 1024;
}
</style>
