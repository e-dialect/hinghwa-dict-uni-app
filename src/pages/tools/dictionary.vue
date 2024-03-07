<template>
  <view>
    <cu-custom title="语记·词典" />
    <view class="cu-card dynamic">
      <view class="cu-item padding">
        <view class="cu-bar">
          <view class="action sub-title">
            <text class="text-xl text-bold text-blue">
              音序查词
            </text>
            <text class="text-ABC text-blue">
              Dictionary
            </text>
          </view>
        </view>
        <text class="text-content block margin-top-sm">
          点击莆拼筛选以该拼音开头的词语
        </text>
        <text class="text-content block">
          点击字母筛选全部以该字母开头的拼音
        </text>
      </view>
      <!--选择拼音区域-->
      <view
        v-show="order.length || prefix"
        class="cu-item padding-left-xs"
      >
        <view
          v-for="(pinyin,index) in order"
          :key="index"
          class="cu-btn round margin-sm"
        >
          <view>{{ pinyin }}</view>
          <view
            class="cuIcon-close margin-left-xs"
            @tap="popPinyin(index)"
          />
        </view>
        <view
          v-if="prefix"
          key="prefix"
          class="cu-btn bg-blue round margin-sm"
        >
          <view>
            {{ prefix.toUpperCase() }}
          </view>
          <view
            class="cuIcon-close"
            @tap="prefix=''"
          />
        </view>
      </view>
      <!--显示拼音区域-->
      <view class="cu-item">
        <view
          v-for="(list, index) in nextNodeList"
          :key="index"
        >
          <view
            v-if="!prefix||list[0]===prefix"
            :key="list[0]"
          >
            <view
              class="margin-sm bg-blue round text-bold"
              style="padding-left: 15px;padding-top: 8px;padding-bottom: 8px"
              @click="prefix=list[0]"
            >
              {{ String(list[0]).toUpperCase() }}
            </view>
            <view
              class="pinyin margin-left"
              :class="{active:flag}"
            >
              <view
                v-for="(pinyin, index1) in list[1]"
                v-show="flag[index]?true:index1 < 7"
                :key="index1"
                class="cu-btn radius margin-sm"
                style="width: 18%;"
              >
                <view
                  :key="pinyin"
                  @click="pushPinyin(pinyin)"
                >
                  {{ pinyin }}
                </view>
              </view>
              <view
                v-if="list[1].length >= 7"
                class="show cu-btn margin-sm radius text-blue"
                style="width: 18%"
                @click="showTag(index)"
              >
                {{ flag[index]?"收起":"展开" }}
              </view>
            </view>
          </view>
        </view>
      </view>
      <!--显示查询词语-->
      <WordListShowing
        v-if="words.length"
        :word-list="words"
        class="cu-item padding-xs"
      />
    </view>
  </view>
</template>

<script>
import { getPhoneticOrder, searchDictionary } from '@/services/word';
import { defaultMessage } from '@/services/shareMessages';
import WordListShowing from '@/components/WordListShowing.vue';

export default {
  components: {
    WordListShowing,
  },
  data() {
    return {
      fullRecord: {},
      record: {},
      order: [],
      words: [],
      prefix: '',
      flag: [].fill(false),
    };
  },
  onShareAppMessage() {
    return {
      title: '语记·词典',
      path: '/pages/tools/dictionary',
      ...defaultMessage(),
    };
  },
  computed: {
    /**
     * a-z 顺序返回可以继续选择的拼音
     * @returns {*[string,string[]]} 首字母和拼音列表
     */
    nextNodeList() {
      const { record } = this;
      const ans = {};
      for (const i in record) {
        if (i === 'word_count') continue;
        if (i[0] in ans) {
          ans[i[0]] = [...ans[i[0]], i];
        } else {
          ans[i[0]] = [i];
        }
      }
      // sort ans
      for (const i in ans) {
        if ({}.hasOwnProperty.call(ans, i)) {
          ans[i].sort();
        }
      }
      // convert to array
      const ansArray = [];
      for (const i in ans) {
        if ({}.hasOwnProperty.call(ans, i)) {
          ansArray.push([i, ans[i]]);
        }
      }
      ansArray.sort();
      return ansArray;
    },
  },
  watch: {
    order: {
      handler(newOrder) {
        if (!newOrder.length) {
          this.words = [];
          return;
        }
        searchDictionary(newOrder, '', true).then((res) => {
          this.words = res;
        });
      },
      deep: true,
    },
    prefix: {
      handler(newPrefix) {
        searchDictionary(this.order, newPrefix, true).then((res) => {
          this.words = res;
        });
      },
      deep: true,
    },
  },
  async created() {
    this.fullRecord = await getPhoneticOrder();
    this.record = { ...this.fullRecord };
  },
  methods: {
    showTag(index) {
      this.flag[index] = !this.flag[index];
      this.flag = [...this.flag];
    },
    /**
     * 新选中拼音
     * @param pinyin{string} 拼音
     */
    pushPinyin(pinyin) {
      this.order.push(pinyin);
      this.record = this.record[pinyin];
      this.prefix = '';
    },
    /**
     * 回退拼音列表
     * @param index{number} 回退到的位置
     */
    popPinyin(index) {
      this.order.splice(index);
      let record = this.fullRecord;
      for (const i of this.order) {
        record = record[i];
      }
      this.record = record;
      this.prefix = '';
    },
  },
};
</script>
<style scoped>
/* 初始高度，超出隐藏 */
.pinyin{
  overflow: hidden;
  line-height: 70rpx;
  border-bottom: 1px dashed #E8E7E7;
}
/*  高度自适应，全部显示 */
.active{
  height: auto;
  overflow: visible;
}
</style>
