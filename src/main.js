import Vue from 'vue'
import App from './App.vue'
import router from "@/router";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from "axios";
import store from "@/store/store";
import elTableInfiniteScroll from 'el-table-infinite-scroll';
import VideoPlayer from 'vue-video-player';
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')

Vue.config.productionTip = false
Vue.prototype.$axios= axios;
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(elTableInfiniteScroll);
Vue.use(VideoPlayer);

axios.defaults.headers.post['Contenst-Type'] = 'application/json;'
// axios.defaults.headers.common['Authorization'] = store.state.token  // 在header中添加token
if (localStorage.getItem('Authorization')) {
  store.commit('set_token', localStorage.getItem('Authorization'))
}
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 判断是否存在token,如果存在将每个页面header添加token
  if (store.state.token) {
    config.headers.common['Authorization'] = store.state.token
  }
  return config
}, function (error) {
  router.push('/login/user')
  return Promise.reject(error)
})
//添加响应拦截器
axios.interceptors.response.use(function (response) {
  console.log("resp:",response)
  return response
}, function (error) {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        store.commit('del_token')
        router.push('/login/user')
    }
  }
  return Promise.reject(error)
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
