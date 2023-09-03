<template>
  <view class="mall-page">
    <cu-custom title="积分商城" />
    <view class="product-list">
      <view
        v-for="product in products"
        :key="product.id"
        class="product-item"
      >
        <image
          :src="product.picture"
          class="product-image"
        />
        <view class="product-details">
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
      </view>
    </view>
    <view class="pagination-info">
      当前页码: {{ pageInfo.page }}
      总页数: {{ pageInfo.total_pages }}
      每页数量: {{ pageInfo.pageSize }}
      总数量: {{ pageInfo.amount }}
    </view>
    <view
      class="circle-button"
      @click="toUploadProductsPage()"
    >
      <i class="iconfont icon-plus" />
    </view>
  </view>
</template>

<script>
import { getProductInfo } from '@/services/user';
import { toUploadProductsPage } from '@/routers/product';

export default {
  data() {
    return {
      products: [],
      pageInfo: {},
    };
  },
  methods: {
    toUploadProductsPage,
    async loadProducts() {
      try {
        const response = await getProductInfo();
        this.products = response.result;
        this.pageInfo = {
          page: response.page,
          total_pages: response.total_pages,
          pageSize: response.pageSize,
          amount: response.amount,
        };
      } catch (error) {
        uni.showToast({
          title: '无法加载商品',
        });
      }
    },
  },
  onShow() {
    this.loadProducts();
  },
};
</script>

<style scoped>
.circle-button {
  width: 60px;
  height: 60px;
  background-color: #007bff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: background-color 0.2s;
}

.circle-button:hover {
  background-color: #0056b3;
}

.iconfont {
  font-size: 24px;
}

.circle-button {
  width: 60px;
  height: 60px;
  background-color: #39C5BB;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  transition: background-color 0.2s;
}

.circle-button:hover {
  background-color: #39c5bb;
}

.iconfont {
  font-size: 50px;
}

/* Custom styles for the white plus sign */
.circle-button i::before {
  content: '+';
  color: #fff;
}
</style>
