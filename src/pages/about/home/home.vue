<template>
  <view>
    <scroll-view
      scroll-y
      class="scrollPage"
    >
      <image
        class="bg-image"
        src="https://cos.edialect.top/miniprogram/user.png"
        mode="aspectFill"
      />
      <view class="bg-info">
        <view
          class="avatar"
          @tap="toUserInfoPage"
        >
          <image
            class="cu-avatar round"
            :src="avatar"
            mode="aspectFill"
          />
        </view>
        <view class="text">
          {{ nickname }}
        </view>
      </view>
      <view class="padding flex text-center text-grey bg-white shadow-warp">
        <view
          class="flex flex-sub flex-direction solid-right"
          @tap="toMyRecordsPage(id)"
        >
          <view class="text-xlp text-orange">
            {{ recordsCount }}
          </view>
          <view class="margin-top-sm">
            <text class="cuIcon-voice" />
            语音量
          </view>
        </view>
        <view class="flex flex-sub flex-direction solid-right">
          <view class="text-xlp text-blue">
            {{ wordsCount }}
          </view>
          <view class="margin-top-sm">
            <text class="cuIcon-font" />
            词语量
          </view>
        </view>
        <view class="flex flex-sub flex-direction">
          <view class="text-xlp text-green">
            {{ visitTotal }}
          </view>
          <view class="margin-top-sm">
            <text class="cuIcon-attention" />
            播放量
          </view>
        </view>
      </view>
      <view class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg radius">
        <view class="cu-item arrow">
          <navigator
            class="content"
            url="/pages/about/articlesliked/articlesliked"
            hover-class="none"
          >
            <text class="cuIcon-appreciate text-grey" />
            <text class="text-grey">
              点赞文章
            </text>
          </navigator>
        </view>
        <view class="cu-item arrow">
          <navigator
            class="content"
            url="/pages/about/myarticles/myarticles"
            hover-class="none"
          >
            <text class="cuIcon-edit text-grey" />
            <text class="text-grey">
              我的文章
            </text>
          </navigator>
        </view>
        <view class="cu-item arrow">
          <navigator
            class="content"
            url="/pages/about/mycomments/mycomments"
            hover-class="none"
          >
            <text class="cuIcon-comment text-grey" />
            <text class="text-grey">
              我的评论
            </text>
          </navigator>
        </view>
        <!--        <view class="cu-item arrow">-->
        <!--          <navigator-->
        <!--            class="content"-->
        <!--            url="/pages/about/articles/articles"-->
        <!--            hover-class="none"-->
        <!--          >-->
        <!--            <text class="cuIcon-musicfill text-grey" />-->
        <!--            <text class="text-grey">-->
        <!--              我的音乐-->
        <!--            </text>-->
        <!--          </navigator>-->
        <!--        </view>-->
      </view>
      <view class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg radius">
        <view class="cu-item arrow">
          <navigator
            class="content"
            url="/pages/about/password/password"
            hover-class="none"
          >
            <text class="cuIcon-write text-grey" />
            <text class="text-grey">
              修改密码
            </text>
          </navigator>
        </view>
        <view
          class="cu-item arrow"
          @tap="bindingWechat"
        >
          <navigator
            class="content"
            url="/pages/about/articles/articles"
            hover-class="none"
          >
            <text class="cuIcon-group text-grey" />
            <text class="text-grey">
              绑定微信
            </text>
          </navigator>
        </view>
        <view
          class="cu-item arrow"
          @tap="exit"
        >
          <navigator
            class="content"
            url="/pages/about/articles/articles"
            hover-class="none"
          >
            <text class="cuIcon-exit text-grey" />
            <text class="text-grey">
              退出登录
            </text>
          </navigator>
        </view>
      </view>
      <view class="stand-view" />
    </scroll-view>
  </view>
</template>

<script>
import {toIndexPage, toMyRecordsPage, toUserInfoPage} from "@/routers";
import {bindingWechat, cancelBindingWechat, getUserInfo} from "@/services/user";

const app = getApp();
export default {
  data() {
    return {
      toUserInfoPage: toUserInfoPage,
      toMyRecordsPage: toMyRecordsPage,
      id: '',
      avatar: '',
      nickname: '',
      recordsCount: 0,
      wordsCount: 0,
      visitTotal: 0
    };
  },
  beforeMount() {
    this.getInfo();
  },
  methods: {
    /**
     * 获取用户信息
     * @returns {Promise<void>}
     */
    async getInfo() {
      const userInfo = await getUserInfo(app.globalData.id);
      this.id = userInfo.user.id;
      this.avatar = userInfo.user.avatar;
      this.nickname = userInfo.user.nickname;
      this.recordsCount = userInfo.contribution.pronunciation;
      this.wordsCount = userInfo.contribution.word;
      this.visitTotal = userInfo.contribution.listened;
    },

    /**
     * 退出登录
     */
    exit() {
      uni.showModal({
        content: '是否退出当前登录？',

        success:async(res)=> {
          if (res.confirm) {
            uni.clearStorageSync();
            app.globalData.status = 0;
            await toIndexPage(uni.getSystemInfoSync().uniPlatform==='web');
            uni.showToast({
              title: '登出成功！'
            });
          }
        }
      });
    },

    /**
     * 绑定微信
     */
    async bindingWechat() {
      const userInfo = await getUserInfo(app.globalData.id);
      if (userInfo.user.wechat === true) {
        uni.showModal({
          content: '当前用户已经绑定微信！',
          cancelText: '取消绑定',

          success(res) {
            if (res.cancel) {
              // 取消绑定微信
              uni.login({
                success(res1) {
                  if (res1.code) {
                    cancelBindingWechat(app.globalData.id).then(async () => {
                      setTimeout(() => {
                        uni.showToast({
                          title: '解除绑定'
                        });
                      }, 100)
                    });
                  }
                }
              });
            }
          }
        });
      } else {
        uni.showModal({
          content: '是否绑定微信？',

          success(res) {
            if (res.confirm) {
              uni.login({
                success(res1) {
                  if (res1.code) {
                    bindingWechat(app.globalData.id , res1.code).then(async () => {
                      setTimeout(() => {
                        uni.showToast({
                          title: '绑定成功'
                        });
                      }, 100)
                    });
                  }
                }
              });
            }
          }
        });
      }
    }
  }
};
</script>
<style>
.bg-image {
  z-index: 0;
  position: absolute;
  width: 100vw;
  height: 28vh;
}

.bg-info {
  z-index: 1024;
  height: 28vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.bg-info .avatar {
  width: 190rpx;
  height: 190rpx;
}

.bg-info .text {
  position: absolute;
  top: 22vh;
  font-size: 36rpx;
  font-weight: 700;
  color: white;
}

.bg-info image {
  width: 180rpx;
  height: 180rpx;
  margin-left: 6rpx;
}
</style>
