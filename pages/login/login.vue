<template>
    <view>
        <view class="logo">
            <image src="/static/images/logo.png" mode="widthFix"></image>
        </view>
        <form @submit="login">
            <view class="info">
                <text class="cuIcon-friendfamous" :decode="true">&nbsp;&nbsp;</text>
                <input name="username" placeholder="请输入用户名" />
            </view>
            <view class="info">
                <text class="cuIcon-lock" :decode="true">&nbsp;&nbsp;</text>
                <input name="password" password placeholder="请输入密码" />
            </view>
            <button class="cu-btn round bg-gradual-blue shadow text-df margin-top" style="display: flex; justify-content: center; width: 65vw" form-type="submit">登录</button>
        </form>
        <view class="flex text-bold text-center" style="margin-top: 20vh">
            <view class="flex-sub solid-right" @tap="forget">忘记密码</view>
            <view class="flex-sub" @tap="register">用户注册</view>
        </view>
    </view>
</template>

<script>
const app = getApp();
export default {
    data() {
        return {};
    },
    methods: {
        login(e) {
            var username = e.detail.value.username;
            var password = e.detail.value.password;

            if (!username || !password) {
                uni.showToast({
                    title: '信息不完整',
                    icon: 'error'
                });
                return;
            }

            uni.request({
                url: app.globalData.server + 'login',
                method: 'POST',
                data: {
                    username: username,
                    password: password
                },
                header: {
                    'content-type': 'application/json'
                },

                success(res) {
                    console.log(res.data);
                    console.log(res.statusCode);

                    if (res.statusCode == 200) {
                        uni.showToast({
                            title: '登录成功',
                            duration: 2000
                        });
                        console.log('aaaa:', res.data.token);
                        uni.setStorageSync('token', res.data.token);
                        uni.setStorageSync('id', res.data.id);
                        setTimeout(function () {
                            uni.reLaunch({
                                url: '/pages/index/index'
                            });
                        }, 500);
                    } else if (res.statusCode == 401) {
                        uni.showModal({
                            content: '用户名不存在或密码错误',
                            showCancel: false,

                            success(res) {
                                console.log(res.confirm);
                            }
                        });
                    } else if (res.statusCode == 500) {
                        uni.showToast({
                            title: '服务器错误',
                            icon: 'error'
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
        },

        forget() {
            uni.navigateTo({
                url: '/pages/forget/forget'
            });
        },

        register() {
            uni.navigateTo({
                url: '/pages/register/register'
            });
        }
    }
};
</script>
<style>
page {
    background-color: #ffffff;
}

.logo {
    margin-top: 20vh;
    margin-bottom: 10vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.logo image {
    width: 40vw;
    height: 40vw;
}

.info {
    background-color: var(--white);
    padding: 1rpx 30rpx;
    display: flex;
    align-items: center;
    min-height: 100rpx;
    justify-content: center;
}

.info input {
    font-size: 32rpx;
    color: #555;
    background-color: #f5f5f5;
    height: 80rpx;
    width: 60vw;
    padding: 20rpx;
    border-radius: 10rpx;
}

.info > text[class*='cuIcon-'] {
    font-size: 40rpx;
    padding: 0;
    box-sizing: border-box;
}
</style>
