<template>
  <view>
    <cu-custom
      bg-color="bg-white"
      :is-back="true"
    />
    <view class="cu-form-group text-df">
      <view class="text-df text-bold-less margin-right-sm">
        昵称
      </view>
      <input
        placeholder="不要超过20位嗷~"
        maxlength="20"
        @input="setNickname"
      >
    </view>
    <button
      class="cu-btn round bg-gradual-blue shadow text-df margin-top-sm"
      style="width: 16vw; margin-left: 80vw"
      @tap="saveNickname"
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
      nickname: ''
    };
  },
  methods: {
    setNickname(e) {
      this.nickname = e.detail.value
    },

    /**
     * 更改头像
     * @returns {Promise<void>}
     */
    async saveNickname() {
      if (this.nickname === '') {
        uni.showModal({
          content: '请输入正确的昵称',
          showCancel: false,
        });
      } else {
        const userInfo = await getUserInfo(app.globalData.id)
        userInfo.user.nickname = this.nickname;
        changeUserInfo(app.globalData.id , userInfo.user).then(async (res) => {
          uni.setStorageSync('token', res.token);
          setTimeout(() => {
            uni.showToast({
              title: '修改成功'
            });
            uni.navigateBack({
              delta: 1
            }); // 返回上一个页面
          }, 100)
        });
      }
    }
  }
};
</script>
<style>
</style>
