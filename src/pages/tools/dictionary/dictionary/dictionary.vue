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
        <text class="text-content block text-bold margin-top-sm">
          兴化语记作为在线工具同样提供词语查询功能
        </text>
        <text class="text-content block">
          在输入框中输入词语，点击查询即可
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
        >
          <view
            class="bg-blue"
            @close="prefix=''"
          >
            {{ prefix.toUpperCase() }}
          </view>
        </view>
      </view>
      <!--显示查询词语-->
      <WordListShowing
        v-if="words.length"
        :word-list="words"
        class="cu-item padding-xs"
      />
      <!--显示拼音区域-->
      <view
        v-show="nextNodeList.length && words.length"
        class="cu-item padding-xs"
      >
        <view
          v-for="(list, index) in nextNodeList"
          :key="index"
        >
          <view :key="list[0]">
            <view
              class="margin-sm bg-blue round text-bold"
              style="padding-left: 30upx;padding-top: 18upx;font-size: 28upx; height: 64upx"
              @click="prefix=list[0]"
            >
              {{ String(list[0]).toUpperCase() }}
            </view>
            <view
              v-for="(pinyin, index1) in list[1]"
              :key="index1"
              class="cu-btn margin-sm radius"
            >
              <view
                :key="pinyin"
                @click="pushPinyin(pinyin)"
              >
                {{ pinyin }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getPhoneticOrder, searchDictionary } from '@/services/word';
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
        if (i === 'has_word') continue;
        if (i[0] in ans) {
          ans[i[0]] = [...ans[i[0]], i];
        } else {
          ans[i[0]] = [i];
        }
      }
      // sort ans
      for (const i in ans) {
        ans[i].sort();
      }
      // convert to array
      const ansArray = [];
      for (const i in ans) {
        ansArray.push([i, ans[i]]);
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
    },
    prefix: {
      handler(newPrefix) {
        searchDictionary(this.order, newPrefix, true).then((res) => {
          this.words = res;
        });
      },
    },
  },
  async created() {
    this.fullRecord = await getPhoneticOrder();
    this.record = { ...this.fullRecord };
  },
  methods: {
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

</style>
