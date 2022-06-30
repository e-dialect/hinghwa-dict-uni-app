<script>
//app.js
export default {
    data() {
        return {};
    },
    onLaunch: function () {
        uni.getSystemInfo({
            success: (e) => {
                this.globalData.platform = e.platform;
                this.globalData.StatusBar = e.statusBarHeight;
                let capsule = uni.getMenuButtonBoundingClientRect();

                if (capsule) {
                    this.globalData.Custom = capsule;
                    this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
                } else {
                    this.globalData.CustomBar = e.statusBarHeight + 50;
                }
            }
        });
    },
    globalData: {
        server: 'https://api.pxm.edialect.top/',
        id: '',
        token: '',
        userInfo: {},
        publish_articles: [],
        publish_comments: [],
        like_articles: [],
        contribution: {},
        status: 0,
        word: {},
        data: {},

        watch: function (method) {
            var obj = this;
            Object.defineProperty(obj, 'data', {
                configurable: true,
                enumerable: true,
                set: function (value) {
                    if (value.avatar) {
                        this.userInfo.avatar = value.avatar;
                    }

                    if (value.nickname) {
                        this.userInfo.nickname = value.nickname;
                    }

                    method(value);
                },
                get: function () {
                    return this;
                }
            });
        }
    }
};
</script>
<style>
@import 'colorui/main.css';
@import 'colorui/icon.css';

page {
    background-color: #f7f7f7;
}

.scrollPage {
    height: 100vh;
}

.layout-index {
    position: absolute;
    top: 45%;
    width: 100vw;
}

.layout-index-login {
    position: absolute;
    top: 33%;
    width: 100vw;
}

.index-card {
    background-color: #ffffff;
    padding: 30rpx 30rpx;
    border-radius: 20rpx;
    margin: 5vw;
}

.card-name {
    color: #115e83;
    font-size: 36rpx;
    font-weight: 700;
}

.card-slogan {
    color: black;
    margin-top: 10rpx;
    font-size: 32rpx;
    font-weight: 300;
}

.card-btn {
    position: absolute;
    right: 10vw;
    top: 6vh;
    font-size: 26rpx;
}

.index-word {
    background-color: #ffffff;
    border-radius: 20rpx;
    height: 25vh;
    margin: 5vw;
}

.word-sy {
    display: -webkit-box;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 7;
    overflow: hidden;
    text-overflow: ellipsis;
}

.index-search {
    background-color: #ffffff;
    border-radius: 20rpx;
    margin: 5vw;
}

.stand-view {
    height: 10vh;
}

.login-input {
    background-color: #f2f3f7;
    border-radius: 5000rpx;
    display: flex;
    margin: 30rpx 60rpx;
    padding: 20rpx;
}

.btn {
    margin: 10vh auto;
    background-color: white;
}
</style>
