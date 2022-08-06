<template>
  <view class="padding-bottom-sm">
    <view class="flex">
      <image
        :src="comment.user.avatar"
        class="cu-avatar round margin-right-sm"
        mode="aspectFill"
        @tap="toUserPage(comment.user.id)"
      />

      <view class="flex flex-sub justify-between">
        <view class="flex flex-direction">
          <view class="text-name">
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

    <view class="text-content padding-left-xl">
      {{ comment.content }}
    </view>
  </view>
</template>

<script>
import {toUserPage} from "@/routers";

export default {
  name: "ArticleComment",
  props: {
    comment: {
      type: Object
    }
  },
  data() {
    return {
      toUserPage: toUserPage,
    }
  }
}
</script>

<style scoped>

</style>
