import Vue from 'vue';
import share from '@/services/shareMessages';
import App from './App';
// Api函数polyfill（目前为实验版本，如不需要，可删除！）';
import Polyfill from './polyfill/polyfill';

// 全局mixins，用于实现setData等功能，请勿删除！';
import Mixin from './polyfill/mixins';

Polyfill.init();

Vue.mixin(Mixin);
Vue.mixin(share);
Vue.config.productionTip = false;
App.mpType = 'app';
const app = new Vue({
  ...App,
});
app.$mount();
