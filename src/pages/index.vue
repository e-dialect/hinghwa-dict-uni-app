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
import { defaultMessage } from '@/services/shareMessages';
import { toLoginPage } from '@/routers/login';
import { COS_URL } from '../const/urls';
import basics from './home.vue';
import tools from './tools/index.vue';
import InteractionPage from './articles/index.vue';
import me from './users/me.vue';

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
      title: '兴化语记：莆仙方言在线工具',
      path: '/pages/index',
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
          uni.showToast({
            title: '请先登录!',
            icon: 'none',
          });
          setTimeout(() => {
            toLoginPage();
          }, 1000);
          return;
        }
      }
      this.currentPage = page;
    },
  },
};
</script>
<style></style>
