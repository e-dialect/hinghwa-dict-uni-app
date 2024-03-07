import { BASE_URL } from '@/const/urls';

const request = (method = 'GET', url = '', data = {}) => {
  uni.showLoading({
    title: '加载中',
    mask: true,
  });
  return new Promise(
    (resolve, reject) => {
      uni.request({
        method,
        url: BASE_URL + url,
        data,
        header: {
          'content-type': 'application/json',
          token: uni.getStorageSync('token'),
        },
        dataType: 'json',
      }).then((res) => {
        uni.hideLoading();
        // 如果正常返回，则根据状态码进行处理
        if (res.statusCode >= 200 && res.statusCode < 400) resolve(res.data);
        else {
          reject(res);
        }
      }).catch((error) => {
        uni.hideLoading();
        uni.showToast({
          title: '网络错误',
          icon: 'error',
        });
        reject(error);
      });
    },
  );
};

function get(url, data = null) {
  return request('get', url, data);
}

function post(url, data) {
  return request('post', url, data);
}

function put(url, data) {
  return request('put', url, data);
}

function del(url, data = null) {
  return request('delete', url, data);
}

export default {
  get, post, put, del,
};
