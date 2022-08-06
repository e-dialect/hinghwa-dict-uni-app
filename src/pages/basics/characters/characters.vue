<template>
  <view>
    <cu-custom
      bg-color="bg-white"
      :is-back="true"
    />
    <!-- <view class="logo">
  <image src="/images/logo.png" mode="aspectFill"></image>
</view> -->
    <view class="flex padding solid-bottom">
      <view class="text-bold text-xxlp">
        {{ character.character }}
      </view>
      <!-- <view class="text-lg text-blue margin-left margin-top">
    <text class="cuIcon-notificationfill"></text>
  </view> -->
    </view>
    <view class="cu-form-group padding padding-right-xl">
      <view class="title">
        拼音
      </view>
      <view class="text-grey">
        {{ character.pinyin }}
      </view>
    </view>
    <view class="cu-form-group padding padding-right-xl">
      <view class="title">
        国际音标
      </view>
      <view class="text-grey">
        {{ character.ipa }}
      </view>
    </view>
    <view class="cu-form-group padding padding-right-xl">
      <view class="title">
        声母
      </view>
      <view class="text-grey">
        {{ character.shengmu }}
      </view>
    </view>
    <view class="cu-form-group padding padding-right-xl">
      <view class="title">
        韵母
      </view>
      <view class="text-grey">
        {{ character.yunmu }}
      </view>
    </view>
    <view class="cu-form-group padding padding-right-xl">
      <view class="title">
        声调
      </view>
      <view class="text-grey">
        {{ character.shengdiao }}
      </view>
    </view>
    <view class="cu-form-group padding padding-right-xl">
      <view class="title">
        县区
      </view>
      <view class="text-grey">
        {{ character.county }}
      </view>
    </view>
    <view class="cu-form-group padding padding-right-xl">
      <view class="title">
        乡镇
      </view>
      <view class="text-grey">
        {{ character.town }}
      </view>
    </view>
  </view>
</template>

<script>
const app = getApp();
export default {
    data() {
        return {
            character: {
                character: '',
                pinyin: '',
                ipa: '',
                shengmu: '',
                yunmu: '',
                shengdiao: '',
                county: '',
                town: ''
            }
        };
    },
    onLoad(options) {
        this.getCharacter(options.id);
    },
    methods: {
        // 获取单字信息
        // 获取ipa发音
        // getIpaPronunciation() {
        //   let that = this
        //   wx.request({
        //     url: app.globalData.server + 'pronunciation/' + that.data.character.ipa,
        //     method: 'GET',
        //     data: {},
        //     header: {
        //       'content-type': 'application/json'
        //     },
        //     success(res) {
        //       console.log(res)
        //     }
        //   })
        // }
        getCharacter(id) {
            let that = this;
            uni.request({
                url: app.globalData.server + 'characters/' + id,
                method: 'GET',
                data: {},
                header: {
                    'content-type': 'application/json'
                },

                success(res) {
                    if (res.statusCode == 200) {
                        that.setData({
                            character: res.data.character
                        }); // that.getIpaPronunciation()
                    }
                }
            });
        }
    }
};
</script>
<style>
page {
    background-color: #ffffff;
}

.logo {
    display: flex;
    justify-content: center;
    align-items: center;
}

.logo image {
    width: 22vh;
    height: 16vh;
}
</style>
