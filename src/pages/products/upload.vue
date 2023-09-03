<template>
  <view>
    <cu-custom title="积分商城" />
    <div class="upload-product">
      <div class="form-group">
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
        >
      </div>
      <div class="form-group">
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
      </div>
      <div class="form-group">
        <label
          for="product-quantity"
          class="input-label"
        ><text class="cuIcon-scan text-grey" />
          &nbsp;库存数量：</label>
        <input
          id="product-quantity"
          v-model="productData.quantity"
          type="number"
          class="number-input"
          placeholder="请输入库存数量"
        >
      </div>
      <div class="form-group">
        <label
          for="product-picture"
          class="input-label"
        ><text class="cuIcon-pic text-grey" />
          &nbsp;商品图片：</label>
        <!-- Hidden file input -->
        <input
          id="product-picture"
          type="file"
          accept="image/*"
          class="file-input"
          style="display: none"
          @click="handleFileChange"
        >
        <!-- Clickable upload placeholder -->
        <div
          v-if="!productData.picture"
          class="upload-placeholder"
          @click="triggerFileInput"
        >
          <i class="iconfont icon-upload" />
          <p>点击上传图片</p>
        </div>
        <!-- 显示图片预览 -->
        <img
          v-if="imagePreviewUrl"
          class="uploaded-image"
          :src="imagePreviewUrl"
          alt="商品图片"
        >
      </div>
      <div class="form-group">
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
        />
      </div>
      <button
        class="submit-button"
        @click="submitProduct"
      >
        提交商品
      </button>
    </div>
  </view>
</template>

<script>
import { ref } from 'vue';
import { chooseAndUploadAnImage } from '@/services/file';

export default {
  setup() {
    const productData = ref({
      name: '',
      points: 0,
      quantity: 0,
      picture: '',
      details: '',
      id: '', // 如果需要，可以设置商品 ID
    });

    const imagePreviewUrl = ref('');

    const handleFileChange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      // 使用 FileReader 读取图片文件并设置预览 URL
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreviewUrl.value = e.target.result;
      };
      reader.readAsDataURL(file);

      // 选择并上传图片
      const imageUrl = await chooseAndUploadAnImage(file);

      // 在这里将文件路径赋值给 productData.picture
      productData.value.picture = imageUrl;
    };

    const triggerFileInput = () => {
      // Trigger the hidden file input
      const fileInput = document.getElementById('product-picture');
      fileInput.click();
    };

    const submitProduct = async () => {
      // Disable the submit button to prevent multiple submissions while processing
      const submitButton = document.querySelector('.submit-button');
      submitButton.disabled = true;

      try {
        // Make sure all required fields are filled before submitting
        if (!productData.value.name || !productData.value.points || !productData.value.quantity) {
          uni.showToast({
            title: '请填写所有必填项',
            icon: 'none',
          });
          return;
        }

        // Send the product data to the backend server
        const response = await uni.request({
          url: '/products', // Replace with your actual API endpoint
          method: 'POST',
          data: productData.value,
        });

        // Check if the product submission was successful
        if (response.statusCode === 200) {
          uni.showToast({
            title: '商品提交成功',
            icon: 'success',
          });

          // Clear the form fields after successful submission
          productData.value.name = '';
          productData.value.points = 0;
          productData.value.quantity = 0;
          productData.value.picture = '';
          productData.value.details = '';

          // Clear the image preview
          imagePreviewUrl.value = '';
        } else {
          uni.showToast({
            title: '商品提交失败，请重试',
            icon: 'none',
          });
        }
      } catch (error) {
        uni.showToast({
          title: '网络请求失败，请重试',
          icon: 'none',
        });
      } finally {
        // Enable the submit button again after processing is complete
        submitButton.disabled = false;
      }
    };

    return {
      productData,
      imagePreviewUrl,
      handleFileChange,
      triggerFileInput,
      submitProduct,
    };
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
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  }
</style>
