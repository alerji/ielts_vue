import 'core-js/stable'
import Vue from 'vue'
import App from './App'
import router from './router'
import CoreuiVue from '@coreui/vue'
import { iconsSet as icons } from './assets/icons/icons.js'
import store from './store'
import axios from 'axios'
import Vuex from 'vuex'

import Vueditor from 'vueditor'

import 'vueditor/dist/style/vueditor.min.css'


// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
axios.interceptors.request.use((config) => {
  // trigger 'loading=true' event here

  bus.$emit("show_spinner", 'true');

  return config;
}, (error) => {
  // trigger 'loading=false' event here
  console.log("axios false");
  bus.$emit("show_spinner", 'false');

  return Promise.reject(error);
});

axios.interceptors.response.use((response) => {
  // trigger 'loading=false' event here
  bus.$emit("show_spinner", 'false');

  return response;
}, (error) => {
  // trigger 'loading=false' event here
  bus.$emit("show_spinner", 'false');

  return Promise.reject(error);
});
Vue.config.performance = true
Vue.use(CoreuiVue)
Vue.prototype.$log = console.log.bind(console)

Vue.use(Vuex);
Vue.use(Vueditor);
export const bus = new Vue();
new Vue({
  el: '#app',
  router,
  store,
  icons,
  template: '<App/>',
  components: {
    App
  }
})
