import request from '@/utils/request';

/**
 * 获取所有的商品
 */
export function getGoods() {
  return request.get('/products');
}

/**
 * 获取单个商品信息
 */
export function getGoodDetail(id) {
  return request.get(`/products/${id}`);
}

/**
 * 上传商品信息
 */
export async function uploadGoods(good) {
  return request.post('/products', good);
}

/**
 * 获取个人积分增减信息
 */
export async function getMyPoints(id) {
  return request.get(`/transactions?user=${id}&page=1&pageSize=10&action=earn,redeem&start_date=&end_date=`);
}

/* 订单相关 */
