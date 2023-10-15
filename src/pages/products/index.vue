<template>
  <view>
    <cu-custom title="积分商城" />
    <view
      class="floating-view"
      @tap="gotoBill"
    >
      <view class="view-content">
        上传商品
      </view>
    </view>
    <view class="myPoints">
      可用积分：{{ amount }}
    </view>
    <view class="mall-page">
      <view class="product-list">
        <view
          v-for="product in displayedProducts"
          :key="product.id"
          class="product-item"
          @tap="goToSubPage(product.id)"
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
      <!-- 分页按钮 -->
      <view class="pagination">
        <button
          v-for="page in totalPages"
          :key="page"
          class="page-button"
          :class="{ active: currentPage === page }"
          @click="changePage(page)"
        >
          {{ page }}
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { getGoods, getMyPoints } from '@/services/point';

const app = getApp();

export default {
  data() {
    return {
      products: [],
      currentPage: 1,
      itemsPerPage: 8,
      amount: '100', // 显示为0，说明这边已经是当前用户的积分了
    };
  },
  async onLoad() {
    uni.pageScrollTo({
      scrollTop: 0,
      duration: 0,
    });
    await this.loadProducts();
  },
  computed: {
    displayedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.products.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.products.length / this.itemsPerPage);
    },
  },
  methods: {
    async loadProducts() {
      const res = await getGoods();
      this.products = res.result;
      const points = await getMyPoints(app.globalData.id);
      // console.log(app.globalData.id);
      this.amount = points.amount;
      // console.log(points.amount); //测试过，可用的，只是刚好我的积分也是0。。。
    },
    goToSubPage(id) {
      uni.navigateTo({
        url: `/pages/products/productDetail?id=${id}`,
      });
    },
    changePage(page) {
      this.currentPage = page;
    },
    gotoBill() {
      // 按钮点击后改变颜色
      uni.navigateTo({
        url: '/pages/products/upload',
      });
    },
  },
};
</script>

<style scoped>
.mall-page {
  padding: 20px;

}

/* 产品列表样式 */
.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* 产品之间的间隔 */
  justify-content: space-between; /* 使每行只放两个商品并平均分布 */
}

/* 产品项样式 */
.product-item {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 15px;
  border-radius: 10px;
  width: calc(50% - 10px);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

/* 产品图片样式 */
.product-image {
  max-width: 300 rpx;
  height: 170 rpx;
  border-radius: 5px;
  margin-bottom: 10px;
}

/* 产品名称样式 */
.product-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

/* 产品积分样式 */
.product-points {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}

/* 产品数量样式 */
.product-quantity {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  margin-bottom: 50px;
}

.page-button {
  background-color: #fff;
  color: #333;
  border: 1px solid #ddd;
  padding: 5px 10px;
  border-radius: 5px;
  margin: 0 5px;
  cursor: pointer;
}

.page-button.active {
  background-color: #39C5BB;
  color: #fff;
}

/*价格区间的样式*/
.price-filter {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.price-filter input {
  width: 80px;
  margin: 0 5px;
}

/*查看订单按钮*/
.floating-view {
  position: fixed;
  bottom: 5%;
  right: 5%;
  width: 100px;
  height: 60px;
  background-color: #39c5bb;
  display: flex;
  border-radius: 200 rpx;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  z-index: 999;
}

.view-content {
  text-align: center;
  font-size: 15px;
  font-family: "幼圆";
}

/*积分*/
.myPoints {
  background-color: #39C5BB;
  color: #fff;
  padding: 10px;
  font-size: 20px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  text-align: center;
  border: 5px solid #31aba1;
  letter-spacing: 3.9px; /*微操大师，凯申遗风*/
  font-family: '幼圆';
  font-weight: bold;
}
</style>
