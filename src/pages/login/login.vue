<template>
  <view>
    <view class="logo">
      <image :src="logo" mode="widthFix"></image>
    </view>
    <form @submit="login">
      <view class="info">
        <view class="cuIcon-friend">&nbsp;</view>
        <input name="username" placeholder="请输入用户名"/>
      </view>
      <view class="info">
        <view class="cuIcon-lock">&nbsp;</view>
        <input name="password" password placeholder="请输入密码"/>
      </view>
      <view class="flex justify-center">
        <button
            class="cu-btn round bg-gradual-blue shadow text-df margin-top"
            form-type="submit"
            style="width: 65vw"
        >
          登录
        </button>
      </view>
    </form>
    <view class="flex text-bold text-center" style="margin-top: 20vh">
      <view class="flex-sub solid-right" @tap="forget">忘记密码</view>
      <view class="flex-sub" @tap="register">用户注册</view>
    </view>
  </view>
</template>

<script>
import {COS_URL}     from "../../const/urls";
import {normalLogin} from "../../services/login";

const app = getApp();
export default {
  data() {
    return {
      logo: COS_URL + '/images/logo.png',
    };
  },
  methods: {

    login(e) {
      const username = e.detail.value.username;
      const password = e.detail.value.password;
      normalLogin(username, password);
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
  margin-bottom: 16px;
}

.info input {
  color: #555;
  background-color: #f5f5f5;
  height: 80rpx;
  width: 60vw;
  padding: 20rpx;
  border-radius: 10rpx;
}

.info input {
  font-size: 32rpx;
  margin-left:16px;
}

.info > text[class*='cuIcon-'] {
  font-size: 40rpx;
  box-sizing: border-box;
}
</style>
