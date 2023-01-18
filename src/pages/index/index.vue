<template>
  <view>
    <basics v-if="currentPage==='basics'" />
    <tools v-if="currentPage==='tools'" />
    <InteractionPage v-if="currentPage==='InteractionPage'" />
    <me v-if="currentPage==='me'" />

    <view
      class="cu-bar tabbar bg-white shadow foot"
      style="border-radius: 50rem"
    >
      <view
        v-for="item in tabBar"
        :key="item.name"
        class="action"
        data-cur="basics"
        @tap="changePage(item.name)"
      >
        <view class="cuIcon-cu-image">
          <image
            :src="`${cosUrl}${item.image}${currentPage===item.name?'-selected':''}.png`"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { toLoginPage } from '@/routers';
import { defaultMessage } from '@/services/shareMessages';
import { COS_URL } from '../../const/urls';
import basics from '../basics/home/home';
import tools from '../component/home/home';
import InteractionPage from '../plugin/home/home';
import me from '../users/me';

const app = getApp();
export default {
  components: {
    basics,
    tools,
    InteractionPage,
    me,
  },
  data() {
    return {
      cosUrl: `${COS_URL}/images/tabbar/`,
      currentPage: 'basics',
      tabBar: [
        {
          name: 'basics',
          image: 'index',
        },
        {
          name: 'tools',
          image: 'tool',
        },
        {
          name: 'InteractionPage',
          image: 'hd',
        },
        {
          name: 'me',
          image: 'my',
        },
      ],
    };
  },
  onShareAppMessage() {
    return {
      title: '兴化语记',
      path: '/pages/index/index',
      ...defaultMessage(),
    };
  },
  onLoad(options) {
    if (options.status) {
      this.currentPage = options.status;
    }
  },
  methods: {
    /**
     * 切换页面
     * @param page 新页面
     */
    async changePage(page) {
      if (page === 'me') {
        if (!uni.getStorageSync('token')) {
          uni.showModal({
            content: '请先登录',
            showCancel: false,
            success: () => {
              toLoginPage();
            },
          });
          return;
        }
      }
      this.currentPage = page;
    },
  },
};
</script>
<style></style>
