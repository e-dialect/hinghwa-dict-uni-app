<template>
  <view>
    <cu-custom title="语记·试卷" />
    <view
      id="top-box"
      class="cu-bar bg-white solid-bottom card shadow -gray margin-top margin-xs"
    >
      <progress
        class="margin-left"
        style="width: 50%"
        font-size="24rpx"
        :percent="percent"
        show-info
        active
        activeColor="#ace0f9"
        active-mode="forwards"
        border-radius="25rpx"
      />
      <view class="action margin-left">
        <button
          class="cu-btn bg-blue shadow"
          data-target="modalCard"
          @tap="showCardModal"
        >
          答题卡
        </button>
      </view>
      <view class="action margin-left">
        <button
          class="cu-btn bg-blue shadow"
          data-target="modalCard"
          @tap="submit"
        >
          提交
        </button>
      </view>
    </view>
    <!--答题卡-->
    <view
      class="cu-modal"
      :class="showModalCard?'show':''"
      @tap="hideCardModal"
    >
      <view
        class="cu-dialog"
        style="border-radius: 20upx"
        @tap.stop
      >
        <view class="cu-bar solid-bottom">
          <view class="action">
            <text class="cuIcon-title">
              答题卡
            </text>
          </view>
        </view>
        <view class="grid col-5 ">
          <view
            v-for="index in Array(subjectList.length).keys()"
            :key="index"
            class="margin-tb-sm text-center"
          >
            <button
              class="cu-btn round"
              :class="current[index]===99?'line-grey':'bg-blue'"
              @click="appointedSubject(index)"
            >
              {{ index + 1 }}
            </button>
          </view>
        </view>
      </view>
    </view>
    <!--试题-->
    <form>
      <swiper
        :current="subjectIndex"
        :style="{'height':swiperHeight}"
        class="swiper-box margin"
        @change="swiperChange"
      >
        <swiper-item
          v-for="(subject,index1) in subjectList"
          :key="index1"
        >
          <view
            class="bg-cyan solid-bottom card shadow -gray margin-xs"
            style="border-radius: 35upx"
          >
            <!--题目-->
            <view
              class="cu-bar bg-white solid-bottom padding"
              style="border-radius: 35upx"
            >
              <view class="action">
                <text class="text-blue cuIcon-title">
                  {{ index1 + 1 }}.{{ subject.question }}
                </text>
              </view>
            </view>
            <!--选项-->
            <view>
              <radio-group
                class="block padding"
                @change="radioChange"
              >
                <label
                  v-for="(option,index2) in subject.options"
                  :key="index2"
                  class="cu-form-group"
                >
                  <radio
                    :value="index2.toString()"
                    :checked="index2 === current[index1]"
                  />
                  <view class="title text-black">
                    {{ String.fromCharCode(index2 + 65) }}.{{ option }}
                  </view>
                </label>
              </radio-group>
            </view>
            <!--解析-->
            <view
              v-show="showAnswer[index1] === 1"
              class="margin-top solid-top"
            >
              <view class="cu-bar">
                <view class="action text-grey">
                  <text>正确答案：</text>
                  <text class="padding-left text-blue">
                    {{ String.fromCharCode(subject.answer + 65) }}
                  </text>
                </view>
              </view>
              <view class="cu-bar cu-bar-title">
                <view class="action text-grey">
                  <text>解析：</text>
                </view>
              </view>
              <view class="text-content padding  text-grey">
                {{ subject.explanation }}
              </view>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </form>
    <!--底部栏-->
    <view
      id="foot-box"
      class="cu-bar tabbar bg-white shadow foot"
    >
      <!--播放音频-->
      <view
        v-if="subjectIndex>=0&&subjectList[subjectIndex].voice_source"
        class="action"
        @tap="play(subjectList[subjectIndex].voice_source)"
      >
        <view class="cuIcon-cu-image">
          <text class="lg text-gray cuIcon-notification" />
        </view>
        <view class="text-gray">
          播放题目
        </view>
      </view>
      <view
        class="action"
        @click="moveSubject(-1)"
      >
        <view class="cuIcon-cu-image">
          <text class="lg cuIcon-back text-gray" />
        </view>
        <view class="text-gray">
          上一题
        </view>
      </view>
      <view
        class="action"
        @click="moveSubject(1)"
      >
        <view class="cuIcon-cu-image">
          <text class="lg text-gray cuIcon-right" />
        </view>
        <view class="text-gray">
          下一题
        </view>
      </view>
      <view
        class="action"
        @click="showAnswerChange"
      >
        <view class="cuIcon-cu-image">
          <text class="lg text-gray cuIcon-question" />
        </view>
        <view class="text-gray">
          解答
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getTestPaper } from '@/services/quiz';
import { playAudio } from '@/utils/audio';
import { toPosterPage } from '@/routers/quiz';
import CuCustom from '@/colorui/components/cu-custom.vue';

const app = getApp();

export default {
  components: { CuCustom },
  data() {
    return {
      toPosterPage,
      percent: 0,
      current: [], // 选中的选项
      showAnswer: [],
      rightAnswer: [],
      subjectIndex: -1, // 跳转索引
      swiperHeight: '800px',
      subjectList: [],
      showModalCard: false, // 显示答题卡
      totalScore: 0,
    };
  },
  /*  onReady() {
      let tempHeight = 800;
      uni.getSystemInfo({
        success: (res) => {
          tempHeight = res.windowHeight;
          uni.createSelectorQuery().select("#top-box").fields({
            size: true,
            scrollOffset: true
          }, (data) => {
              tempHeight -= data.height;  //减去顶部元素高度
            uni.createSelectorQuery().select("#foot-box").fields({
              size: true,
              scrollOffset: true
            }, (data) => {
               tempHeight -= data.height;  //减去底部元素高度
               this.swiperHeight = tempHeight + 'px';
            }).exec();
          }).exec();
        }
      }); // swiper高度自适应
    }, */
  onLoad() {
    this.getTest();
    uni.getSystemInfo({
      success: (res) => {
        this.swiperHeight = `${res.windowHeight}px`;
      },
    });

    // // select中的参数就如css选择器一样选择元素
    // const info = uni.createSelectorQuery().in(this).select('#swiper-view');
    // info.boundingClientRect(function (data) {
    //   // data - 包含元素的高度等信息
    //   console.log(data.height); // 获取元素宽度
    //   this.swiperHeight = data.height;
    // }).exec((res) => {
    //   // 注意：exec方法必须执行，即便什么也不做不会获取到任何数据
    // });
  },
  methods: {
    /**
     * 获取测试题列表
     * @returns {Promise<void>}
     */
    async getTest() {
      const res = await getTestPaper(20);
      this.subjectList = res.paper;
      for (let i = 0; i < 20; i += 1) {
        this.current[i] = 99;
        this.showAnswer[i] = 0;
        this.rightAnswer[i] = res.paper[i].answer;
      }
      this.subjectList = [...this.subjectList];
      this.subjectIndex = 0;
    },

    /**
     * 显示答题卡
     */
    showCardModal() {
      this.showModalCard = true;
    },

    /**
     * 隐藏答题卡
     */
    hideCardModal() {
      this.showModalCard = false;
    },

    /**
     * 滑动事件
     */
    swiperChange(e) {
      this.subjectIndex = Number(e.target.current);
    },

    /**
     * 点击提交按钮
     */
    submit() {
      this.totalScore = 0;
      uni.showModal({
        title: '提交',
        content: '确定要提交吗？',
        success: (res) => {
          if (res.confirm) {
            for (let i = 0; i < 20; i += 1) {
              if (this.current[i] === this.rightAnswer[i]) {
                this.totalScore += 5;
              }
            }
            this.toPosterPage(this.totalScore);
          }
        },
      });
    },

    /**
     * 设置进度条进度
     */
    setProgress() {
      this.percent = 0;
      for (let i = 0; i < 20; i += 1) {
        if (this.current[i] !== 99) this.percent += 5;
      }
    },

    /**
     * 单选选中
     */
    radioChange(e) {
      this.current[this.subjectIndex] = Number(e.detail.value);
      this.setProgress();
    },

    /**
     * 播放语音
     */
    play(url) {
      playAudio(url);
    },

    /**
     * 显示/隐藏答案
     */
    showAnswerChange() {
      if (this.showAnswer[this.subjectIndex] === 0) {
        this.showAnswer[this.subjectIndex] = 1;
      } else {
        this.showAnswer[this.subjectIndex] = 0;
      }
      this.showAnswer = [...this.showAnswer];
    },

    /**
     * 切换题目
     */
    moveSubject(count) {
      if (count === -1 && this.subjectIndex !== 0) {
        this.subjectIndex -= 1;
      }
      if (count === 1 && this.subjectIndex < 19) {
        this.subjectIndex += 1;
      }
    },

    /**
     * 题卡指定
     */
    appointedSubject(count) {
      this.showModalCard = null;
      this.subjectIndex = count;
    },
  },
};
</script>

<style>
page {
  background-color: #f0f0f0;
}

.card {
  background-color: #ffffff;
  border-radius: 20rpx;
  margin-right: 1vw;
}

.cu-form-group {
  justify-content: flex-start
}

.cu-form-group .title {
  padding-left: 30upx;
  padding-right: 0upx;
}

.cu-form-group + .cu-form-group {
  border-top: none;
}

.cu-bar-title {
  min-height: 50upx;
}
</style>
