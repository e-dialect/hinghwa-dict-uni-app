<template>
  <view>
    <cu-custom title="积分商城" />
    <view class="mall-page">
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
  beforeMount() {
    this.loadProducts();
  },
  methods: {
    loadProducts() {

    },
  },
};
</script>

<style scoped>
/*后面再写...*/
</style>
