import request from "../utils/request";

/**
 * 一键登录
 */
export function login() {
//#ifdef H5
  uni.navigateTo({
    url: "/pages/login/login",
  });
//#endif

//#ifndef H5
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
              uni.redirectTo({
                url: "/pages/index/index",
              });
            }, 0);
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
//#endif
}

/**
 * 账号密码登录
 * @param username 用户名
 * @param password 密码
 */
export function normalLogin(username,password) {
  if (!username) {
    uni.showToast({
      title: '请输入用户名',
      icon: 'error'
    });
    return;
  }
  if (!password) {
    uni.showToast({
      title: '请输入密码',
      icon: 'error'
    });
    return;
  }
  request.post("/login", {
    username: username,
    password: password
  }).then(res => {
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    });
    uni.setStorageSync('token', res.token);
    uni.setStorageSync('id', res.id);
    uni.reLaunch({
      url: '/pages/index/index'
    });
  }).catch(err => {
    switch (err.statusCode) {
      case 401:
        uni.showToast({
          title: '用户名或密码错误',
          icon: 'error'
        });
        break;
    }
  })
}
