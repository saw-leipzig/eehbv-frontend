import Vue from 'vue'
import axios from "axios";

const state = {
  componentTypes: []
};

const getters = {
  componentTypes: state => state.componentTypes
};

const actions = {
  initComponents: ({commit}) => {
    axios.get('component-types').
    then((response) => {
      commit('SET_COMPONENTS', response.data.componentTypes);
    });
  }
};

const mutations = {
  'SET_COMPONENTS' (state, componentTypes) {
    Vue.set(state, 'componentTypes', [...componentTypes]);
  },
  'ADD_COMPONENT' (state, componentType) {
    state.componentTypes.push(componentType);
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}