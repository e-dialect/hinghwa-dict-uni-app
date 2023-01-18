<template>
  <view>
    <cu-custom title="语记·排行榜" />
    <view class="cu-card dynamic">
      <view class="cu-item padding">
        <view class="margin">
          <text class="text-xl text-bold text-black">
            录音贡献排行榜
          </text>
          <text class="indent text-content block margin-top-sm">
            兴化语记的发展离不开每一位用户的支持，让我们一起来看看哪些用户为我们倾情贡献了语音吧~
          </text>
        </view>
        <!--完整榜单-->
        <view>
          <view class="title flex">
            <view
              :class="rankingStatus === 0 ? 'w_after' : 'w_active'"
              @click="rankingTabs(0);changeRank(7)"
            >
              周榜
            </view>
            <view
              :class="rankingStatus === 1 ? 'w_after' : 'w_active'"
              @click="rankingTabs(1);changeRank(30)"
            >
              月榜
            </view>
            <view
              :class="rankingStatus === 2 ? 'w_after' : 'w_active'"
              @click="rankingTabs(2);changeRank(0)"
            >
              总榜
            </view>
          </view>
          <view style="height: 100%;margin-bottom: 30upx">
            <view
              class="bg-cyan solid card -gray margin-xs"
              style="border-radius: 35upx"
            >
              <view class="th">
                <block
                  v-for="(itemM,indexM) in menu"
                  :key="indexM"
                >
                  <text
                    class="text-lg text-bold"
                    :class="indexM === 1 ? 'td-view' : 'td-text'"
                  >
                    {{ itemM }}
                  </text>
                </block>
              </view>
              <block
                v-for="(itemD,indexD) in rankList"
                :key="indexD"
              >
                <view class="td">
                  <text
                    v-if="indexD===0"
                    class="num num1"
                  >
                    {{ indexD + 1 }}
                  </text>
                  <text
                    v-else-if="indexD===1"
                    class="num num2"
                  >
                    {{ indexD + 1 }}
                  </text>
                  <text
                    v-else-if="indexD===2"
                    class="num num3"
                  >
                    {{ indexD + 1 }}
                  </text>
                  <text
                    v-else
                    class="num"
                  >
                    {{ indexD + 1 }}
                  </text>
                  <view
                    class="td-view"
                    @tap="toUserPage(itemD.contributor.id)"
                  >
                    <image
                      class="cu-avatar round margin-right-sm"
                      :src="itemD.contributor.avatar"
                      mode="aspectFill"
                    />
                    <text>{{ itemD.contributor.nickname }}</text>
                  </view>
                  <text class="td-text">
                    {{ itemD.amount }}
                  </text>
                </view>
              </block>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getPronunciationRanking } from '@/services/pronunciation';
import { toUserPage } from '@/routers/user';

export default {
  name: 'RankList',
  data() {
    return {
      toUserPage,
      menu: ['排名', '用户', '语音数'],
      rankList: [],
      rankingStatus: 0, // 标记榜单选中
      rankingCurrent: 0, // 标记榜单切换
    };
  },
  onLoad() {
    this.changeRank(7);
  },
  methods: {
    changeRank(day) {
      getPronunciationRanking(day).then(async (res) => {
        this.rankList = res.ranking;
      });
    },

    rankingTabs(index) {
      this.rankingStatus = index;
      this.rankingCurrent = index;
    },
  },
};
</script>

<style scoped>
.indent{
  text-indent: 2em;
  display: block;
}

.title {
  width: 530rpx;
  height: 78rpx;
  background: #FFFFFF;
  margin: auto;
  justify-content: space-between;
  margin-top: 47rpx;
  color: #7F7F7F;
  font-size: 30rpx;
  font-weight: bold;
  text-align: center;
}

.w_after {
  color: #212121;
}

.w_after::after {
  content: ' ';
  display: block;
  width: 28rpx;
  height: 6rpx;
  background: #FEA100;
  border-radius: 3rpx;
  margin: auto;
}

.card {
  background-color: #ffffff;
  border-radius: 20rpx;
  margin-right: 1vw;
}

.th {
  border-radius: 20rpx 20rpx 0rpx 0rpx;
  height: 80rpx;
  background: #F4F6FF;
  color: #333333;
  display: flex;
  align-items: center;
  padding-left: 15rpx;
  padding-right: 60rpx;
}

.td {
  height: 120rpx;
  font-size: 24rpx;
  font-weight: 500;
  color: #333333;
  display: flex;
  align-items: center;
  white-space: nowrap;
  margin: 0 30rpx;
  border-bottom: 1px solid #eee;
  border-width: thin;
}

.td-view{
  width: 60%;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.td-text{
  width: 20%;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.num {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  width: 15%;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.num1 {
  color: #F12C03;
}

.num2 {
  color: #F8780D;
}

.num3 {
  color: #2B87FF;
}
</style>
