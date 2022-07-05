const baseUrl = 'https://api.pxm.edialect.top'

const request = (method = 'GET', url = '', data = {}) => {
  uni.showLoading({
    title: '加载中',
    mask: true
  });
  return new Promise(function (resolve, reject) {
    uni.request({
      method: method,
      url: baseUrl + url,
      data: data,
      header: {
        'content-type': 'application/json',
        token: uni.getStorageSync("token")
      },
      dataType: 'json',
    }).then((response) => {
      uni.hideLoading();
      let [error, res] = response;
      if (error) {
        uni.showToast({
          title: "网络错误",
          icon: "error",
        });
        reject(error)
      }
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

