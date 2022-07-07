import {BASE_URL} from "@/const/urls";

const request = (method = 'GET', url = '', data = {}) => {
  uni.showLoading({
    title: '加载中',
    mask: true
  });
  return new Promise(function (resolve, reject) {
    uni.request({
      method: method,
      url: BASE_URL + url,
      data: data,
      header: {
        'content-type': 'application/json',
        token: uni.getStorageSync("token")
      },
      dataType: 'json',
    }).then((response) => {
      uni.hideLoading();
      let [error, res] = response;
      // 如果有错误，则抛出错误
      if (error) {
        uni.showToast({
          title: "网络错误",
          icon: "error",
        });
        reject(error)
      }
      // 如果正常返回，则根据状态码进行处理
      if (res.statusCode >= 200 && res.statusCode < 400) resolve(res.data);
      else {
        switch (res.statusCode) {
          case 500:
            uni.showToast({
              title: "服务器内部错误",
              icon: "error",
            });
            break;
          case 404:
            uni.showToast({
              title: "请求资源不存在",
              icon: "error",
            });
            break;
        }
        reject(res)
      }
    }).catch(error => {
      uni.hideLoading();
      uni.showToast({
        title: "网络错误",
        icon: "error",
      });
      reject(error)
    })
  })
}


export function get(url, data) {
  return request('get', url, data)
}

export function post(url, data) {
  return request('post', url, data)
}

export function put(url, data) {
  return request('put', url, data)
}

export function del(url, data) {
  return request('delete', url, data)
}

export default {
  get, post, put, del,
};

