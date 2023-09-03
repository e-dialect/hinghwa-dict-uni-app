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
  </view>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getProductInfo } from '@/services/user';

export default {
  data() {
    return {
      products: [],
      pageInfo: {},
    };
  },
  methods: {
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
  onMounted() {
    this.loadProducts();
  },
};
</script>

<style scoped>
/* Add your styling here */
</style>
