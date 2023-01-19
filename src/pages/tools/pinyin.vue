<template>
  <view>
    <!--导航栏-->
    <cu-custom title="拼音方案" />

    <view class="padding-sm">
      <view class="flex flex-wrap justify-around">
        <button
          v-for="(item, index) in list"
          :key="index"
          :class="
            'bg-' +
              item.color +
              ' text-lg cu-btn ' +
              (toggleDelay ? 'animation-slide-bottom' : '') +
              ' margin-sm basis-sm shadow'
          "
          :style="'animation-delay:' + (index + 1) * 0.1 + 's;'"
          :data-id="index"
          @tap="selectModel"
        >
          {{ item.desc }}
        </button>
      </view>
    </view>

    <view
      v-if="display[0]"
      class="intro bg-white"
    >
      <text
        :decode="true"
        class="indent"
      >
        本拼音方案基于莆仙话爱好者圈子使用的“国际音标转写”改造而成。
        为方便大众了解和学习，本拼音在声母上做了贴近普通话拼音的处理。
        韵母在之前的基础上，做了一些调整，使拼写更加简洁，不同口音中的近似音视作同一个音位，标法一致。
        同时增加了表示声调的符号。本拼音定名为“莆仙话拼音”。\n
      </text>
      <text
        :decode="true"
        class="indent"
      >
        莆仙话拼音可运用在学习、记录莆仙话词句，科普莆仙话正字，朗读古诗时体现韵脚，做莆仙话表情包，以及使用莆仙话输入方案。
        如今用普通话谐音字记录莆仙话的行为十分泛滥，谐音字不仅不雅观，还歪曲了莆仙话的发音。
        外地人依照“夸电喜”这样的发音，也无法学习到“看电视”（kuā-dèng-sĭ）准确的莆仙话发音。
        而了解了莆仙话拼音，有助力于掌握莆仙话整体发音。\n
      </text>
      <text
        :decode="true"
        class="indent"
      >
        下面介绍的拼音方案为莆田城里口音。想要了解更多其他口音的介绍请关注微信公众号「莆仙乡音社」(微信号：PhouSengUa)搜索“拼音教程”，
        或者观看b站拼音教程视频(up主@莆仙乡音社)。\n
      </text>
      <video
        style="margin-top: 15rpx; width: 100%"
        src="https://cos.edialect.top/files/video/6/2022/01/20/9PRuDXJRFiJNHhA.mp4"
      />
    </view>

    <view
      v-if="display[1]"
      class="padding bg-white"
    >
      <view class="flex margin-bottom-sm text-center solid-bottom solid-top">
        <view class="flex-sub padding-sm margin-xs">
          拼音
        </view>
        <view class="flex-sub padding-sm margin-xs">
          IPA
        </view>
        <view class="flex-five padding-sm margin-xs">
          例字
        </view>
        <view class="flex-sub padding-sm margin-xs">
          音频
        </view>
      </view>
      <view
        v-for="(item, index) in shengmu"
        :key="index"
        class="flex margin-bottom-sm text-center solid-bottom"
      >
        <view class="flex-sub padding-sm margin-xs">
          {{ item.pinyin }}
        </view>

        <view class="flex-sub padding-sm margin-xs">
          {{ item.IPA }}
        </view>

        <view class="flex-five padding-sm margin-xs">
          {{ item.example }}
        </view>

        <view
          class="flex-sub padding-sm margin-xs"
          :data-id="index"
          @tap="playShengmu"
        >
          <text class="text-blue cuIcon-notificationfill" />
        </view>
      </view>
    </view>

    <scroll-view
      v-if="display[2]"
      scroll-x
      class="bg-white nav text-center"
    >
      <view
        v-for="(item, index) in list1"
        :key="index"
        :class="'cu-item ' + (index == TabCur ? 'text-blue cur' : '')"
        :data-id="index"
        @tap="tabSelect"
      >
        {{ item }}
      </view>
    </scroll-view>
    <view
      v-if="display[2]"
      class="padding bg-white"
    >
      <view class="flex margin-bottom-sm text-center solid-bottom solid-top">
        <view class="flex-sub padding-sm margin-xs">
          拼音
        </view>
        <view class="flex-sub padding-sm margin-xs">
          IPA
        </view>
        <view class="flex-five padding-sm margin-xs">
          例字
        </view>
        <view class="flex-sub padding-sm margin-xs">
          音频
        </view>
      </view>
      <view
        v-for="(item, index) in yunmu[TabCur]"
        :key="index"
        class="flex margin-bottom-sm text-center solid-bottom"
      >
        <view class="flex-sub padding-sm margin-xs">
          {{ item.pinyin }}
        </view>

        <view class="flex-sub padding-sm margin-xs">
          {{ item.IPA }}
        </view>

        <view class="flex-five padding-sm margin-xs">
          {{ item.example }}
        </view>

        <view
          class="flex-sub padding-sm margin-xs"
          :data-id="index"
          @tap="playYunmu"
        >
          <text class="text-blue cuIcon-notificationfill" />
        </view>
      </view>
    </view>

    <view
      v-if="display[3]"
      class="padding bg-white"
    >
      <text
        :decode="true"
        class="indent"
      >
        声调可以采用调符和调号两种方法表示。调符是使用符号表示每种声调的起伏，调号则是以数字表示对应的调类。
        调值是语言学上常用的标记，「五度标记法」，1到5个数字表示声调的相对音高，1是最低，5是最高，可以用音阶的do re mi fa
        sol来理解。
        另外莆仙话还有一个用在代词的声调，并且伴有喉塞音，这里把它标记成第三调，如「我」guoh3/guôh，「这」zeh3/zêh。\n\n
      </text>
      <view class="flex margin-bottom-sm text-center solid-bottom solid-top">
        <view class="flex-sub padding-sm margin-xs">
          调类
        </view>
        <view class="flex-twice padding-sm margin-xs">
          调值/调符
        </view>
        <view class="flex-twice padding-sm margin-xs">
          例字/调号
        </view>
        <view class="flex-sub padding-sm margin-xs">
          音频
        </view>
      </view>
      <view
        v-for="(item, index) in tone"
        :key="index"
        class="flex margin-bottom-sm text-center solid-bottom"
      >
        <view class="flex-sub padding-sm margin-xs">
          {{ item.type }}
        </view>

        <view class="flex-twice padding-sm margin-xs">
          {{ item.tone }}
        </view>

        <view class="flex-twice padding-sm margin-xs">
          {{ item.example }}
        </view>

        <view
          class="flex-sub padding-sm margin-xs"
          :data-id="index"
          @tap="playTone"
        >
          <text class="text-blue cuIcon-notificationfill" />
        </view>
      </view>
    </view>

    <view class="stand-view" />
  </view>
</template>

<script>
import utils from '@/const/pinyin';

const app = getApp();

export default {
  data() {
    return {
      StatusBar: app.globalData.StatusBar,
      CustomBar: app.globalData.CustomBar,
      display: [true, false, false, false],
      toggleDelay: true,
      TabCur: 0,
      list: [
        {
          color: 'red',
          desc: '介绍',
        },
        {
          color: 'orange',
          desc: '声母',
        },
        {
          color: 'cyan',
          desc: '韵母',
        },
        {
          color: 'blue',
          desc: '声调',
        },
      ],
      list1: ['开尾韵', '鼻尾韵', '塞尾韵'],
      shengmu: utils.shengmu,
      yunmu: [utils.kai, utils.bi, utils.se],
      tone: utils.tone,
    };
  },
  onLoad() {
    const that = this;
    setTimeout(() => {
      that.setData({
        toggleDelay: false,
      });
    }, 1000); // 创建播放器

    this.innerAudioContext = uni.createInnerAudioContext();
  },

  /**
   * 右上角分享事件
   */
  onShareAppMessage() {
    return {
      title: '拼音方案',
      path: '/pages/tools/pinyin',
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
    selectModel(e) {
      const index = e.currentTarget.dataset.id;
      const display = [false, false, false, false];
      display[index] = true;
      this.display = [...display];
    },

    playShengmu(e) {
      const index = e.currentTarget.dataset.id;
      const src = `https://cos.edialect.top/pinyin/example/${
        this.shengmu[index].pinyin
      }.mp3`;
      this.innerAudioContext.src = src;
      this.innerAudioContext.play();
    },

    tabSelect(e) {
      this.TabCur = e.currentTarget.dataset.id;
    },

    playYunmu(e) {
      const index1 = this.TabCur;
      const index2 = e.currentTarget.dataset.id;
      const src = `https://cos.edialect.top/pinyin/example/${
        this.yunmu[index1][index2].pinyin
      }.mp3`;
      this.innerAudioContext.src = src;
      this.innerAudioContext.play();
    },

    playTone(e) {
      const index = e.currentTarget.dataset.id;
      const src = `https://cos.edialect.top/pinyin/example/${
        this.tone[index].type
      }.mp3`;
      this.innerAudioContext.src = src;
      this.innerAudioContext.play();
    },
  },
};
</script>
<style>
@import "@/colorui/animation.css";

page {
  background-color: white;
}

.intro {
  margin: 28rpx;
  font-size: 30rpx;
}

.indent {
  text-indent: 2em;
  display: block;
}
</style>
