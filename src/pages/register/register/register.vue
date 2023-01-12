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
        用户注册
      </view>
    </cu-custom>
    <form @submit="register">
      <view class="cu-form-group">
        <view class="text-df text-bold-less margin-right-sm">
          用户名
        </view>
        <input
          name="username"
          placeholder="请输入用户名"
        >
      </view>
      <view class="cu-form-group">
        <view class="text-df text-bold-less margin-right-sm">
          密码
        </view>
        <input
          name="password"
          :password="is_pwd1"
          placeholder="请输入6~32位密码"
        >
        <text
          :class="is_pwd1 === true ? 'cuIcon-attention' : 'cuIcon-attentionforbid'"
          @tap="ear1"
        />
      </view>
      <view class="cu-form-group">
        <view class="text-df text-bold-less margin-right-sm">
          确认密码
        </view>
        <input
          name="password_confirmed"
          :password="is_pwd2"
          placeholder="请再次输入密码"
        >
        <text
          :class="is_pwd2 === true ? 'cuIcon-attention' : 'cuIcon-attentionforbid'"
          @tap="ear2"
        />
      </view>
      <view class="cu-form-group">
        <view class="text-df text-bold-less margin-right-sm">
          邮箱
        </view>
        <input
          name="email"
          placeholder="请输入邮箱"
          inputmode="email"
          @input="getEmail"
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
        注册
      </button>
    </form>
  </view>
</template>

<script>
import {sendEmailCode} from "@/services/website";
import {registerUser} from "@/services/user";

const app = getApp();
export default {
  data() {
    return {
      is_pwd1: true,
      is_pwd2: true,
      email: ''
    };
  },
  methods: {
    ear1() {
      this.is_pwd1= !this.is_pwd1
    },

    ear2() {
      this.is_pwd2= !this.is_pwd2
    },

    getEmail(e) {
        this.email = e.detail.value
    },

    // 获取验证码
    getCode() {
      sendEmailCode(this.email).then(async () => {
        setTimeout(() => {
          uni.showToast({
            title: '发送成功'
          });
        }, 100)
      });
    },

    register(e) {
      console.log(e);
      let username = e.detail.value.username;
      let password = e.detail.value.password;
      let password_confirmed = e.detail.value.password_confirmed;
      let email = e.detail.value.email;
      let code = e.detail.value.code;

      if (!username || !password || !password_confirmed || !email || !code) {
        uni.showToast({
          title: '信息不完整',
          icon: 'error'
        });
        return;
      }

      if (password.length < 6 || password.length > 32) {
        uni.showToast({
          title: '密码长度 6 - 32 位',
          icon: 'error'
        });
        return;
      }

      if (password !== password_confirmed) {
        uni.showToast({
          title: '两次密码不相同',
          icon: 'error'
        });
        return;
      }
      registerUser(username, password, email, code).then(async (res) => {
        setTimeout(() => {
          uni.showToast({
            title: '注册成功'
          });
          uni.navigateBack({
            delta: 1
          });
        }, 100)
      });
    },
  }
};
</script>
<style>

</style>
