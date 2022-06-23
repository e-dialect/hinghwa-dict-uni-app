<template>
    <view>
        <cu-custom bgColor="bg-white" :isBack="true"></cu-custom>
        <view class="cu-form-group">
            <view class="text-df text-bold-less margin-right-sm">原邮箱</view>
            <input :value="old_email" :disabled="true" />
        </view>
        <view class="cu-form-group">
            <view class="text-df text-bold-less margin-right-sm">新邮箱</view>
            <input placeholder="请输入新邮箱" @input="getNewEmail" />
        </view>
        <view class="cu-form-group">
            <view class="text-df text-bold-less margin-right-sm">验证码</view>
            <input placeholder="请输入验证码" @input="getCode" />
            <button @tap="sendCode" class="cu-btn bg-gradual-blue shadow" style="width: 32vw; border-radius: 5000rpx">获取验证码</button>
        </view>
        <button class="cu-btn round bg-gradual-blue shadow text-df margin-top-sm" style="display: flex; justify-content: center" @tap="setNewEmail">保存</button>
    </view>
</template>

<script>
const app = getApp();
export default {
    data() {
        return {
            old_email: '',
            code: '',
            new_email: ''
        };
    },
    onLoad() {
        this.setData({
            old_email: app.globalData.userInfo.email
        });
    },
    methods: {
        getCode(e) {
            this.setData({
                code: e.detail.value
            });
        },

        sendCode() {
            var that = this;
            uni.request({
                url: app.globalData.server + 'website/email',
                method: 'POST',
                data: {
                    email: that.new_email
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

        getNewEmail(e) {
            this.setData({
                new_email: e.detail.value
            });
        },

        setNewEmail() {
            var code = this.code;
            var new_email = this.new_email;
            app.globalData.userInfo.email = new_email;
            uni.request({
                url: app.globalData.server + 'users/' + app.globalData.id + '/email',
                // url: 'http://127.0.0.1:4523/mock/404238/users/1/email',
                method: 'PUT',
                data: {
                    code: code,
                    email: new_email
                },
                header: {
                    'content-type': 'application/json',
                    token: app.globalData.token
                },

                success(res) {
                    if (res.statusCode == 200) {
                        app.globalData.userInfo.email = new_email;
                        uni.showToast({
                            title: '修改成功'
                        }); // 返回上一页面

                        uni.navigateBack({
                            delta: 1
                        });
                    } else if (res.statusCode == 401) {
                        uni.showToast({
                            title: '没有权限'
                        });
                    } else if (res.statusCode == 500) {
                        uni.showToast({
                            title: '服务器错误'
                        });
                    }
                }
            });
        }
    }
};
</script>
<style>
/* pages/about/email/email.wxss */
</style>
