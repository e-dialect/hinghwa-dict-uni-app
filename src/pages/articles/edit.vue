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
          v-model="article.title"
          class="fileName"
          placeholder="请输入文章标题"
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
            @tap="uploadCover"
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
          v-model="article.description"
          class="description"
          placeholder="请输入文章简介"
          auto-height
          style="min-height: 5vh"
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
          @tap="inPreviewStatus=!inPreviewStatus"
        >
      </view>
      <!--内容-工具-->
      <view class="tips flow">
        <text
          class="tip"
          @tap="toolsHandler('#')"
        >
          #
        </text>
        <text
          class="tip text-bold"
          style="margin-left:10%;"
          @tap="toolsHandler('bold')"
        >
          B
        </text>
        <text
          class="tip"
          style="margin-left:20%;font-size:24rpx"
          @tap="toolsHandler('code')"
        >
          {{ code }}
        </text>
        <text
          class="tip"
          style="margin-left:30%;"
          @tap="toolsHandler('link')"
        >
          🔗
        </text>
        <text
          class="tip"
          style="margin-left:40%;"
          @tap="insertImage"
        >
          图
        </text>
        <text
          class="tip"
          style="margin-left:50%;"
          data-fh="table"
          @tap="toolsHandler('table')"
        >
          表
        </text>
      </view>
      <!--内容-->
      <view>
        <!--编辑状态-->
        <textarea
          v-if="!inPreviewStatus"
          v-model="article.content"
          class="markDown"
          placeholder="开始你的markdown编写..."
          maxlength="10000"
          auto-height
          style="min-height: 20vh;"
          @blur="e=>{cursor=e.detail.cursor}"
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
        {{ id === 0 ? '发布' : '更新' }}（需审核）
      </button>
      <view class="stand-view" />
    </view>
  </view>
</template>

<script>
import { createArticle, getArticle, updateArticle } from '@/services/article';
import { chooseAndUploadAnImage } from '@/services/file';
import { DefaultArticleCover } from '@/const/urls';
import CuCustom from '@/colorui/components/cu-custom';
import MarkdownViewer from '@/components/MarkdownViewer';

export default {
  components: { MarkdownViewer, CuCustom },
  data() {
    return {
      code: '</>', // 为了显示代码块
      inPreviewStatus: false,
      id: 0, // 文章 id ，0 为新建文章
      article: {
        title: '',
        cover: DefaultArticleCover,
        description: '',
        content: '',
      },
      cursor: -1, // 编辑框中的光标位置
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

    /**
     * 上传封面
     * @returns {Promise<void>}
     */
    async uploadCover() {
      try {
        this.article.cover = await chooseAndUploadAnImage();
      } catch (e) {
        uni.showToast({
          title: '出错啦',
        });
        this.article.cover = DefaultArticleCover;
      }
    },

    /**
     * 工具栏点击事件
     * @param tool 工具名
     */
    toolsHandler(tool) {
      let content = ''; // 插入的 markdown 内容
      switch (tool) {
        case '#':
          content = '# ';
          break;
        case 'bold':
          content = '**粗体**';
          break;
        case 'code':
          content = '```\n\n```';
          break;
        case 'link':
          content = '[链接描述](链接地址)';
          break;
        case 'table':
          content = '| 标题1 | 标题2 | 标题3 |\n| :--- | :---: | ---: |\n| 内容1 | 内容2 | 内容3 |\n';
          break;
        default:
          content = tool;
      }

      if (this.cursor === -1) {
        this.article.content += content;
      } else {
        this.article.content = this.article.content.slice(0, this.cursor)
          + content
          + this.article.content.slice(this.cursor);
      }
    },

    /**
     * 工具栏里插入图片
     * @returns {Promise<void>}
     */
    async insertImage() {
      try {
        const url = await chooseAndUploadAnImage();
        if (this.cursor === -1) {
          this.article.content += `![你的图片说明](${url})`;
        } else {
          this.article.content = `${this.article.content.slice(0, this.cursor)
          }![你的图片说明](${url})${
            this.article.content.slice(this.cursor)}`;
        }
      } catch (e) {
        uni.showToast({
          title: '出错了！',
          icon: 'error',
        });
      }
    },

    /**
     * 发布文章
     */
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
            title: '发布成功',
            icon: 'success',
          });
          uni.navigateBack();
        });
      } else {
        // 更新文章
        updateArticle(this.id, this.article).then(() => {
          uni.showToast({
            title: '更新成功',
            icon: 'success',
          });
          uni.navigateBack();
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
