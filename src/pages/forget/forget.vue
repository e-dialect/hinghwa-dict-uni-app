<template>
    <view>
        <cu-custom bgColor="bg-white" :isBack="true">
            <view class="text-black" slot="content">忘记密码</view>
        </cu-custom>
        <block v-if="status == 0">
            <view class="cu-form-group">
                <view class="text-df text-bold-less margin-right-sm">用户名</view>
                <input name="username" placeholder="请输入用户名" @input="getUsername" />
            </view>
            <button class="cu-btn round bg-gradual-blue shadow text-df margin-top-sm" style="width: 20vw; margin-left: 75vw" @tap="next">下一步</button>
        </block>
        <form @submit="reset" v-if="status == 1">
            <view class="cu-form-group">
                <view class="text-df text-bold-less margin-right-sm">密码</view>
                <input name="password" :password="is_pwd" placeholder="请输入新密码" />
                <text :class="is_pwd == true ? 'cuIcon-attention' : 'cuIcon-attentionforbid'" @tap="ear"></text>
            </view>
            <view class="cu-form-group">
                <view class="text-df text-bold-less margin-right-sm">邮箱</view>
                <input name="email" :value="email" disabled />
            </view>
            <view class="cu-form-group">
                <view class="text-df text-bold-less margin-right-sm">验证码</view>
                <input name="code" placeholder="请输入验证码" />
                <button @tap="getCode" class="cu-btn bg-gradual-blue shadow" style="width: 32vw; border-radius: 5000rpx">获取验证码</button>
            </view>
            <button class="cu-btn round bg-gradual-blue shadow text-df margin-top-sm" style="display: flex; justify-content: center" form-type="submit">重置密码</button>
        </form>
    </view>
</template>

<script>
const app = getApp();
export default {
    data() {
        return {
            username: '',
            email: '',
            status: 0,
            is_pwd: true
        };
    },
    methods: {
        getUsername(e) {
            this.setData({
                username: e.detail.value
            });
        },

        next() {
            let username = this.username;
            let that = this;
            uni.request({
                url: app.globalData.server + 'login/forget?username=' + username,
                method: 'GET',
                data: {},
                header: {
                    'content-type': 'application/json'
                },

                success(res) {
                    if (res.statusCode == 200) {
                        that.setData({
                            email: res.data.email,
                            status: 1
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

        // 获取验证码
        getCode() {
            var that = this;
            uni.request({
                url: app.globalData.server + 'website/email',
                method: 'POST',
                data: {
                    email: that.email
                },
                header: {
                    'content-type': 'application/json'
                },

                success(res) {
                    console.log(res.data);

                    if (res.statusCode.toString()[0] === '2') {
                        uni.showToast({
                            title: '发送成功'
                        });
                    } else {
                        uni.showToast({
                            title: '发送失败'
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

        ear() {
            if (this.is_pwd == true) {
                this.setData({
                    is_pwd: false
                });
            } else {
                this.setData({
                    is_pwd: true
                });
            }
        },

        reset(e) {
            let username = this.username;
            let email = this.email;
            let code = e.detail.value.code;
            let password = e.detail.value.password;
            uni.request({
                url: app.globalData.server + 'login/forget',
                method: 'PUT',
                data: {
                    username: username,
                    email: email,
                    code: code,
                    password: password
                },

                success(res) {
                    if (res.statusCode == 200) {
                        uni.showToast({
                            title: '重置成功'
                        });
                        setTimeout(function () {
                            uni.navigateBack({
                                delta: 1
                            });
                        }, 500);
                    } else if (res.statusCode == 401) {
                        uni.showToast({
                            title: '验证码错误',
                            icon: 'error'
                        });
                    } else {
                        uni.showToast({
                            title: '服务器错误',
                            icon: 'error'
                        });
                    }
                }
            });
        }
    }
};
</script>
<style>
/* pages/forget/forget.wxss */
</style>
