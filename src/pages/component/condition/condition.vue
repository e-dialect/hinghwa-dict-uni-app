<template>
  <view>
    <cu-custom
      :is-back="true"
      bg-color="bg-white"
    >
      <view
        slot="content"
        class="text-black"
      >
        条件查字
      </view>
    </cu-custom>

    <view class="cu-form-group">
      <view class="title">
        声母
      </view>
      <picker
        :range="shengmu"
        :value="index"
        @change="PickerChange"
      >
        <view class="picker">
          {{ shengmu[index] }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group">
      <view class="title">
        韵母
      </view>
      <picker
        :range="yunmu"
        :value="multiIndex"
        mode="multiSelector"
        @change="MultiChange"
        @columnchange="MultiColumnChange"
      >
        <view class="picker">
          {{ yunmu[1][multiIndex[1]] }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group">
      <view class="title">
        声调
      </view>
      <picker
        :range="shengdiao"
        :value="index1"
        @change="PickerChange1"
      >
        <view class="picker">
          {{ shengdiao[index1] }}
        </view>
      </picker>
    </view>
    <view class="flex justify-center">
      <button
        class="cu-btn round bg-gradual-blue shadow text-df margin-top margin-bottom"
        style="display: flex; justify-content: center; width: 65vw"
        @tap="searchByConditions"
      >
        条件检索
      </button>
    </view>
    <view
      v-for="(item, index2) in result"
      :key="index2"
      class="padding bg-white solid-bottom"
    >
      <view class="text-bold text-xxl text-black">
        {{ item.pinyin }}
      </view>

      <view>
        <text
          v-for="(jtem, index12) in item.characters"
          :key="index12"
          :data-id="jtem.word"
          @tap="getWord"
        >
          <text
            :class="'text-xxl ' + (jtem.word ? 'text-blue' : 'text-black')"
            space="emsp"
          >
            {{ jtem.character }}
          </text>

          <text
            v-if="jtem.traditional !== jtem.character"
            class="text-xl"
            space="emsp"
          >
            {{ jtem.traditional }}
          </text>

          <text
            v-else
            class="text-xl"
            space="emsp"
          >
            {{ space }}
          </text>
        </text>
      </view>
    </view>
  </view>
</template>

<script>
import { searchCharactersByFilters } from '@/services/character';

const app = getApp();

const utils = require('../../../const/sheng-yun-diao.js');

export default {
  data() {
    return {
      index: 0,
      shengmu: [],
      yunmu: [
        [],
        [],
      ],
      multiIndex: [0, 0],
      index1: 0,
      shengdiao: [],
      result: [],
      space: ' ',
    };
  },
  onLoad() {
    // 获取声母
    const shengmu = [];

    for (const k in utils.shengmu) {
      shengmu.push(utils.shengmu[k]);
    }
    this.shengmu = [...shengmu];

    // 获取韵母
    const yunmu = [
      [],
      [],
    ];

    for (let i = 0; i < utils.yunmu.length; i += 1) {
      if (i === 0) {
        for (let j = 0; j < utils.yunmu[0].children.length; j += 1) {
          yunmu[1].push(utils.yunmu[0].children[j].label);
        }
      }

      yunmu[0].push(utils.yunmu[i].label);
    }
    this.yunmu = [...yunmu];

    // 获取声调
    const shengdiao = [];

    for (const k in utils.shengdiao) {
      shengdiao.push(utils.shengdiao[k]);
    }

    shengdiao.unshift(shengdiao[shengdiao.length - 1]);
    shengdiao.pop();
    this.shengdiao = [...shengdiao];
  },
  /**
   * 右上角分享事件
   */
  onShareAppMessage() {
    return {
      title: '条件查字',
      path: '/pages/component/condition/condition',
      success: () => {
        uni.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000,
        });
      },
      fail: () => {
        uni.showToast({
          title: '分享失败',
          icon: 'none',
          duration: 2000,
        });
      },
    };
  },
  methods: {
    PickerChange(e) {
      this.index = e.detail.value;
    },

    MultiChange(e) {
      this.multiIndex = e.detail.value;
    },

    MultiColumnChange(e) {
      const data = {
        yunmu: this.yunmu,
        multiIndex: this.multiIndex,
      };
      data.multiIndex[e.detail.column] = e.detail.value;

      switch (e.detail.column) {
        case 0:
          data.yunmu[1] = [];

          switch (data.multiIndex[0]) {
            case 0:
              for (let i = 0; i < utils.yunmu[0].children.length; i += 1) {
                data.yunmu[1].push(utils.yunmu[0].children[i].label);
              }

              break;

            case 1:
              for (let i = 0; i < utils.yunmu[1].children.length; i += 1) {
                data.yunmu[1].push(utils.yunmu[1].children[i].label);
              }

              break;

            case 2:
              for (let i = 0; i < utils.yunmu[2].children.length; i += 1) {
                data.yunmu[1].push(utils.yunmu[2].children[i].label);
              }

              break;

            case 3:
              for (let i = 0; i < utils.yunmu[3].children.length; i += 1) {
                data.yunmu[1].push(utils.yunmu[3].children[i].label);
              }

              break;
          }

          data.multiIndex[1] = 0;
          break;
      }
      // TODO refactor
      this.setData(data);
    },

    PickerChange1(e) {
      this.index1 = e.detail.value;
    },

    getShengmu() {
      const shengmu = this.shengmu[this.index];

      for (const k in utils.shengmu) {
        if (utils.shengmu[k] === shengmu) {
          return k;
        }
      }
    },

    getYunmu() {
      for (let i = 0; i < utils.yunmu.length; i += 1) {
        if (utils.yunmu[i].label === this.yunmu[0][this.multiIndex[0]]) {
          for (let j = 0; j < utils.yunmu[i].children.length; j += 1) {
            if (utils.yunmu[i].children[j].label === this.yunmu[1][this.multiIndex[1]]) {
              return utils.yunmu[i].children[j].value;
            }
          }
        }
      }
    },

    getShengdiao() {
      const shengdiao = this.shengdiao[this.index1];

      for (const k in utils.shengdiao) {
        if (utils.shengdiao[k] === shengdiao) {
          return k;
        }
      }
    },

    searchByConditions() {
      // 获取声母、韵母和声调
      const shengmu = this.getShengmu();
      const yunmu = this.getYunmu();
      const shengdiao = this.getShengdiao();

      if (shengmu === 'all' && yunmu === 'all' && shengdiao === 'all') {
        uni.showModal({
          content: '有超过500个可能拼音，过于宽泛！请再详细一些~',
          showCancel: false,
        });
      } else {
        this.search(shengmu, yunmu, shengdiao);
      }
    },

    search(shengmu, yunmu, shengdiao) {
      searchCharactersByFilters({ shengmu, yunmu, shengdiao }).then((res) => {
        this.result = res.result;
        // TODO 直接显示结果而不是弹窗
        if (!this.result.length) {
          uni.showToast({
            title: '检索结果为空',
            icon: none,
          });
        }
      });
    },

    getCharacter(e) {
      const { id } = e.currentTarget.dataset;
      uni.navigateTo({
        url: `/pages/basics/characters/characters?id=${id}`,
      });
    },

    getWord(e) {
      const { id } = e.currentTarget.dataset;
      if (!id) return;
      uni.navigateTo({
        url: `/pages/basics/words/words?id=${id}`,
      });
    },
  },
};
</script>
