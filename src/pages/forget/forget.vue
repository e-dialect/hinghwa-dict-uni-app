<template>
  <view>
    <cu-custom
      bg-color="bg-white"
      :is-back="true"
    >
      <view
        slot="content"
        class="text-black"
      >
        忘记密码
      </view>
    </cu-custom>
    <block v-if="status == 0">
      <view class="cu-form-group">
        <view class="text-df text-bold-less margin-right-sm">
          用户名
        </view>
        <input
          name="username"
          placeholder="请输入用户名"
          @input="getUsername"
        >
      </view>
      <button
        class="cu-btn round bg-gradual-blue shadow text-df margin-top-sm"
        style="width: 20vw; margin-left: 75vw"
        @tap="next"
      >
        下一步
      </button>
    </block>
    <form
      v-if="status == 1"
      @submit="reset"
    >
      <view class="cu-form-group">
        <view class="text-df text-bold-less margin-right-sm">
          密码
        </view>
        <input
          name="password"
          :password="is_pwd"
          placeholder="请输入新密码"
        >
        <text
          :class="is_pwd === true ? 'cuIcon-attention' : 'cuIcon-attentionforbid'"
          @tap="ear"
        />
      </view>
      <view class="cu-form-group">
        <view class="text-df text-bold-less margin-right-sm">
          邮箱
        </view>
        <input
          name="email"
          :value="email"
          disabled
        >
      </view>
      <view class="cu-form-group">
        <view class="text-df text-bold-less margin-right-sm">
          验证码
        </view>
        <input
          name="code"
          placeholder="请输入验证码"
        >
        <button
          class="cu-btn bg-gradual-blue shadow"
          style="width: 32vw; border-radius: 5000rpx"
          @tap="getCode"
        >
          获取验证码
        </button>
      </view>
      <button
        class="cu-btn round bg-gradual-blue shadow text-df margin-top-sm"
        style="display: flex; justify-content: center"
        form-type="submit"
      >
        重置密码
      </button>
    </form>
  </view>
</template>

<script>
import {sendEmailCode} from "@/services/website";

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
           sendEmailCode(this.email)
        },

        ear() {
          this.is_pwd = !this.is_pwd
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
