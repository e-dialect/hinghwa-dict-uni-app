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
        range-key="text"
        @change="changeShengmu"
      >
        <view class="picker">
          {{ shengmu[shengmuIndex].text }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group">
      <view class="title">
        韵母
      </view>
      <uni-data-picker
        v-model="yunmuValue"
        :localdata="yunmu"
        popup-title="请选择韵母"
        :map="{text:'label',value:'value'}"
      />
    </view>
    <view class="cu-form-group">
      <view class="title">
        声调
      </view>
      <picker
        :value="shengdiaoIndex"
        :range="shengdiao"
        range-key="text"
        @change="changeShengdiao"
      >
        <view class="picker">
          {{ shengdiao[shengdiaoIndex].text }}
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

    <!--搜索结果-->
    <view
      v-for="(item, resultIndex) in result"
      :key="resultIndex"
      class="padding bg-white solid-bottom"
    >
      <!-- 拼音 -->
      <view class="flex align-center">
        <text class="text-bold text-xxl text-black">
          {{ item.pinyin }}
        </text>
        <WordPronunciationButton :pinyin="item.pinyin" />
      </view>

      <!-- 内容 -->
      <uni-row>
        <uni-col
          v-for="(char, charIndex) in item.characters"
          :key="charIndex"
          :span="char.character.length>2?12:6"
          @tap="toWord(char.word)"
        >
          <view>
            <text
              :class="'text-xxl ' + (char.word ? 'text-blue' : 'text-black')"
              space="emsp"
            >
              {{ char.character }}
            </text>

            <text
              v-if="char.traditional !== char.character"
              class="text-xl"
              space="emsp"
            >
              {{ char.traditional }}
            </text>
          </view>
        </uni-col>
      </uni-row>
    </view>
    <view v-if="!result.length">
      <view class="cu-bar bg-white solid-bottom">
        <view class="action">
          <text class="text-grey">
            没有搜到符合条件的字~
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { searchCharactersByFilters } from '@/services/character';
import { defaultMessage } from '@/services/shareMessages';
import { toWordPage } from '@/routers/word';
import utils from '@/const/sheng-yun-diao';
import WordPronunciationButton from '@/components/WordPronunciationButton.vue';

export default {
  components: { WordPronunciationButton },
  data() {
    return {
      shengmuIndex: 0,
      shengmu: [],
      yunmu: utils.yunmu,
      yunmuValue: 'all',
      shengdiaoIndex: 7,
      shengdiao: [],
      result: [],
      space: ' ',
    };
  },
  onLoad(options) {
    // 声母
    const shengmu = [];
    for (const k in utils.shengmu) {
      if ({}.hasOwnProperty.call(utils.shengmu, k)) {
        shengmu.push({
          value: k,
          text: utils.shengmu[k],
        });
      }
    }
    this.shengmu = [...shengmu];
    for (let i = 0; i < this.shengmu.length; i += 1) {
      if (this.shengmu[i].value === options.shengmu) {
        this.shengmuIndex = i;
        break;
      }
    }

    // 声调
    const shengdiao = [];
    for (const k in utils.shengdiao) {
      if ({}.hasOwnProperty.call(utils.shengdiao, k)) {
        shengdiao.push({
          value: k,
          text: utils.shengdiao[k],
        });
      }
    }
    this.shengdiao = [...shengdiao];
    for (let i = 0; i < this.shengdiao.length; i += 1) {
      if (this.shengdiao[i].value === options.shengdiao) {
        this.shengdiaoIndex = i;
        break;
      }
    }

    // 韵母
    if (options.yunmu) {
      // check if options.yunmu is valid
      for (let i = 0; i < this.yunmu.length; i += 1) {
        if (this.yunmuValue !== 'all') break;
        if (this.yunmu[i].value === options.yunmu) {
          this.yunmuValue = options.yunmu;
          break;
        }
        if (this.yunmu[i].children) {
          for (let j = 0; j < this.yunmu[i].children.length; j += 1) {
            if (this.yunmu[i].children[j].value === options.yunmu) {
              this.yunmuValue = options.yunmu;
              break;
            }
          }
        }
      }
    }

    if (this.shengmuValue !== 'all' || this.yunmuValue !== 'all' || this.shengdiaoValue !== 'all') {
      this.searchByConditions();
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
  computed: {
    shengmuValue() {
      return this.shengmu[this.shengmuIndex].value;
    },
    shengdiaoValue() {
      return this.shengdiao[this.shengdiaoIndex].value;
    },
  },
  methods: {

    searchByConditions() {
      // 获取声母、韵母和声调
      const shengmu = this.shengmuValue;
      const yunmu = this.yunmuValue;
      const shengdiao = this.shengdiaoValue;

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

    toWord(id) {
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
