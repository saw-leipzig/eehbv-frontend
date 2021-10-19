import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import Vuelidate from 'vuelidate';
import { i18n } from './i18n';
import axios from 'axios';

// axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.baseURL = '/api/v1/';

Vue.config.productionTip = false;

Vue.prototype.$http = axios;

Vue.use(Vuelidate);

new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
