import request from "./request";

export function login() {
  uni.login({
      // 尝试调用登录接口成功
      success: (res) => {
        // 如果没有获取到微信的 code 直接使用普通登录
        if (!res.code) {
          uni.navigateTo({
            url: "/pages/login/login",
          });
          return
        }
        // 尝试进行微信登录
        request.post(
          "/login/wechat",
          {
            jscode: res.code,
          })
          .then(res2 => {
            uni.showToast({
              title: "登录成功",
              duration: 2000,
            });
            uni.setStorageSync("token", res2.token);
            uni.setStorageSync("id", res2.id);
            setTimeout(() => {
              uni.reLaunch({
                url: "/pages/index/index",
              });
            }, 500);
          })
          .catch((err) => {
            switch (err.statusCode) {
              case 404: {
                uni.showModal({
                  content: "当前用户未注册或未绑定微信",
                  showCancel: false,
                  success() {
                    //跳转到普通登录页面
                    uni.navigateTo({
                      url: "/pages/login/login",
                    });
                  },
                })
                break
              }
            }
          })
      },
      // 尝试调用登录接口失败
      fail() {
        // 跳转到账号密码登录页面
        uni.navigateTo({
          url: "/pages/login/login",
        })
      },
    }
  )
}

