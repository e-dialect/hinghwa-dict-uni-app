<template>
  <view class="cu-list menu">
    <view
      v-for="(item, index1) in words"
      :key="index1"
      class="cu-item"
      style="min-height: 200rpx;border-bottom: 1upx solid rgba(0, 0, 0, 0.07);"
      :data-index="index1"
    >
      <view
        class="cuIcon-roundadd roundPos"
        @click="addWord(item.word.id)"
      />
      <view class="cu-list menu">
        <view class="flex flex-direction justify-between">
          <view class="margin-bottom-xs">
            <text class="text-xxl text-bold">
              {{ item.word.word }}
            </text>
          </view>
          <view
            class="margin-bottom-xs"
            @tap.stop="playAudio(item.pronunciation.url,false)"
          >
            <text>{{ item.word.standard_pinyin }}</text>
            <text class="text-grey padding-left">
              /{{ item.word.standard_ipa }}/
            </text>
            <text
              v-if="item.pronunciation.url.length > 4"
              class="cuIcon-notificationfill text-blue margin-left"
            />
          </view>
          <view class="text-grey definition">
            {{ item.word.definition }}
          </view>
        </view>
      </view>
      <view
        v-if="words.length === 0"
        class="text-center margin"
      >
        <text class="text-lg text-gray">
          --- 暂无数据 ---
        </text>
      </view>
    </view>
  </view>
</template>
<script>

import { playAudio } from '@/utils/audio';

export default {
  name: 'ChooseWordListAdd',
  props: {
    words: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      chooseID: 0,
    };
  },
  methods: {
    playAudio,
    addWord(id) {
      this.chooseID = id;
      console.log(this.chooseID);
      this.$emit('addCheck', this.chooseID);
    },
  },
};
</script>

<style scoped>
.definition {
  overflow: hidden;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.roundPos {
  display: flex;
  position: fixed;
  text-align: centere;
  font-size: 40 rpx;
  color: #838383;
  margin-left: 85%;
}
</style>
