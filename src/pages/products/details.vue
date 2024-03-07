<template>
  <view>
    <cu-custom title="商品详情" />
    <view class="product-detail">
      <!-- 商品图片 -->
      <image
        :src="product.picture"
        class="product-image"
      />
      <!-- 商品信息 -->
      <view class="product-info">
        <view class="product-name">
          {{ product.name }}
        </view>
        <view class="product-points">
          所需积分: {{ product.points }}
        </view>
        <view class="product-quantity">
          剩余数量: {{ product.quantity }}
        </view>
      </view>
      <hr class="divider">
      <br>
      <!-- 商品详情 -->
      <view class="product-details">
        <p style="text-indent:2em;">
          {{ product.details }}
        </p>
      </view>
      <!-- 购买按钮 -->
      <!--view class="buy-button-container">
        <button
          class="buy-button"
          @click="buyProduct"
        >
          立即购买
        </button>
      </view-->
    </view>
  </view>
</template>
<script>
// eslint-disable-next-line import/extensions
import { getGoodDetail } from '@/services/point.js';

export default {
  data() {
    return {
      product: {
        name: '',
        points: 0,
        quantity: 0,
        picture: '',
        details: '',
        id: '',
      },
    };
  },
  onLoad() {
    // 从路由参数中获取商品 ID 并加载商品详情
    const { id } = this.$route.query;
    if (id) {
      this.showDetails(id);
    }
  },
  methods: {
    async showDetails(id) {
      // 使用商品 ID 获取商品详情
      const res = await getGoodDetail(id);
      this.product = res.products;
    },
    buyProduct() {
      uni.showToast({
        title: '还没上线购买功能喵',
        icon: 'none',
        duration: 2000,
      });
    },
  },
};
</script>
<style scoped>
/* 商品详情页面样式 */

.product-detail {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.product-image {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 0 10 rgba(0, 0, 0, 0.2); /* 添加图片阴影效果 */
}

.product-info {
  margin-bottom: 20px;
}

.product-name {
  font-size: 26px;
  font-weight: bold;
  color: #39C5BB;
  margin-bottom: 10px;
}

.product-points {
  font-size: 18px;
  color: #666;
  margin-bottom: 10px;
}

.product-quantity {
  font-size: 18px;
  color: #666;
  margin-bottom: 5px;
}

.product-details {
  font-size: 16px;
  color: #333;
  line-height: 1.6;
  text-align: left;
  margin-bottom: 20px;
  line-height: 2;
}

.buy-button-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: 100%;
}

.buy-button {
  width: 80%;
  padding: 15px;
  background-color: #39C5BB;
  color: #fff;
  font-size: 18px;
  text-align: center;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease; /* 添加按钮颜色变化动画 */
}

.buy-button:hover {
  background-color: #009688; /* 鼠标悬停时的背景色 */
}

/*分割线*/
.divider {
  align-self: center;
  width: 100%;
  color: #987cb9;
  size: 10;
}
</style>
