<template>
  <view>
    <cu-custom
      bg-color="bg-white"
      :is-back="true"
    />
    <view
      class="cu-form-group padding"
      @tap="chooseAvatar"
    >
      <view class="title">
        头像
      </view>
      <view>
        <image
          :src="user.avatar"
          class="margin-right-xs cu-avatar xl round"
          mode="aspectFill"
        />
        <text class="cuIcon-right text-gray" />
      </view>
    </view>
    <view
      class="cu-form-group"
      @tap="toChangeNicknamePage"
    >
      <view class="title">
        昵称
      </view>
      <view class="text-grey">
        {{ user.nickname }}
        <text class="cuIcon-right" />
      </view>
    </view>
    <view
      class="cu-form-group"
      @tap="toChangeEmailPage"
    >
      <view class="title">
        邮箱
      </view>
      <view class="text-grey">
        {{ user.email }}
        <text class="cuIcon-right text-gray" />
      </view>
    </view>
    <view
      class="cu-form-group"
      @tap="toChangePhonePage"
    >
      <view class="title">
        手机
      </view>
      <view class="text-grey">
        {{ user.telephone }}
        <text class="cuIcon-right text-gray" />
      </view>
    </view>
    <view
      class="cu-form-group padding-top-xl"
      style="background-color: #f7f7f7"
    >
      <view class="text-df text-gray">
        个人信息
      </view>
    </view>
    <view class="cu-form-group">
      <view class="title">
        生日
      </view>
      <picker
        mode="date"
        :value="date"
        start="1960-09-01"
        end="2020-09-01"
        @change="changeDate"
      >
        <view class="picker text-grey">
          {{ date }}
        </view>
      </picker>
    </view>

    <!-- <view class="cu-form-group">
  <view class="title">现居地</view>
  <picker mode="region" bindchange="RegionChange" value="{{region}}" custom-item="{{customItem}}">
    <view class="picker text-grey">
      <text >{{region[1]}} {{region[2]}}</text>
    </view>
  </picker>
</view> -->

    <view class="cu-form-group">
      <view class="title">
        居住地
      </view>
      <picker
        mode="multiSelector"
        :value="multiIndex"
        :range="multiArray"
        @change="multiChange"
        @columnchange="columnChange"
      >
        <view class="picker text-grey">
          <text>{{ multiArray[0][multiIndex[0]] }} {{ multiArray[1][multiIndex[1]] }}</text>
        </view>
      </picker>
    </view>
  </view>
</template>

<script>
import {changeUserInfo, getUserInfo} from "@/services/user";
import {toChangeEmailPage, toChangeNicknamePage, toChangePhonePage} from "@/routers";

const app = getApp();
const counties = ['城厢区', '涵江区', '荔城区', '秀屿区', '仙游县'];
const towns = [
  ['龙桥街道', '凤凰山街道', '霞林街道', '常太镇', '华亭镇', '灵川镇', '东海镇'],
  ['涵东街道', '涵西街道', '三江口镇', '白塘镇', '国欢镇', '梧塘镇', '江口镇', '萩芦镇', '白沙镇', '庄边镇', '新县镇', '大洋乡'],
  ['镇海街道', '拱辰街道', '西天尾镇', '黄石镇', '新度镇', '北高镇'],
  ['笏石镇', '东庄镇', '忠门镇', '东埔镇', '东峤镇', '埭头镇', '平海镇', '南日镇', '湄洲镇', '山亭镇', '月塘乡'],
  ['鲤城街道', '枫亭镇', '榜头镇', '郊尾镇', '度尾镇', '鲤南镇', '赖店镇', '盖尾镇', '园庄镇', '大济镇', '龙华镇', '钟山镇', '游洋镇', '西苑乡', '石苍乡', '社硎乡', '书峰乡', '菜溪乡']
];
export default {
  data() {
    return {
      toChangeNicknamePage: toChangeNicknamePage,
      toChangeEmailPage: toChangeEmailPage,
      toChangePhonePage: toChangePhonePage,
      user: [],
      date: '未知',
      multiIndex: [0, 0],
      multiArray: [counties, towns[0]]
    };
  },
  onShow() {
    this.getInfo();
  },
  methods: {
    /**
     * 获取用户信息
     * @returns {Promise<void>}
     */
    async getInfo() {
      const userInfo = await getUserInfo(app.globalData.id);
      this.user = userInfo.user;
      if(userInfo.user.birthday) {
        this.date = userInfo.user.birthday
      }
      if(userInfo.user.birthday) {
      let index_0 = counties.indexOf(userInfo.user.county);
      let index_1 = towns[index_0].indexOf(userInfo.user.town);
      let multiArray = this.multiArray;
      multiArray[1] = towns[index_0];
      this.multiIndex = [index_0, index_1];
      this.multiArray = multiArray
      }
    },

    chooseAvatar() {
      uni.chooseImage({
        count: 1,
        //默认9
        sizeType: ['original', 'compressed'],
        //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'],

        //从相册选择
        success: (res) => {
          const tempFilePaths = res.tempFilePaths[0];
          uni.uploadFile({
            url: app.globalData.server + 'website/files',
            filePath: tempFilePaths,
            name: 'file',
            header: {
              token: app.globalData.token
            },
            success: (res) => {
                let url = JSON.parse(res.data).url;
                this.changeAvatar(url);
            }
          });
        }
      });
    },

    /**
     * 更改头像
     * @returns {Promise<void>}
     */
    async changeAvatar(url) {
      const userInfo = await getUserInfo(app.globalData.id)
      userInfo.user.avatar = url;
      changeUserInfo(app.globalData.id , userInfo.user).then(async (res) => {
        uni.setStorageSync('token', res.token);
        setTimeout(() => {
          uni.showToast({
            title: '修改成功'
          });
        }, 100)
      });
      this.user.avatar = url;
    },

    /**
     * 更改生日
     * @returns {Promise<void>}
     */
    async changeDate(e) {
      this.date = e.detail.value;
      const userInfo = await getUserInfo(app.globalData.id)
      userInfo.user.birthday = e.detail.value;
      changeUserInfo(app.globalData.id , userInfo.user).then(async (res) => {
        uni.setStorageSync('token', res.token);
        setTimeout(() => {
          uni.showToast({
            title: '修改成功'
          });
        }, 100)
      });
    },

    // RegionChange(e) {
    //   var region = e.detail.value
    //   this.setData({
    //     region: region
    //   })
    //   app.globalData.userInfo.county = region[1]
    //   app.globalData.userInfo.town = region[2]
    //   wx.request({
    //     url: app.globalData.server + 'users/' + app.globalData.id,
    //     method: 'PUT',
    //     data: {
    //       user: app.globalData.userInfo
    //     },
    //     header: {
    //       'content-type': 'application/json',
    //       'token': app.globalData.token
    //     },
    //     success(res) {
    //       console.log(res.data)
    //       if (res.statusCode == 200) {
    //         wx.setStorage({
    //           data: res.data.token,
    //           key: 'token',
    //         })
    //       } else {
    //         wx.showToast({
    //           title: '服务器错误',
    //         })
    //       }
    //     },
    //     fail(err) {
    //       wx.showToast({
    //         title: '网络异常',
    //       })
    //     }
    //   })
    // },

    /**
     * 更改区县选择
     * @returns {Promise<void>}
     */
    async multiChange(e) {
      this.multiIndex = e.detail.value;
      const userInfo = await getUserInfo(app.globalData.id)
      userInfo.user.county = this.multiArray[0][this.multiIndex[0]];
      userInfo.user.town = this.multiArray[1][this.multiIndex[1]];
      changeUserInfo(app.globalData.id , userInfo.user).then(async (res) => {
        uni.setStorageSync('token', res.token);
        setTimeout(() => {
          uni.showToast({
            title: '修改成功'
          });
        }, 100)
      });
    },

    /**
     * 切换区县列表
     * @returns {Promise<void>}
     */
    columnChange(e) {
      this.multiIndex[e.detail.column] = e.detail.value;
      if (e.detail.column === 0) {
        switch (this.multiIndex[0]) {
          case 0:
            this.$set(this.multiArray, 1, towns[0]);   //小程序直接赋值无效；在H5环境下,$set会导致一级分类无法滚动，小程序中正常
            break;

          case 1:
            this.$set(this.multiArray, 1, towns[1]);
            break;

          case 2:
            this.$set(this.multiArray, 1, towns[2]);
            break;

          case 3:
            this.$set(this.multiArray, 1, towns[3]);
            break;

          case 4:
            this.$set(this.multiArray, 1, towns[4]);
            break;
        }
      }
    }
  }
};
</script>
<style></style>
