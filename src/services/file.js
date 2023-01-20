import { BASE_URL } from '@/const/urls';

/**
 * 上传文件
 * @param file 文件对象（路径）
 * @returns {Promise<unknown>}
 */
export function uploadFile(file) {
  return new Promise((resolve, reject) => {
    uni.showLoading({
      title: '上传中……',
      mask: true,
    });
    uni.uploadFile({
      url: `${BASE_URL}/website/files`,
      filePath: file,
      name: 'file',
      header: {
        token: uni.getStorageSync('token'),
      },
    }).then((response) => {
      uni.hideLoading();
      const [error, res] = response;
      // 如果有错误，则抛出错误
      if (error) {
        uni.showToast({
          title: '网络错误',
          icon: 'error',
        });
        reject(error);
      }
      // 如果正常返回，则根据状态码进行处理
      if (res.statusCode >= 200 && res.statusCode < 400) resolve(res.data);
      else {
        switch (res.statusCode) {
          case 500:
            uni.showToast({
              title: '服务器内部错误',
              icon: 'error',
            });
            break;
          case 401:
            uni.showToast({
              title: '请先登录',
              icon: 'error',
            });
            break;
          default:
            uni.showToast({
              title: '上传失败！',
              icon: 'error',
            });
        }
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
  });
}

/**
 * 选择并上传图片
 * @param maxNumber 最大数量
 * @return{Promise<string[]>} URL 列表
 */
export async function chooseAndUploadImages(maxNumber = 1) {
  const images = await new Promise((resolve) => {
    uni.chooseImage({
      count: maxNumber,
      success: (res) => {
        const { tempFilePaths } = res;
        const promises = [];
        tempFilePaths.forEach((path) => {
          promises.push(uploadFile(path));
        });
        resolve(Promise.all(promises));
      },
      fail: (err) => {
        uni.showToast({
          title: err.errMsg,
        });
        resolve([]);
      },
    });
  });
  return images.map((item) => JSON.parse(item).url);
}

/**
 * 选择并上传一张图片
 * @returns {Promise<string>} 图片的 url
 */
export async function chooseAndUploadAnImage() {
  const images = await chooseAndUploadImages(1);
  return images[0];
}
