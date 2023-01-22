<template>
  <view>
    <cu-custom title="条件查字" />

    <view class="cu-form-group">
      <view class="title">
        声母
      </view>
      <picker
        :value="shengmuIndex"
        :range="shengmu"
        @change="changeShengmu"
      >
        <view class="picker">
          {{ shengmu[shengmuIndex] }}
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
        :value="shengdiaoIndex"
        :range="shengdiao"
        @change="changeShengdiao"
      >
        <view class="picker">
          {{ shengdiao[shengdiaoIndex] }}
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
import { defaultMessage } from '@/services/shareMessages';
import { toWordPage } from '@/routers/word';

const app = getApp();

const utils = require('@/const/sheng-yun-diao');
// TODO refactor
export default {
  data() {
    return {
      shengmuIndex: 0,
      shengmu: [],
      yunmu: [
        [],
        [],
      ],
      multiIndex: [0, 0],
      shengdiaoIndex: 0,
      shengdiao: [],
      result: [],
      space: ' ',
    };
  },
  onLoad(options) {
    // 获取声母
    const shengmu = [];

    for (const k in utils.shengmu) {
      if ({}.hasOwnProperty.call(utils.shengmu, k)) {
        shengmu.push(utils.shengmu[k]);
      }
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
      if ({}.hasOwnProperty.call(utils.shengdiao, k)) {
        shengdiao.push(utils.shengdiao[k]);
      }
    }

    shengdiao.unshift(shengdiao[shengdiao.length - 1]);
    shengdiao.pop();
    this.shengdiao = [...shengdiao];

    for (let i = 0; i < this.shengmu.length; i += 1) {
      if (this.shengmu[i] === utils.shengmu[options.shengmu]) {
        this.shengmuIndex = i;
      }
    }
    for (let i = 0; i < utils.yunmu.length; i += 1) {
      for (let j = 0; j < utils.yunmu[i].children.length; j += 1) {
        if (utils.yunmu[i].children[j].value === options.yunmu) {
          this.multiIndex = [i, j];
          this.yunmu[0] = utils.yunmu[i].label;
          this.yunmu[1] = [];
          for (let k = 0; k < utils.yunmu[i].children.length; k += 1) {
            this.yunmu[1].push(utils.yunmu[i].children[k].label);
          }
          this.yunmu = [...this.yunmu];
        }
      }
    }

    for (let i = 0; i < this.shengdiao.length; i += 1) {
      if (this.shengdiao[i] === utils.shengdiao[options.shengdiao]) {
        this.shengdiaoIndex = i;
      }
    }
  },
  /**
   * 右上角分享事件
   */
  onShareAppMessage() {
    return {
      title: '条件查字',
      path: `/pages/tools/condition?shengmu=${this.getShengmu()}&yunmu=${this.getYunmu()}&shengdiao=${this.getShengdiao()}`,
      ...defaultMessage(),
    };
  },
  methods: {

    MultiChange(e) {
      this.multiIndex = e.detail.value;
    },

    MultiColumnChange(e) {
      const data = {
        yunmu: this.yunmu,
        multiIndex: this.multiIndex,
      };
      data.multiIndex[e.detail.column] = e.detail.value;

      if (e.detail.column === 0) {
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
          default:
            uni.showToast({
              title: '出错啦',
              icon: 'none',
            });
        }

        data.multiIndex[1] = 0;
      }
      this.yunmu = [...data.yunmu];
      this.multiIndex = [...data.multiIndex];
    },

    getShengmu() {
      const shengmu = this.shengmu[this.shengmuIndex];
      for (const k in utils.shengmu) {
        if ({}.hasOwnProperty.call(utils.shengmu, k)) {
          if (utils.shengmu[k] === shengmu) {
            return k;
          }
        }
      }
      return null;
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
      return null;
    },

    getShengdiao() {
      const shengdiao = this.shengdiao[this.shengdiaoIndex];
      for (const k in utils.shengdiao) {
        if ({}.hasOwnProperty.call(utils.shengdiao, k)) {
          if (utils.shengdiao[k] === shengdiao) {
            return k;
          }
        }
      }
      return null;
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

    getWord(e) {
      const { id } = e.currentTarget.dataset;
      if (!id) return;
      toWordPage(id);
    },

    changeShengmu(e) {
      this.shengmuIndex = e.detail.value;
    },
    changeShengdiao(e) {
      this.shengdiaoIndex = e.detail.value;
    },
  },
};
</script>
