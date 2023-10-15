<template>
  <view>
    <scroll-view
      class="scrollPage"
      scroll-y
    >
      <image
        class="bg-image"
        mode="aspectFill"
        src="https://cos.edialect.top/miniprogram/user.png"
      />
      <view class="bg-info">
        <view
          class="avatar"
          @tap="toUserInfoPage"
        >
          <image
            :src="avatar"
            class="cu-avatar round"
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
          @tap="toPronunciationsPage(id)"
        >
          <view class="text-xlp text-orange">
            {{ recordsCount }}
          </view>
          <view class="margin-top-sm">
            <text class="cuIcon-voice" />
            语音量
          </view>
        </view>
        <view
          class="flex flex-sub flex-direction solid-right"
          @tap="toUserWordsPage(id)"
        >
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
            被阅读量
          </view>
        </view>
      </view>
      <view class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg radius">
        <view class="cu-item arrow">
          <navigator
            class="content"
            hover-class="none"
            url="/pages/users/me/likedarticles"
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
            hover-class="none"
            url="/pages/users/me/articles"
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
            hover-class="none"
            url="/pages/products/history"
          >
            <text class="cuIcon-shop text-grey" />
            <text class="text-grey">
              我的积分
            </text>
          </navigator>
        </view>
        <!--        <view class="cu-item arrow">-->
        <!--          <navigator-->
        <!--            class="content"-->
        <!--            hover-class="none"-->
        <!--            url="/pages/users/me/comments"-->
        <!--          >-->
        <!--            <text class="cuIcon-comment text-grey" />-->
        <!--            <text class="text-grey">-->
        <!--              我的评论-->
        <!--            </text>-->
        <!--          </navigator>-->
        <!--        </view>-->
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
        <view
          class="cu-item arrow"
          @tap="toChangePasswordPage()"
        >
          <view class="content">
            <text class="cuIcon-write text-grey" />
            <text class="text-grey">
              修改密码
            </text>
          </view>
        </view>
        <view
          class="cu-item arrow"
          @tap="bindingWechat()"
        >
          <view class="content">
            <text class="cuIcon-group text-grey" />
            <text class="text-grey">
              绑定微信
            </text>
          </view>
        </view>
        <view
          class="cu-item arrow"
          @tap="toTuxiaochaoPage()"
        >
          <view class="content">
            <text class="cuIcon-question text-grey" />
            <text class="text-grey">
              问题反馈
            </text>
          </view>
        </view>
        <view
          class="cu-item arrow"
          @tap="exit()"
        >
          <view class="content">
            <text class="cuIcon-exit text-grey" />
            <text class="text-grey">
              退出登录
            </text>
          </view>
        </view>
      </view>
      <view class="stand-view" />
    </scroll-view>
  </view>
</template>

<script>
import { toIndexPage, toTuxiaochaoPage } from '@/routers';
import {
  bindingWechat, cancelBindingWechat, clearUserInfo, getUserInfo,
} from '@/services/user';
import {
  toChangePasswordPage, toPronunciationsPage, toUserInfoPage, toUserWordsPage,
} from '@/routers/user';

const app = getApp();
export default {
  data() {
    return {
      id: '',
      avatar: '',
      nickname: '',
      recordsCount: 0,
      wordsCount: 0,
      visitTotal: 0,
    };
  },
  beforeMount() {
    this.getInfo();
  },
  methods: {
    toUserWordsPage,
    toChangePasswordPage,
    toUserInfoPage,
    toPronunciationsPage,
    toTuxiaochaoPage,
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
      this.visitTotal = userInfo.contribution.article_views || 0;
    },

    /**
     * 退出登录
     */
    exit() {
      uni.showModal({
        content: '是否退出当前登录？',

        success: async (res) => {
          if (res.confirm) {
            clearUserInfo();
            await toIndexPage(uni.getSystemInfoSync().uniPlatform === 'web');
            uni.showToast({
              title: '登出成功！',
            });
          }
        },
      });
    },

    /**
     * 绑定微信
     */
    async bindingWechat() {
      const userInfo = await getUserInfo(app.globalData.id);
      // 尚未绑定微信
      if (!userInfo.user.wechat) {
        // #ifndef MP-WEIXIN
        uni.showToast({
          title: '请在微信小程序中绑定微信',
        });
        // #endif
        // #ifdef MP-WEIXIN
        await bindingWechat(app.globalData.id, false);
        // #endif
        return;
      }
      // 已经绑定微信
      uni.showModal({
        content: '当前用户已经绑定微信！',
        cancelText: '返回',
        confirmText: '继续操作',

        success(continueOperating) {
          // 继续操作
          if (continueOperating.confirm) {
            // 取消绑定
            uni.showModal({
              content: '是否解除绑定？',
              success: async (cancelBinding) => {
                if (cancelBinding.confirm) {
                  await cancelBindingWechat(app.globalData.id);
                  // 绑定到此微信
                  if (uni.getSystemInfoSync().uniPlatform === 'mp-weixin') {
                    uni.showModal({
                      content: '是否绑定至此微信？',
                      success: async (binding) => {
                        if (binding.confirm) {
                          await bindingWechat(app.globalData.id);
                        }
                      },
                    });
                  }
                }
              },
            });
          }
        },
      });
    },
  },
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
