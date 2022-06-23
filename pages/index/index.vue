<template>
  <view>
    <basics v-if="PageCur == 'basics'"></basics>
    <component v-if="PageCur == 'component'"></component>
    <plugin v-if="PageCur == 'plugin'"></plugin>
    <about v-if="PageCur == 'about'"></about>
    <view class="cu-bar tabbar bg-white shadow foot" style="border-radius: 40rpx">
      <view class="action" @tap="NavChange" data-cur="basics">
        <view class="cuIcon-cu-image">
          <image
            :src="
              'https://cos.edialect.top/miniprogram/images/tabbar/index' +
              (PageCur == 'basics' ? '-selected' : '') +
              '.png'
            "
          ></image>
        </view>
      </view>
      <view class="action" @tap="NavChange" data-cur="component">
        <view class="cuIcon-cu-image">
          <image
            :src="
              'https://cos.edialect.top/miniprogram/images/tabbar/tool' +
              (PageCur == 'component' ? '-selected' : '') +
              '.png'
            "
          ></image>
        </view>
      </view>
      <view class="action" @tap="NavChange" data-cur="plugin">
        <view class="cuIcon-cu-image">
          <image
            :src="
              'https://cos.edialect.top/miniprogram/images/tabbar/hd' +
              (PageCur == 'plugin' ? '-selected' : '') +
              '.png'
            "
          ></image>
        </view>
      </view>
      <view class="action" @tap="NavChange" data-cur="about">
        <view class="cuIcon-cu-image">
          <image
            :src="
              'https://cos.edialect.top/miniprogram/images/tabbar/my' +
              (PageCur == 'about' ? '-selected' : '') +
              '.png'
            "
          ></image>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import basics from "@/pages/basics/home/home";
import component from "@/pages/component/home/home";
import plugin from "@/pages/plugin/home/home";
import about from "@/pages/about/home/home";
const app = getApp();
const server = app.globalData.server;
export default {
  components: {
    basics,
    component,
    plugin,
    about,
  },
  //右上角分享功能
  data() {
    return {
      PageCur: "basics",
      PageStatus: 0,
    };
  },
  onShareAppMessage() {
    var that = this;
    return {
      title: "",
      path: "/pages/index/index",
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      },
    };
  },
  onLoad(options) {
    if (options.status) {
      this.setData({
        PageCur: options.status,
      });
    }
  },
  methods: {
    NavChange(e) {
      let PageCur = e.currentTarget.dataset.cur;

      if (app.globalData.status == 0 && PageCur == "about") {
        let that = this;
        uni.showModal({
          content: "请先登录",
          showCancel: false,

          success(res) {
            that.login(); // that.setData({
            //   PageCur: 'basics'
            // })
          },
        });
        return;
      } else {
        this.setData({
          PageCur: PageCur,
        });
      }
    },

    login() {
      uni.getUserProfile({
        desc: "展示用户信息",
        success: (res) => {
          uni.login({
            success(res1) {
              if (res1.code) {
                //发起网络请求
                uni.request({
                  url: app.globalData.server + "login/wechat",
                  method: "POST",
                  data: {
                    jscode: res1.code,
                  },
                  header: {
                    "content-type": "application/json",
                  },

                  success(res2) {
                    console.log(res2);

                    if (res2.statusCode == 200) {
                      uni.showToast({
                        title: "登录成功",
                        duration: 2000,
                      });
                      uni.setStorageSync("token", res2.data.token);
                      uni.setStorageSync("id", res2.data.id);
                      setTimeout(function () {
                        uni.reLaunch({
                          url: "/pages/index/index",
                        });
                      }, 500);
                    } else if (res2.statusCode == 404) {
                      uni.showModal({
                        content: "当前用户未注册或未绑定微信",
                        showCancel: false,

                        success(res3) {
                          if (res3.confirm) {
                            //跳转到登录页面
                            uni.navigateTo({
                              url: "/pages/login/login",
                            });
                          }
                        },
                      });
                    } else if (res2.statusCode == 500) {
                      uni.showToast({
                        title: "服务器错误",
                        icon: "error",
                      });
                    }
                  },
                });
              } else {
                console.log("登录失败！" + res.errMsg);
              }
            },
          });
        },

        fail(err) {
          //跳转到登录页面
          uni.navigateTo({
            url: "/pages/login/login",
          });
        },
      });
    },
  },
};
</script>
<style></style>
