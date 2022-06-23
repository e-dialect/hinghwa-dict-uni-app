<template>
  <view>
    <template v-for="item in tabBar">
      <components :is="item.name" v-if="currentPage === item.name">{{ item.name }}</components>
    </template>
    <view class="cu-bar tabbar bg-white shadow foot" style="border-radius: 50rem">
      <view v-for="item in tabBar" class="action" data-cur="basics" @tap="changePage(item.name)">
        <view class="cuIcon-cu-image">
          <image
              :src="`${cosUrl}${item.image}${currentPage===item.name?'-selected':''}.png`"
          ></image>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {COS_URL} from "../const/urls";
import basics    from "./basics/home/home";
import component from "./component/home/home";
import plugin    from "./plugin/home/home";
import about     from "./about/home/home";
import {login}   from "../utils/login";

const app = getApp();
export default {
  components: {
    basics,
    component,
    plugin,
    about,
  },
  data() {
    return {
      cosUrl: COS_URL + '/images/tabbar/',
      currentPage: "basics",
      tabBar: [
        {
          name: 'basics',
          image: 'index'
        },
        {
          name: 'component',
          image: 'tool'
        },
        {
          name: 'plugin',
          image: 'hd'
        },
        {
          name: 'about',
          image: 'my'
        }
      ]
    };
  },
  // TODO: 更新分享界面
  onShareAppMessage() {
    return {
      title: "",
      path: "/pages/index/index",
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      },
    };
  },
  onLoad(options) {
    if (options.status) {
      this.currentPage = options.status
    }
  },
  methods: {
    /**
     * 切换页面
     * @param page 新页面
     */
    changePage(page) {
      if (app.globalData.status === 0 && page === "about") {
        uni.showModal({
          content: "请先登录",
          showCancel: false,
          success: () => {
            login();
          },
        });
        return;
      }
      this.currentPage = page
    },
  },
};
</script>
<style></style>
