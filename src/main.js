import Vue, { createSSRApp } from 'vue';
import App from './App';

// Api函数polyfill（目前为实验版本，如不需要，可删除！）';
import Polyfill from './polyfill/polyfill';

// 全局mixins，用于实现setData等功能，请勿删除！';
import Mixin from './polyfill/mixins';

// #ifndef VUE3
// #endif

// #ifdef VUE3

Polyfill.init();

Vue.mixin(Mixin);
Vue.config.productionTip = false;
App.mpType = 'app';
const app = new Vue({
  ...App,
});
app.$mount();
// eslint-disable-next-line import/prefer-default-export
export function createApp() {
  const app2 = createSSRApp(App);
  app2.mixin(Mixin);
  return {
    app: app2,
  };
}
// #endif
