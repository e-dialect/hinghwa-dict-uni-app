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
      <view
        class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg radius"
      >
        <view
          class="cu-item arrow"
          @tap="toMailsPage"
        >
          <view class="content">
            <text class="cuIcon-mail text-grey" />
            <text class="text-grey">
              我的邮箱
            </text>
            <view
              v-if="unreadMailsCount > 0"
              class="notification-circle"
            >
              {{
                unreadMailsCount
              }}
            </view>
          </view>
        </view>
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
      <view
        class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg radius"
      >
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
              {{ wechatBindText }}
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
  bindingWechat as bindingWechatService,
  cancelBindingWechat as cancelBindingWechatService,
  clearUserInfo,
  getUserInfo,
} from '@/services/user';
import {
  toChangePasswordPage,
  toPronunciationsPage,
  toUserInfoPage,
  toUserWordsPage,
} from '@/routers/user';
import { toMailsPage } from '@/routers/mail';

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
      wechatBindText: '绑定微信',
      isBinding: false,
    };
  },

  beforeMount() {
    this.getInfo();
  },
  methods: {
    toMailsPage,
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
      this.unreadMailsCount = userInfo.notification.statistics.unread;
      this.wechatBindText = userInfo.user.wechat ? '解绑微信' : '绑定微信';
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
     * 绑定/解绑微信
     */
    async bindingWechat() {
      if (this.isBinding) return;
      this.isBinding = true;
      try {
        const userInfo = await getUserInfo(app.globalData.id);
        // 尚未绑定微信
        if (!userInfo.user.wechat) {
          // #ifndef MP-WEIXIN
          uni.showToast({ title: '请在微信小程序中绑定微信' });
          // #endif
          // #ifdef MP-WEIXIN
          try {
            const res = await bindingWechatService(app.globalData.id, false);
            uni.showToast({ title: res && res.msg ? res.msg : '绑定成功' });
            this.wechatBindText = '解绑微信';
            await this.getInfo();
          } catch (err) {
            const msg = (err && (err.msg || (err.data && err.data.msg))) || '绑定失败';
            uni.showToast({ title: msg, icon: 'none' });
          }
          // #endif
          return;
        }

        // 已经绑定微信，确认解绑
        uni.showModal({
          content: '是否解除微信绑定？',
          success: async (res) => {
            if (res.confirm) {
              try {
                await cancelBindingWechatService(app.globalData.id);
                uni.showToast({ title: '解绑成功' });
                this.wechatBindText = '绑定微信';
                await this.getInfo();
              } catch (err) {
                const msg = (err && (err.msg || (err.data && err.data.msg))) || '解绑失败';
                uni.showToast({ title: msg, icon: 'none' });
              }
            }
          },
        });
      } finally {
        this.isBinding = false;
      }
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

/* .content {
  display: flex;
  align-items: center;
  justify-content: flex-start;
} */

.notification-circle {
  width: 20px;
  height: 20px;
  background-color: rgb(30, 182, 213);
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-left: 10px;
}
</style>
