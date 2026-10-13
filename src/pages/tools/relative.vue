<template>
  <view>
    <cu-custom title="亲戚计算" />

    <view class="cu-card dynamic">
      <!--选择亲戚区域-->
      <view class="cu-item padding-left-xs">
        <view class="cu-btn bg-orange round margin-sm fl">
          <text>
            己身
          </text>
        </view>
        <view
          v-for="(item, index1) in selected"
          :key="index1"
          class="margin-sm fl"
          style="margin-right: 0"
        >
          <text class="text-sm">
            的
          </text>
          <text class="cu-btn round margin-left-xs">
            {{ item }}
          </text>
        </view>
        <view
          v-if="top.note"
          class="text-gray padding-sm"
        >
          {{ top.note }}
        </view>
      </view>
      <!--选择亲戚按钮-->
      <view class="cu-item padding-left-xs">
        <view>
          <view
            v-for="item in buttons"
            :key="item.name"
            :disabled="topLength > 1 || !top.relations[item.filed]"
            class="cu-btn bg-blue round margin-sm fl"
            style="margin: 5px"
            @click="pushRelative(item.filed)"
          >
            {{ item.name }}
          </view>
          <view
            :disabled="stack.length === 1"
            class="fl"
            @click="popRelative()"
          >
            <text class="cu-btn bg-gray round margin-sm cuIcon-back_android" />
          </view>
          <view
            class="cu-btn bg-gray round margin-sm fl"
            @click="clear()"
          >
            AC
          </view>
        </view>
      </view>

      <!--显示结果区域-->
      <view class="cu-item padding-xs">
        <view v-if="topLength > 1">
          <h2>你要找的是：</h2>
          <view
            v-for="(item, index) in stack[stack.length - 1]"
            :key="index"
            class="text-lg"
            style="margin: 12px"
            @click="choose(item.name)"
          >
            {{ item.name }}
          </view>
        </view>
        <view v-else>
          <WordListShowing
            v-if="words.length"
            :word-list="words"
            class="cu-item"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {
  buttons, fieldName, find, relative,
} from '@/services/relative';
import WordListShowing from '@/components/WordListShowing.vue';
import { defaultMessage } from '@/services/shareMessages';
import { getWordDetails } from '../../services/word';
import loadRelativeWords from '../../services/relativeWords';

export default {
  components: {
    WordListShowing,
  },
  data() {
    return {
      stack: [[relative[0]]],
      select: [],
      words: [],
      wordRequest: 0,
    };
  },
  onShareAppMessage() {
    return {
      title: '语记·亲戚计算',
      path: '/pages/tools/relative',
      ...defaultMessage(),
    };
  },
  computed: {
    relations() {
      return relative;
    },
    buttons() {
      return buttons;
    },
    top() {
      return this.stack[this.stack.length - 1][0];
    },
    topLength() {
      return this.stack[this.stack.length - 1].length;
    },
    selected() {
      const ans = [];
      this.select.forEach((item) => {
        if (item) { ans.push(item); }
      });
      return ans;
    },
  },
  watch: {
    top: {
      immediate: true,
      async handler(value) {
        const request = this.wordRequest + 1;
        this.wordRequest = request;
        this.words = [];
        const ans = await loadRelativeWords(value.words, async (id) => {
          const word = await getWordDetails(id);
          return { ...word, id, url: word.source };
        });
        if (request === this.wordRequest) this.words = ans;
      },
    },

  },
  onUnload() {
    this.wordRequest += 1;
  },
  methods: {
    pushRelative(field) {
      if (this.stack.length > 15) {
        uni.showModal({
          content: '关系层数太多了，可以考虑简化一下无效信息？',
          showCancel: false,
        });
        return false;
      }

      if (this.topLength !== 1 || !this.top.relations[field]) { return false; }
      const ans = [];
      if (typeof this.top.relations[field] !== 'string') {
        Object.keys(this.top.relations[field]).forEach((i) => {
          if (this.top.relations[field]) { ans.push(find(this.top.relations[field][i])); }
        });
      } else {
        ans.push(find(this.top.relations[field]));
      }
      this.select.push(fieldName[field]);
      this.stack.push(ans);
      return true;
    },

    choose(name) {
      this.stack.push([find(name)]);
      this.select.push(null);
    },

    popRelative() {
      if (this.stack.length === 1) return;
      this.select.pop();
      this.stack.pop();
    },

    clear() {
      this.stack = [[relative[0]]];
      this.select = [];
    },
  },
};

</script>

<style scoped></style>
