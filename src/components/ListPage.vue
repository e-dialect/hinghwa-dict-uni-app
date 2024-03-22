<template>
  <view class="padding-bottom-lg">
    <view
      v-if="wordList && wordList.length === 0"
      class="text-lg margin"
    >
      <text>现在没有词单哦</text>
    </view>
    <view
      v-for="(item, index) in wordList"
      v-else
      :key="index"
      class="word-card padding-xs shadow -gray cu-card article no-card"
      style="margin: 3vw;"
      @tap="toWordPage(item.id)"
    >
      <view class="cu-item shadow margin-bottom-sm">
        <view class="flex justify-between">
          <view
            class="title flex align-center"
            style="width: 80%;"
          >
            <view class="text-cut">
              {{ item.name }}
            </view>
            <view class="cu-tag bg-blue light sm round margin">
              <text class="cuIcon-appreciate">
                {{ item.author.nickname }}
              </text>
            </view>
            <view class="cu-tag bg-orange light sm round margin">
              <text class="cuIcon-warn">
                {{ formatDate(item.updateTime) }}
              </text>
            </view>
          </view>
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
            <view class="text-content description">
              {{ item.description }}
            </view>
          </view>
        </view>
        <view class="time">
          <text class="text-grey fr margin-right-xl margin-top-xs">
            {{ formatDate(item.updateTime) }}
          </text>
        </view>
      </view>
    </view>
    <view
      v-if="wordList.length"
      class="text-gray margin-top-lg text-center"
    >
      <text>—— 暂时没有更多内容了 ——</text>
    </view>
  </view>
</template>

<script>
import { defineComponent } from 'vue';
import { toWordPage } from '@/routers/word';

export default defineComponent({
  name: 'WordList',
  props: {
    wordList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      toWordPage,
    };
  },
});
</script>

<style scoped>
.word-card {
  background-color: #ffffff;
  border-radius: 20rpx;
  margin-right: 1vw;
}
.description {
  overflow: hidden;
  -webkit-line-clamp: 3;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  max-width: 50vw;
}
</style>
