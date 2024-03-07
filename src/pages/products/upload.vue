<template>
  <view>
    <cu-custom title="上传商品" />
    <view class="upload-product">
      <view class="form-group">
        <label
          for="product-name"
          class="input-label"
        >
          <text class="cuIcon-goods text-grey" />
          &nbsp;商品名称：</label>
        <input
          id="product-name"
          v-model="productData.name"
          type="text"
          class="text-input"
          placeholder="请输入商品名称"
          required
        >
      </view>
      <view class="form-group">
        <label
          for="product-points"
          class="input-label"
        >
          <text class="cuIcon-rank text-grey" />
          &nbsp;消耗积分：</label>
        <input
          id="product-points"
          v-model="productData.points"
          type="number"
          class="number-input"
          placeholder="请输入消耗积分"
        >
      </view>
      <view class="form-group">
        <label
          for="product-quantity"
          class="input-label"
        >
          <text class="cuIcon-scan text-grey" />
          &nbsp;库存数量：</label>
        <input
          id="product-quantity"
          v-model="productData.quantity"
          type="number"
          class="number-input"
          placeholder="请输入库存数量"
        >
      </view>
      <!--view class="form-group">
        <label
          for="product-id"
          class="input-label"
        ><text class="cuIcon-scan text-grey" />
          &nbsp;商品ID：</label>
        <input
          id="product-quantity"
          v-model="productData.id"
          type="text"
          class="number-input"
          placeholder="请输入商品ID"
        >
      </view-->
      <view class="form-group">
        <label
          for="product-picture"
          class="input-label"
        >
          <text class="cuIcon-pic text-grey" />
          &nbsp;商品图片：</label>
        <input
          id="product-picture"
          type="file"
          accept="image/*"
          class="file-input"
          style="display: none"
          @tap="handleFileChange"
        >
        <view
          v-if="!productData.picture"
          class="upload-placeholder"
          @tap="triggerFileInput"
        >
          <i class="iconfont icon-upload" />
          <p>点击上传图片</p>
        </view>
        <img
          v-if="imagePreviewUrl"
          class="uploaded-image"
          :src="imagePreviewUrl"
          alt="商品图片"
        >
      </view>
      <view class="form-group">
        <label
          for="product-details"
          class="input-label"
        >
          <text class="cuIcon-mark text-grey" />
          &nbsp;商品详情：</label>
        <textarea
          id="product-details"
          v-model="productData.details"
          class="textarea-input"
          placeholder="请输入商品详情"
          required
        />
      </view>
      <button
        class="submit-button"
        @tap="uploadGood"
      >
        提交商品
      </button>
    </view>
  </view>
</template>

<script>
import { uploadGoods } from '@/services/point';

export default {
  data() {
    return {
      productData: {
        name: '',
        points: 0,
        quantity: 0,
        picture: 'http://dummyimage.com/720x300',
        details: '',
        id: '',
      },
    };
  },
  methods: {
    async uploadGood() {
      try {
        await uploadGoods(this.productData);
        uni.showToast({
          title: '上传商品成功！',
          icon: 'success',
          duration: 2000,
        });
        setTimeout(() => {
          uni.navigateBack({
            delta: 1,
          });
        }, 1500);
      } catch (error) {
        uni.showToast({
          title: '上传商品失败！',
          icon: 'none',
          duration: 2000,
        });
      }
    },
  },
};
</script>

<style>
/* CSS to style the .upload-product class */
.upload-product {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f1f1f1;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Add media query to adjust max-width for smaller screens */
@media screen and (max-width: 480px) {
  .upload-product {
    max-width: 90%;
  }
}

/* Styling for form groups */
.form-group {
  margin-bottom: 20px;
}

/* Styling for labels */
label {
  display: block;
  font-weight: bold;
  font-size: 16px;
  color: #39C5BB;
  background-color: #f1f1f1;
  padding: 8px 12px;
  border: 1px solid #39C5BB;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, border 0.2s, box-shadow 0.2s;
}

/* Hover effect for labels */

/* Styling for text inputs and textarea */
input[type="text"],
input[type="number"],
textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: 'Arial', sans-serif;
  font-size: 14px;
  color: #333;
  background-color: #e8e8e8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.2s, box-shadow 0.2s;
}

/* Hover effect for text inputs and textarea */
input[type="text"]:hover,
input[type="number"]:hover,
textarea:hover {
  border-color: #39C5BB;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Focus effect for text inputs and textarea */
input[type="text"]:focus,
input[type="number"]:focus,
textarea:focus {
  border-color: #39C5BB;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  outline: none;
}

/* Styling for submit button */
button.submit-button {
  background-color: #39c5bb;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, box-shadow 0.2s;
}

/* Hover effect for submit button */
button.submit-button:hover {
  background-color: #39C5BB;
}

/* Styling for the upload placeholder */
.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 150px;
  border: 1px dashed #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.upload-placeholder i {
  font-size: 36px;
  color: #ccc;
}

.upload-placeholder p {
  margin-top: 10px;
  color: #ccc;
}

/* Styling for the uploaded image */
.uploaded-image {
  max-width: 100%;
  height: auto;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  display: block;
  box-shadow: 0 0 5 rgba(0, 0, 0, 0.2);
}
</style>
