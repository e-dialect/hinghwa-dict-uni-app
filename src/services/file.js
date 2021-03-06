import {BASE_URL} from "@/const/urls";

/**
 * 上传文件
 * @param file 文件对象（路径）
 * @returns {Promise<unknown>}
 */
export function uploadFile(file) {
  return new Promise(function (resolve, reject) {
    uni.showLoading({
      title: '上传中……',
      mask: true
    });
    uni.uploadFile({
      url: BASE_URL + '/website/files',
      filePath: file,
      name: 'file',
      header: {
        token: uni.getStorageSync("token")
      },
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
          case 401:
            uni.showToast({
              title: "请先登录",
              icon: "error",
            });
            break;
          default:
            uni.showToast({
              title: "上传失败！",
              icon: "error",
            })
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
