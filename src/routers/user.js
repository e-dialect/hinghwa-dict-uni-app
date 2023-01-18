/**
 * 前往用户页面
 * @param id 用户id
 */
export function toUserPage(id) {
  uni.navigateTo({
    url: `/pages/users/detail?id=${id}`,
  });
}

/**
 * 前往用户信息页面
 */
export function toUserInfoPage() {
  uni.navigateTo({
    url: '/pages/about/userinfo/userinfo',
  });
}

/**
 * 前往用户贡献语音页面
 * @param id 用户id
 */
export function toPronunciationsPage(id) {
  uni.navigateTo({
    url: `/pages/users/pronunciation?id=${id}`,
  });
}

/**
 * 前往更改用户昵称页面
 */
export function toChangeNicknamePage() {
  uni.navigateTo({
    url: '/pages/about/nickname/nickname',
  });
}

/**
 * 前往更改邮箱页面
 */
export function toChangeEmailPage() {
  uni.navigateTo({
    url: '/pages/about/email/email',
  });
}

/**
 * 前往更改手机号页面
 */
export function toChangePhonePage() {
  uni.navigateTo({
    url: '/pages/about/phone/phone',
  });
}

export function toMePage(closeAll = false) {
  if (closeAll) {
    uni.reLaunch({
      url: '/pages/index/index?status=me',
    });
  } else {
    uni.navigateTo({
      url: '/pages/index/index?status=me',
    });
  }
}
