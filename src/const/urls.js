export const COS_URL = 'https://cos.edialect.top/miniprogram';
const env = import.meta.env.MODE || process.env.NODE_ENV
export const BASE_URL = env === 'production'
  ? 'https://api.pxm.edialect.top'
  : 'https://api.pxm.test.edialect.top';

export const DefaultArticleCover = 'https://cos.edialect.top/website/默认封面.png';
