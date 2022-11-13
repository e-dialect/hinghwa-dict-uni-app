<template>
  <view>
    <scroll-view
      scroll-y
      class="scrollPage"
    >
      <image
        class="bg-image"
        src="https://cos.edialect.top/miniprogram/user.png"
        mode="aspectFill"
      />
      <view class="bg-info">
        <view
          class="avatar"
          @tap="userInfo"
        >
          <image
            class="cu-avatar round"
            :src="avatar"
            mode="aspectFill"
          />
        </view>
        <view class="text">
          {{ nickname }}
        </view>
      </view>
      <view class="padding flex text-center text-grey bg-white shadow-warp">
        <view
          class="flex flex-sub flex-direction solid-right"
          @tap="getMyRecords"
        >
          <view class="text-xlp text-orange">
            {{ recordsCount }}
          </view>
          <view class="margin-top-sm">
            <text class="cuIcon-voice" />
            语音量
          </view>
        </view>
        <view class="flex flex-sub flex-direction solid-right">
          <view class="text-xlp text-blue">
            {{ wordsCount }}
          </view>
          <view class="margin-top-sm">
            <text class="cuIcon-font" />
            词语量
          </view>
        </view>
        <view class="flex flex-sub flex-direction">
          <view class="text-xlp text-green">
            {{ visitTotal }}
          </view>
          <view class="margin-top-sm">
            <text class="cuIcon-attention" />
            播放量
          </view>
        </view>
      </view>
      <view class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg radius">
        <view class="cu-item arrow">
          <navigator
            class="content"
            url="/pages/about/articlesliked/articlesliked"
            hover-class="none"
          >
            <text class="cuIcon-appreciate text-grey" />
            <text class="text-grey">
              点赞文章
            </text>
          </navigator>
        </view>
        <view class="cu-item arrow">
          <navigator
            class="content"
            url="/pages/about/myarticles/myarticles"
            hover-class="none"
          >
            <text class="cuIcon-edit text-grey" />
            <text class="text-grey">
              我的文章
            </text>
          </navigator>
        </view>
        <view class="cu-item arrow">
          <navigator
            class="content"
            url="/pages/about/mycomments/mycomments"
            hover-class="none"
          >
            <text class="cuIcon-comment text-grey" />
            <text class="text-grey">
              我的评论
            </text>
          </navigator>
        </view>
        <!--        <view class="cu-item arrow">-->
        <!--          <navigator-->
        <!--            class="content"-->
        <!--            url="/pages/about/articles/articles"-->
        <!--            hover-class="none"-->
        <!--          >-->
        <!--            <text class="cuIcon-musicfill text-grey" />-->
        <!--            <text class="text-grey">-->
        <!--              我的音乐-->
        <!--            </text>-->
        <!--          </navigator>-->
        <!--        </view>-->
      </view>
      <view class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg radius">
        <view class="cu-item arrow">
          <navigator
            class="content"
            url="/pages/about/password/password"
            hover-class="none"
          >
            <text class="cuIcon-write text-grey" />
            <text class="text-grey">
              修改密码
            </text>
          </navigator>
        </view>
        <view
          class="cu-item arrow"
          @tap="bindingWechat"
        >
          <navigator
            class="content"
            url="/pages/about/articles/articles"
            hover-class="none"
          >
            <text class="cuIcon-group text-grey" />
            <text class="text-grey">
              绑定微信
            </text>
          </navigator>
        </view>
        <view
          class="cu-item arrow"
          @tap="exit"
        >
          <navigator
            class="content"
            url="/pages/about/articles/articles"
            hover-class="none"
          >
            <text class="cuIcon-exit text-grey" />
            <text class="text-grey">
              退出登录
            </text>
          </navigator>
        </view>
      </view>
      <view class="stand-view" />
    </scroll-view>
  </view>
</template>

<script>
import {toIndexPage} from "@/routers";

const app = getApp();
export default {
    data() {
        return {
            avatar: '',
            nickname: '',
            recordsCount: 0,
            wordsCount: 0,
            visitTotal: 0
        };
    },
    options: {
        addGlobalClass: true
    },
    beforeMount() {
        var that = this;
        app.globalData.watch(function (value) {
            if (value.avatar) {
                that.setData({
                    avatar: value.avatar
                });
            }

            if (value.nickname) {
                that.setData({
                    nickname: value.nickname
                });
            }
        });
        this.getInfo();
        let i = 0;
        numDH();

        function numDH() {
            if (i < 20) {
                setTimeout(function () {
                    that.setData({
                        recordsCount: i,
                        wordsCount: i,
                        visitTotal: i
                    });
                    i++;
                    numDH();
                }, 20);
            } else {
                that.setData({
                    recordsCount: that.coutNum(app.globalData.contribution.pronunciation),
                    wordsCount: that.coutNum(app.globalData.contribution.word),
                    visitTotal: that.coutNum(app.globalData.contribution.listened)
                });
            }
        }
    },
    methods: {
        // 获取用户信息
        getInfo() {
            uni.showLoading();
            let that = this;
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
                        that.setData({
                            avatar: app.globalData.userInfo.avatar,
                            nickname: app.globalData.userInfo.nickname
                        });
                        uni.hideLoading();
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
        },

        coutNum(e) {
            if (e > 1000 && e < 10000) {
                e = (e / 1000).toFixed(1) + 'k';
            }

            if (e > 10000) {
                e = (e / 10000).toFixed(1) + 'W';
            }

            return e;
        },

        //进入个人信息页面
        userInfo() {
            uni.navigateTo({
                url: '/pages/about/userinfo/userinfo'
            });
        },

        getMyRecords() {
            let id = app.globalData.id;
            uni.navigateTo({
                url: '/pages/component/voice/voice?id=' + id
            });
        },

        // 退出登录
        exit() {
            uni.showModal({
                content: '是否退出当前登录？',

                success:async(res)=> {
                    if (res.confirm) {
                        uni.clearStorageSync();
                        app.globalData.status = 0;
                        await toIndexPage(uni.getSystemInfoSync().uniPlatform==='web');
                        uni.showToast({
                            title: '登出成功！'
                        });
                    }
                }
            });
        },

        //绑定微信
        bindingWechat() {
            if (app.globalData.userInfo.wechat === true) {
                uni.showModal({
                    content: '当前用户已经绑定微信！',
                    cancelText: '取消绑定',

                    success(res) {
                        if (res.cancel) {
                            // 取消绑定微信
                            uni.login({
                                success(res1) {
                                    if (res1.code) {
                                        uni.request({
                                            url: app.globalData.server + 'users/' + app.globalData.id + '/wechat',
                                            method: 'DELETE',
                                            data: {
                                                jscode: res1.code
                                            },
                                            header: {
                                                'content-type': 'application/json',
                                                token: app.globalData.token
                                            },

                                            success(res2) {
                                                if (res2.statusCode == 200) {
                                                    uni.showToast({
                                                        title: '解除绑定'
                                                    });
                                                    app.globalData.userInfo.wechat = false;
                                                } else if (res2.statusCode == 401) {
                                                    uni.showModal({
                                                        content: '没有权限'
                                                    });
                                                } else if (res2.statusCode == 500) {
                                                    uni.showToast({
                                                        title: '服务器错误',
                                                        icon: 'error'
                                                    });
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            } else {
                uni.showModal({
                    content: '是否绑定微信？',

                    success(res) {
                        if (res.confirm) {
                            uni.login({
                                success(res1) {
                                    if (res1.code) {
                                        uni.request({
                                            url: app.globalData.server + 'users/' + app.globalData.id + '/wechat',
                                            method: 'PUT',
                                            data: {
                                                jscode: res1.code
                                            },
                                            header: {
                                                'content-type': 'application/json',
                                                token: app.globalData.token
                                            },

                                            success(res2) {
                                                if (res2.statusCode == 200) {
                                                    uni.showToast({
                                                        title: '绑定成功'
                                                    });
                                                    app.globalData.userInfo.wechat = true;
                                                } else if (res2.statusCode == 401) {
                                                    uni.showModal({
                                                        content: '没有权限'
                                                    });
                                                } else if (res2.statusCode == 500) {
                                                    uni.showToast({
                                                        title: '服务器错误',
                                                        icon: 'error'
                                                    });
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    }
};
</script>
<style>
.bg-image {
    z-index: 0;
    position: absolute;
    width: 100vw;
    height: 28vh;
}

.bg-info {
    z-index: 1024;
    height: 28vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.bg-info .avatar {
    width: 190rpx;
    height: 190rpx;
}

.bg-info .text {
    position: absolute;
    top: 22vh;
    font-size: 36rpx;
    font-weight: 700;
    color: white;
}

.bg-info image {
    width: 180rpx;
    height: 180rpx;
    margin-left: 6rpx;
}
</style>
