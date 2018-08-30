// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './common/css/iconfont.css'
import './common/stylus/variable.styl'
import VueLazyload from 'vue-lazyload'
import store from './state/index'

Vue.config.productionTip = false

Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: require('./common/img/lazyload.gif'),
  attempt: 1
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
