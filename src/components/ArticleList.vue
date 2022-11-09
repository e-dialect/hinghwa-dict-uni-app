<template>
  <view class="padding-bottom-lg">
    <view
      v-for="(item, index) in articleList"
      :key="index"
      class="word-card padding-xs shadow -gray cu-card article no-card"
      style="margin: 3vw;"
      :data-index="index"
      @tap="toArticlePage(item.article.id)"
    >
      <view class="cu-item shadow margin-bottom-sm">
        <view class="flex justify-between">
          <view
            class="title flex align-center"
            style="width: 80%;"
          >
            <view class="text-cut">
              {{ item.article.title }}
            </view>
            <view class="cu-tag bg-blue light sm round margin">
              <text class="cuIcon-appreciate">
                {{ item.article.likes }}
              </text>
            </view>
          </view>
          <text class="cuIcon-attention text-grey margin-top-sm margin-right">
            {{ item.article.views }}
          </text>
        </view>
        <view class="content">
          <view class="desc">
            <view
              class="text-df"
              style="margin-bottom: 17upx;"
            >
              <image
                class="cu-avatar round ssm"
                :src="item.author.avatar"
                mode="aspectFill"
              />
              <text
                :decode="true"
                class="margin-xs"
              >
                &nbsp;{{ item.author.nickname }}&nbsp;&nbsp;
              </text>
            </view>
            <view class="text-content">
              {{ item.article.description }}
            </view>
          </view>
          <image
            :src="item.article.cover"
            mode="aspectFill"
            class="margin-top"
          />
        </view>
        <view class="time">
          <text class="text-grey fr margin-right-xl margin-top-xs">
            {{ item.article.publish_time }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {toArticlePage} from "@/routers";
export default {
  name: "ArticleList",
  props: {
    articleList: {
      type: Object,
      default: () => ({})
    },
  },
  data() {
    return {
      toArticlePage: toArticlePage,
    }
  }
}
</script>

<style scoped>
</style>