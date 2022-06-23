<template>
    <view>
        <cu-custom bgColor="bg-white" :isBack="true">
            <view class="text-black" slot="content">我的评论</view>
        </cu-custom>
        <view class="padding-sm bg-white">
            <view class="solid-bottom padding-top-sm padding-bottom-sm" v-for="(item, index) in publish_comments" :key="index">
                <view :data-index="index" @tap="toArticle">
                    <view class="flex">
                        <image class="cu-avatar round margin-right-sm" :src="avatar" mode="aspectFill"></image>
                        <view class="flex flex-sub justify-between">
                            <view class="flex flex-direction">
                                <view class="text-name">{{ nickname }}</view>
                                <view class="text-date">{{ item.time }}</view>
                            </view>
                            <view class="text-dz">
                                <text class="cuIcon-appreciate"></text>
                            </view>
                        </view>
                    </view>
                    <view class="text-content">{{ item.content }}</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
const app = getApp();
export default {
    data() {
        return {
            avatar: '',
            nickname: '',
            publish_comments: []
        };
    },
    onLoad() {
        this.setData({
            avatar: app.globalData.userInfo.avatar,
            nickname: app.globalData.userInfo.nickname
        }); // 获取我的评论

        this.getComments();
    },
    methods: {
        getComments() {
            let that = this;
            uni.request({
                url: app.globalData.server + 'articles/comments',
                method: 'PUT',
                data: {
                    comments: app.globalData.publish_comments
                },
                header: {
                    'content-type': 'application/json'
                },

                success(res) {
                    console.log(res.data);

                    if (res.statusCode == 200) {
                        that.setData({
                            publish_comments: res.data.comments
                        });
                    }
                }
            });
        },

        toArticle(e) {
            let index = e.currentTarget.dataset.index;
            let id = this.publish_comments[index].article;
            uni.navigateTo({
                url: '/pages/plugin/article/article?id=' + id
            });
        }
    }
};
</script>
<style>
.text-name {
    color: #666666;
    font-size: 30rpx;
}

.text-date {
    color: #9b9b9b;
    font-size: 24rpx;
}

.text-dz {
    color: #999999;
    font-size: 36rpx;
    align-self: center;
}

.text-content {
    position: relative;
    width: 85vw;
    left: 10vw;
    margin-top: 15rpx;
}
</style>
