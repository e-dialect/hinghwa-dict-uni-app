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
          placeholder="请输入6~11位密码"
        >
        <text
          :class="is_pwd1 == true ? 'cuIcon-attention' : 'cuIcon-attentionforbid'"
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
          :class="is_pwd2 == true ? 'cuIcon-attention' : 'cuIcon-attentionforbid'"
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
        // onLoad() {
        //   this.uploadAvatar()
        // },
        ear1() {
            if (this.is_pwd1 == true) {
                this.setData({
                    is_pwd1: false
                });
            } else {
                this.setData({
                    is_pwd1: true
                });
            }
        },

        ear2() {
            if (this.is_pwd2 == true) {
                this.setData({
                    is_pwd2: false
                });
            } else {
                this.setData({
                    is_pwd2: true
                });
            }
        },

        getEmail(e) {
            this.setData({
                email: e.detail.value
            });
        },

        // 获取验证码
        getCode() {
            var that = this;
            uni.request({
                url: app.globalData.server + 'website/email',
                method: 'POST',
                data: {
                    email: that.email
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
                            title: '发送失败',
                            icon: 'error'
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

        // uploadAvatar() {
        //   console.log('yl')
        //   console.log(app.globalData.token)
        //   //获取图片信息
        //   wx.getImageInfo({
        //     src: app.globalData.userInfo.avatar,
        //     success: function (sres) {
        //       console.log(sres)
        //       //上传图片
        //       wx.uploadFile({
        //         url: app.globalData.server + 'website/files',
        //         filePath: sres.path,
        //         name: "file",
        //         header: {
        //           'token': app.globalData.token
        //         },
        //         success: function (res) {
        //           console.log(res)
        //         },
        //         error: function (rev) {
        //           console.log(rev);
        //         }
        //       });
        //     },
        //     fail: function (srev) {
        //       console.log(srev);
        //     }
        //   })
        //   wx.uploadFile({
        //     url: app.globalData.server + 'website/files',
        //     filePath: tempFilePaths,
        //     name: 'file',
        //     header: {
        //       'token': app.globalData.token
        //     },
        //     success(res) {
        //       console.log(res)
        //       if (res.statusCode == 200) {
        //         console.log(url)
        //         let url = JSON.parse(res.data).url
        //         app.globalData.data = {
        //           'avatar': url
        //         }
        //         that.setData({
        //           avatar: url
        //         })
        //         that.changeAvatar(url)
        //       }
        //     }
        //   })
        // }
        register(e) {
            console.log(e);
            var username = e.detail.value.username;
            var password = e.detail.value.password;
            var password_confirmed = e.detail.value.password_confirmed;
            var email = e.detail.value.email;
            var code = e.detail.value.code;

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

            if (password != password_confirmed) {
                uni.showToast({
                    title: '两次密码不相同',
                    icon: 'error'
                });
                return;
            }

            uni.request({
                url: app.globalData.server + 'users',
                method: 'POST',
                data: {
                    username: username,
                    password: password,
                    email: email,
                    code: code,
                    avatar: app.globalData.userInfo.avatar,
                    nickname: app.globalData.userInfo.nickname
                },
                header: {
                    'content-type': 'application/json'
                },

                success(res) {
                    console.log(res.data);

                    if (res.statusCode == 200) {
                        uni.showToast({
                            title: '注册成功'
                        });
                        uni.setStorageSync('id', res.data.id);
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
                    } else if (res.statusCode == 409) {
                        uni.showToast({
                            title: '用户名已存在',
                            icon: 'error'
                        });
                    } else if (res.statusCode == 400) {
                        uni.showToast({
                            title: '请求有误',
                            icon: 'error'
                        });
                    } else if (res.statusCode == 500) {
                        uni.showToast({
                            title: '服务器错误',
                            icon: 'error'
                        });
                    }
                },

                fail(err) {
                    uni.showToast({
                        title: '网络异常',
                        icon: 'error'
                    });
                }
            });
        }
    }
};
</script>
<style>
.logo {
    width: 50vw;
    display: block;
    margin: auto;
}
</style>
