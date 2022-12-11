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
import {changeUserInfo, getUserInfo} from "@/services/user";

const app = getApp();
export default {
  data() {
    return {
      phone: ''
    };
  },
  methods: {
    setPhone(e) {
      this.phone = e.detail.value
    },

    /**
     * 更改手机号
     */
    async savePhone() {
      const userInfo = await getUserInfo(app.globalData.id)
      userInfo.user.telephone = this.phone;
      if (this.phone.length != 11) {
        uni.showModal({
          title: '提示',
          content: '请输入正确格式的手机号码',
          showCancel: false,
        });
      } else {
        changeUserInfo(app.globalData.id, userInfo.user).then(async (res) => {
          uni.setStorageSync('token', res.token);
          setTimeout(() => {
            uni.showToast({
              title: '修改成功'
            });
            // 返回上一个页面
            uni.navigateBack({
              delta: 1
            });
          }, 100)
        });
      }
    }
  }
};
</script>
<style>
</style>
