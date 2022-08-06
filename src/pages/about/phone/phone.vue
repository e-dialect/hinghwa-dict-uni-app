<template>
  <view>
    <cu-custom
      bg-color="bg-white"
      :is-back="true"
    />
    <view class="cu-form-group">
      <view class="text-df text-bold-less margin-right-sm">
        手机
      </view>
      <input
        placeholder="请输入11位手机号嗷~"
        maxlength="11"
        @input="setPhone"
      >
    </view>
    <button
      class="cu-btn round bg-gradual-blue shadow text-df margin-top-sm"
      style="width: 16vw; margin-left: 80vw"
      @tap="savePhone"
    >
      保存
    </button>
  </view>
</template>

<script>
const app = getApp();
export default {
    data() {
        return {
            phone: ''
        };
    },
    methods: {
        setPhone(e) {
            this.setData({
                phone: e.detail.value
            });
        },

        savePhone() {
            var phone = this.phone;

            if (phone.length != 11) {
                uni.showModal({
                    title: '提示',
                    content: '请输入正确格式的手机号码',
                    showCancel: false,

                    success(res) {
                        console.log(res.confirm);
                    }
                });
            } else {
                app.globalData.userInfo.telephone = phone;
                uni.request({
                    url: app.globalData.server + 'users/' + app.globalData.id,
                    // url: 'http://127.0.0.1:4523/mock/404238/users/1',
                    method: 'PUT',
                    data: {
                        user: app.globalData.userInfo
                    },
                    header: {
                        'content-type': 'application/json',
                        token: app.globalData.token
                    },

                    success(res) {
                        console.log(res.data);

                        if (res.statusCode == 200) {
                            uni.setStorage({
                                data: res.data.token,
                                key: 'token'
                            });
                            uni.showToast({
                                title: '修改成功'
                            }); // 返回上一页面

                            uni.navigateBack({
                                delta: 1
                            });
                        } else if (res.statusCode == 400) {
                            uni.showToast({
                                title: '格式错误'
                            });
                        } else if (res.statusCode == 409) {
                            uni.showToast({
                                title: '用户名重复'
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
/* pages/about/phone/phone.wxss */
</style>
