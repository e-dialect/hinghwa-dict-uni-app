<template>
  <view class="padding-sm">
    <view class="flex">
      <image
        class="cu-avatar round margin-right-sm"
        :src="comment.user.avatar"
        mode="aspectFill"
        @tap.stop="toUserPage(comment.user.id)"
      />
      <view class="flex flex-sub justify-between">
        <view class="flex flex-direction">
          <view
            class="text-name"
            @tap.stop="toUserPage(comment.user.id)"
          >
            {{ comment.user.nickname }}
          </view>
          <view class="text-date">
            {{ comment.time }}
          </view>
        </view>
        <!--        TODO 增加删除回复按钮-->
        <!--        <view v-if="this_is_my_comment" @tap="deleteComment">-->
        <!--          <text class="text-red">[删除评论]</text>-->
        <!--        </view>-->
        <!--        TODO 添加评论点赞功能-->
        <!--        <view class="text-dz">-->
        <!--          <text class="cuIcon-appreciate"></text>-->
        <!--        </view>-->
      </view>
    </view>
    <view
      class="text-content margin-top-sm"
    >
      <text
        v-if="parentId !== comment.parent && comment.parent !== 0"
        class="text-blue"
      >
        @{{ mention }}
      </text>
      <text
        v-if="parentId !== comment.parent && comment.parent !== 0"
      >
        ：
      </text>
      <text class="padding-left-xs">
        {{ comment.content }}
      </text>
    </view>
  </view>
</template>

<script>
import { toUserPage } from '@/routers/user';

export default {
  name: 'ArticleComment',
  props: {
    comment: {
      type: Object,
      default: () => ({}),
    },
    parentId: {
      type: Number,
      default: 0,
    },
    mention: {
      type: String,
      default: '',
    },

  },
  data() {
    return {
      toUserPage,
    };
  },
};
</script>

<style scoped>

</style>
