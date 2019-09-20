import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import './plugins/element.js'
import './assets/reset.css'
import 'font-awesome/css/font-awesome.min.css';
import "./utils/formatDate"

Vue.config.productionTip = false

//路由钩子函数，判断是否有登陆权限
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {  // 判断该路由是否需要登录权限
      if (localStorage.voucher) {
          next();
      } else {
        router.push('/')
      }
  } else {
      next();
  }
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
