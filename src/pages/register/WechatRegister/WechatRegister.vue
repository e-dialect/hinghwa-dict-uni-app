<template>
  <view>
    <cu-custom title="微信注册" />
    <form @submit="wechatRegister">
      <view class="cu-form-group">
        <view class="text-df text-bold-less margin-right-sm">
          头像
        </view>
        <view class="padding-bottom-xs">
          <button
            class="margin-right-xs cu-avatar lg round"
            open-type="chooseAvatar"
            @chooseavatar="onChooseAvatar"
          >
            <image
              :class="avatarUrl === ''?'avatar-img':'' "
              :src="avatarUrl"
              class="cu-avatar lg round"
              mode="aspectFill"
            />
          </button>
        </view>
      </view>
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
          昵称
        </view>
        <input
          name="nickname"
          type="nickname"
          class="weui-input"
          placeholder="请输入昵称"
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
      <button
        class="cu-btn round bg-gradual-blue shadow text-df margin-top-sm"
        style="display: flex; justify-content: center"
        form-type="submit"
      >
        微信注册
      </button>
    </form>
  </view>
</template>

<script>
import {registerWechatUser} from "@/services/user";
import CuCustom             from "@/colorui/components/cu-custom.vue";

const app              = getApp();
const defaultAvatarUrl = 'https://cos.edialect.top/website/默认头像.jpg'
export default {
  components: {CuCustom},
  data() {
    return {
      is_pwd1: true,
      is_pwd2: true,
      email: '',
      avatarUrl: defaultAvatarUrl
    };
  },
  methods: {
    onChooseAvatar(e) {
      this.avatarUrl = e.detail.avatarUrl
    },

    ear1() {
      this.is_pwd1 = !this.is_pwd1
    },

    ear2() {
      this.is_pwd2 = !this.is_pwd2
    },

    wechatRegister(e) {
      console.log(e.detail.value)
      let username           = e.detail.value.username;
      let password           = e.detail.value.password;
      let password_confirmed = e.detail.value.password_confirmed;
      let nickname           = e.detail.value.nickname;
      let avatar             = e.detail;


      if (!username || !password || !password_confirmed) {
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

      if (!nickname) {
        uni.showModal({
          content: '未填写昵称将会用用户名暂代哦~',
          success: async (res) => {
            if (res.confirm) {
              registerWechatUser(username, password, username, avatar)
            }
          }
        });
      } else {
        registerWechatUser(username, password, nickname, avatar)
      }
    },
  }
};
</script>
