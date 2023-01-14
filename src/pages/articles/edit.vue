<template>
  <view>
    <cu-custom title="文章发布" />
    <view style="height:100%;position:absolute;width:100%;">
      <!--标题-->
      <view class="flex align-center">
        <input
          class="extend text-bold"
          disabled
          value="标题"
        >
        <input
          class="fileName"
          placeholder="请输入文章标题"
          :value="article.title"
          @input="getTitle"
        >
      </view>

      <!--封面-->
      <view>
        <view class="flex align-center">
          <input
            class="extend text-bold"
            disabled
            value="封面"
          >
          <input
            class="extend text-grey"
            value="上传"
            @tap="getCover"
          >
        </view>
        <image
          v-if="article.cover"
          class="cover"
          :src="article.cover"
          mode="aspectFill"
        />
      </view>

      <!--简介-->
      <view>
        <input
          class="extend text-bold"
          disabled
          value="简介"
        >
        <textarea
          class="description"
          placeholder="请输入文章简介"
          :value="article.description"
          auto-height
          @input="getDescription"
        />
      </view>

      <!--内容-工具标题-->
      <view class="flex align-center">
        <input
          class="extend text-bold"
          disabled
          value="正文"
        >
        <input
          class="extend text-grey"
          disabled
          :value="inPreviewStatus?'编辑':'预览'"
          @tap="changeStatus"
        >
      </view>
      <!--内容-工具-->
      <view class="tips">
        <text
          class="tip"
          data-fh="#"
          @tap="tip"
        >
          #
        </text>
        <text
          class="tip"
          style="margin-left:10%;line-height:80rpx;"
          data-fh="*"
          @tap="tip"
        >
          *
        </text>
        <text
          class="tip"
          style="margin-left:20%;"
          data-fh="-"
          @tap="tip"
        >
          -
        </text>
        <text
          class="tip"
          style="margin-left:30%;font-size:24rpx"
          data-fh="code"
          @tap="tip"
        >
          {{ code }}
        </text>
        <text
          class="tip"
          style="margin-left:40%;"
          data-fh="link"
          @tap="tip"
        >
          🔗
        </text>
        <text
          class="tip"
          style="margin-left:50%;"
          @tap="uploadImg"
        >
          图
        </text>
        <text
          class="tip"
          style="margin-left:60%;"
          decode="true"
          data-fh=">"
          @tap="tip"
        >
          >&nbsp;
        </text>
        <text
          class="tip"
          style="margin-left:70%;style"
          data-fh="table"
          @tap="tip"
        >
          表
        </text>
      </view>
      <!--内容-->
      <view>
        <!--编辑状态-->
        <textarea
          v-if="!inPreviewStatus"
          class="markDown"
          placeholder="开始你的markdown编写..."
          maxlength="-1"
          :value="article.content"
          auto-height
          @input="getContent"
        />
        <!--预览状态-->
        <view
          v-if="inPreviewStatus"
          class="preview"
        >
          <MarkdownViewer :markdown="article.content" />
        </view>
      </view>
      <!--按钮-->
      <button
        class="cu-btn view bg-grey shadow margin"
        style="width:90vw;font-size:32rpx;"
        @tap="release"
      >
        {{ id===0?'发布':'更新' }}
      </button>
      <view class="stand-view" />
    </view>
  </view>
</template>

<script>
import CuCustom from '@/colorui/components/cu-custom.vue';
import { createArticle, getArticle, updateArticle } from '@/services/article';
import { chooseAndUploadAnImage } from '@/services/file';
import { DefaultArticleCover } from '@/const/urls';
import MarkdownViewer from '@/components/MarkdownViewer.vue';

export default {
  components: { MarkdownViewer, CuCustom },
  data() {
    return {
      rawMD: '',
      code: '</>',
      inPreviewStatus: 0,
      id: 0, // 文章 id ，0 为新建文章
      article: {
        title: '',
        cover: DefaultArticleCover,
        description: '',
        content: '',
      },
    };
  },
  async onLoad(options) {
    if (+options.id > 0) {
      this.id = options.id;
      const res = await getArticle(options.id);
      if ('article' in res) this.article = res.article;
    }
  },
  methods: {
    getTitle(e) {
      this.title = e.detail.value;
    },

    async getCover() {
      try {
        this.article.cover = await chooseAndUploadAnImage();
      } catch (e) {
        uni.showToast({
          title: '出错啦',
        });
        this.article.cover = DefaultArticleCover;
      }
    },

    getDescription(e) {
      this.article.description = e.detail.value;
    },

    changeStatus() {
      this.inPreviewStatus = 1 - this.inPreviewStatus;
    },

    getContent(e) {
      this.article.content = e.detail.value;
    },

    tip(e) {
      let tip = e.currentTarget.dataset.fh;
      if (tip === 'code') {
        tip = '``` js\ninput your code\n```';
      } else if (tip === 'link') {
        tip = '[url](https://)';
      } else if (tip === 'table') {
        tip = '|h|h|\n|--|--|\n|b|b|';
      }
      this.article.content += tip;
    },

    async uploadImg() {
      this.article.content += `![image](${await chooseAndUploadAnImage()})`;
    },

    release() {
      const {
        title,
        cover,
        description,
        content,
      } = this.article;
      if (!title) {
        uni.showToast({
          title: '标题不能为空',
          icon: 'error',
        });
        return;
      }
      if (!cover) {
        uni.showToast({
          title: '封面不能为空',
          icon: 'error',
        });
        return;
      }
      if (!description) {
        uni.showToast({
          title: '简介不能为空',
          icon: 'error',
        });
        return;
      }
      if (!content) {
        uni.showToast({
          title: '内容不能为空',
          icon: 'error',
        });
        return;
      }

      if (this.id === 0) {
        // 创建文章
        createArticle(this.article).then(() => {
          uni.showToast({
            title: '发布成功，请等待审核',
            icon: 'success',
          });
        });
      } else {
        // 更新文章
        updateArticle(this.id, this.article).then(() => {
          uni.showToast({
            title: '更新成功，请等待审核',
            icon: 'success',
          });
        });
      }
    },
  },
};
</script>
<style>
page {
  font-size: 32rpx;
}

.fileName {
  height: 4%;
  background-color: white;
  padding: 1.8%;
  width: 77.5%;
  margin-left: 2.5%;
  margin-top: 2.5%;
  border-radius: 10rpx;
}

.description {
  height: 10%;
  padding: 2.5%;
  width: 90%;
  margin-left: 5%;
  margin-top: 20rpx;
  border-radius: 10rpx;
  background-color: white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.cover {
  width: 90%;
  margin-left: 5%;
  margin-top: 20rpx;
  border-radius: 10rpx;
  background-color: white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.extend {
  height: 4%;
  background-color: #dbdee2;
  width: 15%;
  margin-left: 2.5%;
  margin-top: 2.5%;
  border-radius: 10rpx;
  display: inline-view;
  text-align: center;
}

.tips {
  height: 5%;
  margin-top: 1.5%;
  width: 95%;
  margin-left: 5%;
}

.tip {
  width: 60rpx;
  height: 60rpx;
  position: absolute;
  background-color: #dbdee2;
  text-align: center;
  line-height: 60rpx;
  font-size: 36rpx;
  border-radius: 10rpx;
}

.markDown {
  height: 65%;
  padding: 2.5%;
  width: 90%;
  margin-left: 5%;
  margin-top: 10rpx;
  border-radius: 10rpx;
  background-color: white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.preview {
  background-color: white;
  padding: 2.5%;
  width: 95%;
  margin-left: 2.5%;
  margin-top: 10rpx;
  border-radius: 10rpx;
  height: 65%;
  overflow: auto;
  line-height: 80rpx;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
