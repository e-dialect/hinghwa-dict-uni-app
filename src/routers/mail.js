/**
 * 前往邮件详情界面
 */
// eslint-disable-next-line import/prefer-default-export
export function toMailPage(id) {
  uni.navigateTo({
    url: `/pages/tools/mail/mailDetail?id=${id}`,
  });
}
