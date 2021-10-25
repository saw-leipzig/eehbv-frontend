import Vue from 'vue'
import Vuex from 'vuex'
import componentInfo from './modules/component-info'
import process from './modules/process';
import property from "./modules/property";
import notifications from "./modules/notifications";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    componentInfo, process, property, notifications
  }
})
