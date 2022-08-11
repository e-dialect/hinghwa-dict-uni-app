<template>
  <view>
    <cu-custom
      bg-color="bg-white"
      :is-back="true"
    />

    <!--当前评论-->
    <view>
      <ArticleComment :comment="comment" />
    </view>
   
    <!--子评论-->
    <view class="text-df text-bold padding-top-lg padding-sm">
      全部回复（{{ comment.kids.length }}条）
    </view>
    <view
      v-for="(item, index) in comment.kids"
      :key="index"
      class="padding-top-xs"
    >
      <view>
        <ArticleComment :comment="item" />
      </view>
    </view>
	
    <!--评论框-->
    <view
      class="cu-bar foot input padding-bottom"
      style="min-height: 120rpx"
    >
      <view class="input-box">
        <input
          :adjust-position="true"
          :placeholder="ph_text"
          :value="text"
          style="margin-left: 30rpx"
          @blur="blur"
          @focus="focus"
          @input="getText"
        >
      </view>
      <button
        class="cu-btn bg-blue shadow"
        style="width: 16vw"
        @tap="createComment"
      >
        发送
      </button>
    </view>
  </view>
</template>

<script>
import {toUserPage}                 from "@/routers";
import {createComment, getComments} from "@/services/article";
import ArticleComment               from "@/components/ArticleComment";

const app = getApp();
export default {
  components: {
    ArticleComment
  },
  data() {
    return {
      toUserPage: toUserPage,
      id: 0,
      parent: 0,

      comment: {
        user: {
          avatar: '',
          nickname: ''
        },

        time: '',
        content: '',
        kids: [],
        id: ''
      },

      map: [],
      ph_text: '评论...',
      inEditing: false,
      text: '',
    };
  },
  onLoad(options) {
    let comment  = JSON.parse(options.comment);
    let id       = options.id;
    this.comment = comment
    this.id      = id

    let map = [];
    for (let i = 0; i < this.comment.kids.length; i++) {
      map[this.comment.kids[i].id] = i;
    }
    this.map = map
  },
  methods: {
    /**
     * 选中评论框，进入编辑状态
     */
    focus() {
      this.inEditing = true
    },

    /**
     * 离开评论框，退出编辑状态
     */
    blur() {
      if (this.text === '') {
        this.reply(0)
      }
      this.inEditing = false
    },

    /**
     * 回复某评论
     * @param id 0 表示直接评论文章，其他表示回复某评论的子评论
     */
    reply(id) {
      this.parent = id
      this.text   = ''
    },

    /**
     * 同步评论内容
     * @param e
     */
    getText(e) {
      this.text = e.detail.value
    },

    /**
     * 获取文章评论
     * @param id 文章id
     */
    getComments(id) {
      getComments(id).then(res => {
        this.comment = res.comment;
        this.map     = res.map;
      });
    },
    /**
     * 发送评论
     */
    createComment() {
      const comment = this.text;
      const parent  = this.comment.id;
      const id      = this.id;
      if (comment.length === 0) {
        uni.showToast({
          title: '不能发送空评论',
          icon: 'none'
        });
        return;
      }
      createComment(id, comment, parent).then(async () => {
        await this.getComments(id);
        this.reply(0)
        this.inEditing = false
        setTimeout(() => {
          uni.showToast({
            title: '发表成功'
          });
        }, 100)
      });
    },

  }
};
</script>
<style>
page {
  background-color: white;
}

.text-name {
  color: #666666;
  font-size: 30rpx;
}

.text-date {
  color: #9b9b9b;
  font-size: 24rpx;
}

.text-dz {
  color: #999999;
  font-size: 36rpx;
  align-self: center;
}

.text-content {
  position: relative;
  width: 85vw;
  left: 10vw;
  margin-top: 15rpx;
}

.input-box {
  flex: 1;
  margin-left: 20rpx;
  margin-right: 20rpx;
  border-radius: 5000rpx;
  background-color: #f5f5f5;
}
</style>
