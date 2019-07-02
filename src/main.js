// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueWeChatTitle from 'vue-wechat-title'
import UglyUI from 'ugly-ui-vue'
import ElementUI from 'element-ui'

import Collapse from './components/collapse'
Vue.use(Collapse)

Vue.use(UglyUI)
Vue.use(ElementUI)
Vue.use(VueWeChatTitle)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
