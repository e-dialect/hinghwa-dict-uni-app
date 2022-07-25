import request                              from "../utils/request";
import {toIndexPage, toLoginPage, toMePage} from "@/routers";

/**
 * 小程序一键登录
 */
export async function mpLogin() {
//#ifdef H5
  toLoginPage();
//#endif

//#ifndef H5
  uni.login({
      // 尝试调用登录接口成功
      success: (res) => {
        // 如果没有获取到微信的 code 直接使用普通登录
        if (!res.code) {
          toLoginPage();
          return
        }
        // 尝试进行微信登录
        request.post(
          "/login/wechat",
          {
            jscode: res.code,
          }, true)
          .then(res2 => {
            afterLogin(res2)
          })
          .catch((err) => {
            switch (err.statusCode) {
              case 404: {
                uni.showModal({
                  content: err.data.msg || "当前用户未注册或未绑定微信",
                  showCancel: false,
                  success() {
                    //跳转到普通登录页面
                    toLoginPage()
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
        toLoginPage()
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
export async function normalLogin(username, password) {
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
  }, true).then(res => {
    afterLogin(res)
  }).catch(err => {
    switch (err.statusCode) {
      case 401:
        uni.showToast({
          title: err.data.msg || '用户名或密码错误',
          icon: 'error'
        });
        break;
    }
  })
}

function afterLogin(res) {
  uni.showToast({
    title: '登录成功',
    icon: 'success'
  });
  uni.setStorageSync('token', res.token);
  uni.setStorageSync('id', res.id);
//#ifdef H5
  toIndexPage(true);
//#endif
//#ifndef H5
  toMePage();
//#endif
}
