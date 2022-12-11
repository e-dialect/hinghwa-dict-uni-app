<template>
  <view>
    <cu-custom
      bg-color="bg-white"
      :is-back="true"
    />
    <form @submit="changePassword">
      <view
        v-for="(item, index) in pwd"
        :key="index"
        class="cu-form-group"
      >
        <view class="text-df text-bold-less margin-right-sm">
          {{ item.str }}
        </view>

        <input
          :name="item.name"
          :password="item.is_pwd"
          :placeholder="item.ph"
        >

        <text
          :class="item.icon"
          :data-index="index"
          @tap="changeStatus"
        />
      </view>
      <button
        class="cu-btn round bg-gradual-blue shadow text-df margin-top-sm"
        style="display: flex; justify-content: center"
        form-type="submit"
      >
        保存
      </button>
    </form>
  </view>
</template>

<script>
const app = getApp();
export default {
  data() {
    return {
      pwd: [
        {
          str: '原密码',
          ph: '请输入原密码',
          is_pwd: true,
          icon: 'cuIcon-attention',
          name: 'old'
        },
        {
          str: '新密码',
          ph: '请输入新密码',
          is_pwd: true,
          icon: 'cuIcon-attention',
          name: 'new1'
        },
        {
          str: '确认密码',
          ph: '请确认新密码',
          is_pwd: true,
          icon: 'cuIcon-attention',
          name: 'new2'
        }
      ]
    };
  },
  methods: {
    changeStatus(e) {
      let index = e.currentTarget.dataset.index;
      let pwd = this.pwd;

      if (pwd[index].is_pwd == true) {
        pwd[index].is_pwd = false;
        pwd[index].icon = 'cuIcon-attentionforbid';
      } else {
        pwd[index].is_pwd = true;
        pwd[index].icon = 'cuIcon-attention';
      }

      this.setData({
        pwd: pwd
      });
    },

    changePassword(e) {
      let old = e.detail.value.old;
      let new1 = e.detail.value.new1.trim();
      let new2 = e.detail.value.new2.trim();

      if (old == '' || new1 == '' || new2 == '') {
        uni.showToast({
          title: '内容不完整',
          icon: 'error'
        });
        return;
      } else if (new1 != new2) {
        uni.showToast({
          title: '两次密码不一样',
          icon: 'error'
        });
        return;
      } // 修改密码

      uni.request({
        url: app.globalData.server + 'users/' + app.globalData.id + '/password',
        method: 'PUT',
        data: {
          oldpassword: old,
          newpassword: new1
        },
        header: {
          'content-type': 'application/json',
          token: app.globalData.token
        },

        success(res) {
          console.log(res);

          if (res.statusCode == 200) {
            uni.showToast({
              title: '修改成功'
            });
            setTimeout(function () {
              uni.navigateBack({
                delta: 1
              });
            }, 500);
          } else if (res.statusCode == 401) {
            uni.showModal({
              content: '没有权限或原密码错误'
            });
          } else if (res.statusCode == 500) {
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
/* pages/about/password/password.wxss */
</style>
