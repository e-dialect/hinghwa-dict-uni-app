<template>
    <view>
        <cu-custom bgColor="bg-white" :isBack="true">
            <view class="text-black" slot="content">我的文章</view>
        </cu-custom>
        <view class="cu-card article no-card" @tap="article" :data-index="index" v-for="(item, index) in publish_articles" :key="index">
            <view class="cu-item shadow" style="margin-bottom: 20rpx">
                <view class="flex justify-between">
                    <view class="title flex">
                        <view class="text-cut">{{ item.article.title }}</view>
                        <view class="cu-tag bg-blue light sm round margin-top-smp margin-left-xs">
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
                            <text class="text-grey">{{ item.article.publish_time }}</text>
                        </view>
                        <view class="text-content">{{ item.article.description }}</view>
                    </view>
                    <image :src="item.article.cover" mode="aspectFill"></image>
                </view>
            </view>
        </view>
        <view class="stand-view"></view>
    </view>
</template>

<script>
const app = getApp();
export default {
    data() {
        return {
            publish_articles: []
        };
    },
    onLoad() {
        this.getArticles();
    },
    methods: {
        getArticles() {
            uni.showLoading({
                title: '加载中'
            });
            let that = this; // 获取点赞文章

            uni.request({
                url: app.globalData.server + 'articles',
                method: 'PUT',
                data: {
                    articles: app.globalData.publish_articles
                },
                header: {
                    'content-type': 'application/json'
                },

                success(res) {
                    if (res.statusCode == 200) {
                        that.setData({
                            publish_articles: res.data.articles
                        });
                        uni.hideLoading();
                    }
                }
            });
        },

        // 进入文章
        article(e) {
            let index = e.currentTarget.dataset.index;
            let id = this.publish_articles[index].article.id;
            uni.navigateTo({
                url: '/pages/plugin/article/article?id=' + id
            });
        }
    }
};
</script>
<style>
/* pages/about/myarticles/myarticles.wxss */
</style>
