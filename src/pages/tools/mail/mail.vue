<template>
  <view>
    <cu-custom title="邮箱列表" />
    <scroll-view
      :refresher="true"
      @refresh="loadEmails"
    >
      <view class="email-list">
        <!--view
          v-if="emails.length||emails.length === 0"
          class="empty-message"
        >
          当前没有新的消息哦
        </view-->
        <view
          v-for="email in emails"
          :key="email.id"
          @click="viewEmail(email.id)"
        >
          <view class="email-item">
            <view class="email-title">
              {{ email.title }}
            </view>
            <view class="email-info">
              <view class="email-nickname">
                {{ email.from.nickname }}
              </view>
              <view class="email-time">
                {{ email.time }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="send-button">
      <button @click="sendNotification">
        发送通知
      </button>
    </view>
  </view>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getAllMails } from '@/services/mail';

export default {
  data() {
    return {
      emails: [],
    };
  },
  beforeMount() {
	  this.loadEmails();
  },
  methods: {
    async loadEmails() {
      const res = await getAllMails();
	  this.emails = res.notifications;
    },
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
}

.email-item {
  border-radius: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.email-item:hover {
  background-color: #f4f4f4;
}

.email-title {
  font-weight: bold;
}

.email-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  color: #666;
}

.email-nickname {
  font-size: 14px;
}

.email-time {
  font-size: 12px;
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
  padding: 10px 20px;
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
