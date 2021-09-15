import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import axios from 'axios';

// axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.baseURL = '/api/v1/';

Vue.config.productionTip = false

Vue.prototype.$http = axios;

new Vue({
  router,
  store,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
