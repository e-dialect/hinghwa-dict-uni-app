<template>
    <view>
        <cu-custom bgColor="bg-white" :isBack="true">
            <view slot="content" class="text-black">兴化语记</view>
        </cu-custom>
        <scroll-view scroll-y style="height: 82vh">
            <view class="padding-sm">
                <view class="text-bold text-xxl line">{{ article.title }}</view>
                <view class="flex text-df margin-top" @tap="toVisitor">
                    <image class="cu-avatar round ssm" :src="article.author.avatar" mode="aspectFill"></image>
                    <text :decode="true">
                        &nbsp;{{ article.author.nickname }}&nbsp;&nbsp;
                        <text class="text-grey">{{ article.publish_time }}</text>
                    </text>
                </view>
                <view class="solid-top solid-bottom margin-top-xl padding-top-sm padding-bottom-sm">
                    <text class="text-xl text-grey line">{{ article.description }}</text>
                </view>
                <view class="margin-top-xl" :data-text="article.content">
                    <wemark :md="article.content" link highlight disabled type="wemark"></wemark>
                </view>
                <view class="margin-top-xl padding-top-sm solid-top">
                    <view class="text-df text-bold">评论（{{ comments.length }}条）</view>
                    <view class="solid-bottom padding-top-sm padding-bottom-sm" v-if="item.parent == 0" v-for="(item, index) in comments" :key="index">
                        <view class="flex">
                            <image class="cu-avatar round margin-right-sm" :src="item.user.avatar" mode="aspectFill" :data-index="index" @tap="toVisitorByComment"></image>
                            <view class="flex flex-sub justify-between">
                                <view class="flex flex-direction">
                                    <view class="text-name">{{ item.user.nickname }}</view>
                                    <view class="text-date">{{ item.time }}</view>
                                </view>
                                <view class="text-dz">
                                    <text class="cuIcon-appreciate"></text>
                                </view>
                            </view>
                        </view>

                        <view class="text-content" @tap="reply" :data-id="item.id">{{ item.content }}</view>

                        <view class="text-reply" v-for="(kid, index1) in item.kids" :key="index1">
                            <text class="text-blue" :data-id="kid.user.id" @tap="toVisitorByReply">{{ kid.user.nickname }}</text>

                            <text v-if="kid.parent != item.id">@</text>

                            <text class="text-blue" :data-id="comments[map[kid.parent]].user.id" @tap="toVisitorByReply" v-if="kid.parent != item.id">
                                {{ comments[map[kid.parent]].user.nickname }}
                            </text>

                            <text @tap="getAllReplys" :data-id="item.id">：{{ kid.content }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>
        <view class="cu-bar foot input padding-bottom" style="min-height: 120rpx">
            <view :class="'like ' + (is_like == 0 ? '' : 'text-blue border')" @tap="like" v-if="is_reply == false">
                <text class="cuIcon-appreciate">{{ likes }}</text>
            </view>
            <view class="input-box">
                <input style="margin-left: 30rpx" :value="comment" :placeholder="ph_text" :focus="is_reply" @input="getText" @focus="focus" @blur="blur" :adjust-position="true" />
            </view>
            <button class="cu-btn bg-blue shadow" style="width: 16vw" @tap="commentFun" v-if="is_reply == true">发送</button>
        </view>
    </view>
</template>

<script>
import wemark from '@/wemark/wemark';
const app = getApp();
export default {
    components: {
        wemark
    },
    data() {
        return {
            article: {
                title: '',

                author: {
                    avatar: ''
                },

                publish_time: '',
                description: '',
                content: ''
            },

            is_like: false,
            likes: 0,
            id: 0,
            comments: [],
            map: [],
            parent: 0,
            comment: '',
            is_reply: false,
            ph_text: '评论...',

            kid: {
                user: {
                    id: '',
                    nickname: ''
                },

                parent: '',
                content: ''
            },

            user: {
                id: '',
                nickname: ''
            }
        };
    },
    onLoad(options) {
        let id = options.id;
        this.setData({
            id: id
        });
        this.getArticle(id);
    },
    onShow() {
        // 获取评论
        // this.getComments()
    },
    methods: {
        // 获取游客信息
        toVisitor() {
            let id = this.article.author.id;
            uni.navigateTo({
                url: '/pages/about/visitor/visitor?id=' + id
            });
        },

        // 根据id获取文章细节
        getArticle(id) {
            uni.showLoading();
            let that = this;
            uni.request({
                url: app.globalData.server + 'articles/' + id,
                method: 'GET',
                data: {},
                header: {
                    'content-type': 'application/json',
                    token: app.globalData.token
                },

                success(res) {
                    if (res.statusCode == 200) {
                        that.setData({
                            article: res.data.article,
                            likes: res.data.article.likes,
                            is_like: res.data.me.liked
                        });
                        setTimeout(function () {
                            uni.hideLoading();
                        }, 500);
                    }
                }
            });
        },

        getComments() {
            let id = this.id.toString();
            let that = this;
            uni.request({
                url: app.globalData.server + 'articles/' + id + '/comments',
                // url: 'http://127.0.0.1:4523/mock/404238/articles/1/comments',
                method: 'GET',
                data: {},
                header: {
                    'content-type': 'application/json'
                },

                success(res) {
                    console.log(res.data);

                    if (res.statusCode == 200) {
                        let comments = res.data.comments;
                        let map = []; // 获取根评论

                        for (let i = 0; i < comments.length; i++) {
                            comments[i].kids = [];
                            map[comments[i].id] = i;
                        } // 获取子孙评论

                        for (let i = 0; i < comments.length; i++) {
                            if (comments[i].parent != 0) {
                                let p = comments[i].parent;

                                while (comments[map[p]].parent) {
                                    p = comments[map[p]].parent;
                                }

                                comments[map[p]].kids.push(comments[i]);
                            }
                        }

                        that.setData({
                            comments: comments,
                            map: map
                        });
                    }
                }
            });
        },

        getAllReplys(e) {
            let id = e.currentTarget.dataset.id;
            let comment = JSON.stringify(this.comments[this.map[id]]);
            let article_id = this.article.id;
            uni.navigateTo({
                url: '/pages/plugin/comment/comment?comment=' + comment + '&id=' + article_id
            });
        },

        reply(e) {
            let id = e.currentTarget.dataset.id;
            let reply_user = this.comments[this.map[id]].user.nickname;
            this.setData({
                parent: id,
                is_reply: true,
                ph_text: '@ ' + reply_user
            });
            console.log(this.parent);
        },

        getText(e) {
            this.setData({
                comment: e.detail.value
            });
        },

        commentFun() {
            let comment = this.comment;
            let parent = this.parent;
            console.log(this.parent);
            let id = this.article.id.toString();
            let that = this;
            uni.request({
                url: app.globalData.server + 'articles/' + id + '/comments',
                // url: 'http://127.0.0.1:4523/mock/404238/articles/1/comments',
                method: 'POST',
                data: {
                    content: comment,
                    parent: parent
                },
                header: {
                    'content-type': 'application/json',
                    token: app.globalData.token
                },

                success(res) {
                    console.log(res);

                    if (res.statusCode == 200) {
                        // 清空输入框
                        that.setData({
                            comment: '',
                            is_reply: false
                        });
                        uni.showToast({
                            title: '发表成功'
                        });
                        that.getComments();
                    } else if (res.statusCode == 400) {
                        uni.showToast({
                            title: '格式错误',
                            icon: 'error'
                        });
                    } else if (res.statusCode == 401) {
                        uni.showToast({
                            title: '没有权限',
                            icon: 'error'
                        });
                    } else if (res.statusCode == 500) {
                        uni.showToast({
                            title: '服务器错误',
                            icon: 'error'
                        });
                    }
                }
            });
        },

        focus() {
            this.setData({
                is_reply: true
            });
        },

        blur() {
            if (this.comment == '') {
                this.setData({
                    parent: 0,
                    is_reply: false,
                    ph_text: '评论...'
                });
            }
        },

        like() {
            let is_like = this.is_like;
            let that = this;

            if (is_like == false) {
                // 给文章点赞
                uni.request({
                    url: app.globalData.server + 'articles/' + that.article.id + '/like',
                    // url: 'http://127.0.0.1:4523/mock/404238/articles/1/like',
                    method: 'POST',
                    data: {},
                    header: {
                        'content-type': 'application/json',
                        token: app.globalData.token
                    },

                    success(res) {
                        console.log(res);

                        if (res.statusCode == 200) {
                            that.setData({
                                likes: that.likes + 1,
                                is_like: 1
                            });
                        }
                    }
                });
            } else {
                // 取消点赞
                uni.request({
                    url: app.globalData.server + 'articles/' + that.article.id + '/like',
                    // url: 'http://127.0.0.1:4523/mock/404238/articles/1/like',
                    method: 'DELETE',
                    data: {},
                    header: {
                        'content-type': 'application/json',
                        token: app.globalData.token
                    },

                    success(res) {
                        if (res.statusCode == 200) {
                            that.setData({
                                likes: that.likes - 1,
                                is_like: 0
                            });
                        }
                    }
                });
            }
        },

        toVisitorByComment(e) {
            let index = e.currentTarget.dataset.index;
            let id = this.comments[index].user.id;
            uni.navigateTo({
                url: '/pages/about/visitor/visitor?id=' + id
            });
        },

        toVisitorByReply(e) {
            let id = e.currentTarget.dataset.id;
            uni.navigateTo({
                url: '/pages/about/visitor/visitor?id=' + id
            });
        }
    }
};
</script>
<style>
page {
    background-color: white;
}

.line {
    line-height: 1.6em;
}

.like {
    background-color: #f5f5f5;
    border-radius: 5000rpx;
    padding: 10rpx 20rpx;
    margin-left: 25rpx;
    font-size: 30rpx;
}

.input-box {
    flex: 1;
    margin-left: 20rpx;
    margin-right: 20rpx;
    border-radius: 5000rpx;
    background-color: #f5f5f5;
}

.border {
    border: 2rpx solid #0081ff;
}

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

.text-reply {
    background-color: #f7f7f7;
    position: relative;
    width: 85vw;
    left: 10vw;
    margin-top: 10rpx;
    padding: 20rpx;
    border-radius: 10rpx;
}
</style>
