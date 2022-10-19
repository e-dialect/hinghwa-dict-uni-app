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
const app = getApp();

const utils = require('../../../const/sheng-yun-diao.js');

export default {
  data() {
    return {
      index: 0,
      shengmu: [],
      yunmu: [
        [],
        []
      ],
      multiIndex: [0, 0],
      index1: 0,
      shengdiao: [],
      result: [],
      space: ' '
    };
  },
  onLoad() {
    // 获取声母
    let shengmu = [];

    for (let k in utils.shengmu) {
      shengmu.push(utils.shengmu[k]);
    }

    this.setData({
      shengmu: shengmu
    }); // 获取韵母

    let yunmu = [
      [],
      []
    ];

    for (let i = 0; i < utils.yunmu.length; i++) {
      if (i == 0) {
        for (let j = 0; j < utils.yunmu[0].children.length; j++) {
          yunmu[1].push(utils.yunmu[0].children[j].label);
        }
      }

      yunmu[0].push(utils.yunmu[i].label);
    }

    this.setData({
      yunmu: yunmu
    }); // 获取声调

    let shengdiao = [];

    for (let k in utils.shengdiao) {
      shengdiao.push(utils.shengdiao[k]);
    }

    shengdiao.unshift(shengdiao[shengdiao.length - 1]);
    shengdiao.pop();
    this.setData({
      shengdiao: shengdiao
    });
  },
  /**
   * 右上角分享事件
   */
  onShareAppMessage() {
    return {
      title: '条件查字',
      path: `/pages/component/condition/condition`,
      success: () => {
        uni.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        });
      },
      fail: () => {
        uni.showToast({
          title: '分享失败',
          icon: 'none',
          duration: 2000
        });
      }
    };
  },
  methods: {
    PickerChange(e) {
      this.setData({
        index: e.detail.value
      });
    },

    MultiChange(e) {
      this.setData({
        multiIndex: e.detail.value
      });
    },

    MultiColumnChange(e) {
      let data                         = {
        yunmu: this.yunmu,
        multiIndex: this.multiIndex
      };
      data.multiIndex[e.detail.column] = e.detail.value;

      switch (e.detail.column) {
        case 0:
          data.yunmu[1] = [];

          switch (data.multiIndex[0]) {
            case 0:
              for (let i = 0; i < utils.yunmu[0].children.length; i++) {
                data.yunmu[1].push(utils.yunmu[0].children[i].label);
              }

              break;

            case 1:
              for (let i = 0; i < utils.yunmu[1].children.length; i++) {
                data.yunmu[1].push(utils.yunmu[1].children[i].label);
              }

              break;

            case 2:
              for (let i = 0; i < utils.yunmu[2].children.length; i++) {
                data.yunmu[1].push(utils.yunmu[2].children[i].label);
              }

              break;

            case 3:
              for (let i = 0; i < utils.yunmu[3].children.length; i++) {
                data.yunmu[1].push(utils.yunmu[3].children[i].label);
              }

              break;
          }

          data.multiIndex[1] = 0;
          break;
      }

      this.setData(data);
    },

    PickerChange1(e) {
      this.setData({
        index1: e.detail.value
      });
    },

    getShengmu() {
      let shengmu = this.shengmu[this.index];

      for (let k in utils.shengmu) {
        if (utils.shengmu[k] == shengmu) {
          return k;
        }
      }
    },

    getYunmu() {
      for (let i = 0; i < utils.yunmu.length; i++) {
        if (utils.yunmu[i].label == this.yunmu[0][this.multiIndex[0]]) {
          for (let j = 0; j < utils.yunmu[i].children.length; j++) {
            if (utils.yunmu[i].children[j].label == this.yunmu[1][this.multiIndex[1]]) {
              return utils.yunmu[i].children[j].value;
            }
          }
        }
      }
    },

    getShengdiao() {
      let shengdiao = this.shengdiao[this.index1];

      for (let k in utils.shengdiao) {
        if (utils.shengdiao[k] == shengdiao) {
          return k;
        }
      }
    },

    searchByConditions() {
      // 获取声母、韵母和声调
      let shengmu   = this.getShengmu();
      let yunmu     = this.getYunmu();
      let shengdiao = this.getShengdiao();

      if (shengmu == 'all' && yunmu == 'all' && shengdiao == 'all') {
        let that = this;
        uni.showModal({
          content: '有超过500个可能拼音，过于宽泛！请再详细一些~',
          showCancel: false
        });
      } else {
        this.search(shengmu, yunmu, shengdiao);
      }
    },

    search(shengmu, yunmu, shengdiao) {
      if (shengmu == 'all') {
        shengmu = '';
      } else {
        shengmu = 'shengmu=' + shengmu;
      }

      if (yunmu == 'all') {
        yunmu = '';
      } else {
        yunmu = '&yunmu=' + yunmu;
      }

      if (shengdiao == 'all') {
        shengdiao = '';
      } else {
        shengdiao = '&shengdiao=' + shengdiao;
      }

      uni.showLoading(); // 发起条件检索

      let that = this;
      uni.request({
        url: app.globalData.server + 'characters/pinyin?' + shengmu + yunmu + shengdiao,
        method: 'GET',
        data: {},
        header: {
          'content-type': 'application/json'
        },

        success(res) {
          if (res.statusCode == 200) {
            if (res.data.result.length === 0) {
              uni.showToast({
                title: '检索结果为空',
                icon: none
              });
            } else {
              uni.hideLoading();
              console.log(res.data.result);
              that.setData({
                result: res.data.result
              });
            }
          } else {
            uni.showToast({
              title: '服务器错误'
            });
          }
        }
      });
    },

    getCharacter(e) {
      let id = e.currentTarget.dataset.id;
      uni.navigateTo({
        url: '/pages/basics/characters/characters?id=' + id
      });
    },

    getWord(e) {
      let id = e.currentTarget.dataset.id;
      if (!id) return
      uni.navigateTo({
        url: '/pages/basics/words/words?id=' + id
      });
    }
  }
};
</script>
<style></style>
