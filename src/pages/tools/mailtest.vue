<template>
  <view>
    <cu-custom title="邮箱列表" />
    <uni-scroll-view
      :refresher="true"
      @refresh="loadEmails"
    >
      <view class="email-list">
        <view
          v-if="emails.length === 0"
          class="empty-message"
        >
          当前没有新的消息哦
        </view>
        <view
          v-for="email in emails"
          :key="email.fromId"
          @click="viewEmail(email.fromId)"
        >
          <view class="email-item">
            <view class="email-title">
              {{ email.title }}
            </view>
            <view class="email-info">
              <view class="email-nickname">
                {{ email.fromNickname }}
              </view>
              <view class="email-time">
                {{ email.time }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </uni-scroll-view>
    <view class="send-button">
      <button @click="sendNotification">
        发送通知
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      emails: [
        {
          fromId: 1,
          fromNickname: '大青蛙',
          time: '2023-08-10 14:30',
          title: '今晚要开会哦',
        },
        {
          fromId: 2,
          fromNickname: '55',
          time: '2023-08-09 10:55',
          title: '今天吃什么？',
        },
        {
          fromId: 3,
		  fromNickname: '徐坤不姓蔡',
		  time: '2023-08-09 10:25',
		  title: '北邮人必须会唱，跳，rap，篮球',
        },

        {
	  fromId: 4,
	  fromNickname: 'mihoyo',
	  time: '2023-08-09 10:25',
	  title: '[回复daonan]你说得对，但是原神是一款',
        },
        // 可以继续添加更多邮件数据
      ],
    };
  },
  methods: {
    viewEmail(id) {
      uni.navigateTo({
        url: `@/pages/tools/mailDetails/?id=${id}`,
      });
    },
    async sendNotification() {
      uni.navigateTo({
        url: './sendmail',
      });
    },
    async onPullRefresh() {
      await this.loadEmails();
      uni.stopPullDownRefresh();
      uni.showToast({
        title: '刷新成功！',
        icon: 'success',
      });
    },
  },
  onMounted() {
    this.loadEmails();
  },
};
</script>

<style scoped>
.email-list {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.email-item {
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 10px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.email-item:hover {
  background-color: #f0f0f0;
}

.email-title {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 5px;
}

.email-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #666;
  font-size: 14px;
}

.email-nickname {
  font-size: 14px;
  color: #333;
}

.email-time {
  font-size: 12px;
  color: #999;
}

.empty-message {
  text-align: center;
  font-size: 16px;
  color: #999;
  margin-top: 20px;
}

.send-button {
  text-align: center;
  position: fixed;
  bottom: 20px;
  left: 15%;
  width: 70%;
}

.send-button button {
  background-color: #39C5BB;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.send-button button:hover {
  background-color: #2fa299;
}
</style>
