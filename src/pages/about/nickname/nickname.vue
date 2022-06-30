<template>
    <view>
        <cu-custom bgColor="bg-white" :isBack="true"></cu-custom>
        <view class="cu-form-group text-df">
            <view class="text-df text-bold-less margin-right-sm">昵称</view>
            <input placeholder="不要超过20位嗷~" maxlength="20" @input="setNickname" />
        </view>
        <button class="cu-btn round bg-gradual-blue shadow text-df margin-top-sm" style="width: 16vw; margin-left: 80vw" @tap="saveNickname">保存</button>
    </view>
</template>

<script>
const app = getApp();
export default {
    data() {
        return {
            nickname: ''
        };
    },
    methods: {
        setNickname(e) {
            this.setData({
                nickname: e.detail.value
            });
        },

        saveNickname() {
            var nickname = this.nickname;

            if (nickname == '') {
                uni.showModal({
                    content: '请输入正确的昵称',
                    showCancel: false,

                    success(res) {
                        console.log(res.confirm);
                    }
                });
            } else {
                app.globalData.userInfo.nickname = nickname;
                uni.request({
                    url: app.globalData.server + 'users/' + app.globalData.id,
                    method: 'PUT',
                    data: {
                        user: app.globalData.userInfo
                    },
                    header: {
                        'content-type': 'application/json',
                        token: app.globalData.token
                    },

                    success(res) {
                        if (res.statusCode == 200) {
                            uni.setStorage({
                                data: res.data.token,
                                key: 'token'
                            });
                            uni.showToast({
                                title: '修改成功'
                            });
                            app.globalData.data = {
                                nickname: nickname
                            };
                            setTimeout(function () {
                                uni.navigateBack({
                                    delta: 1
                                });
                            }, 500);
                        } else if (res.statusCode == 400) {
                            uni.showToast({
                                title: '格式错误'
                            });
                        } else if (res.statusCode == 409) {
                            uni.showToast({
                                title: '昵称重复'
                            });
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
    }
};
</script>
<style>
/* pages/about/username/username.wxss */
</style>
