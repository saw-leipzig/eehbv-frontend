import Vue from 'vue';
import axios from "axios";

const state = {
  properties: [],
  prop_values: []
};

const getters = {
  properties: state => state.properties,
  prop_values: state => state.prop_values,
  valuesOfProp: (state) => (propId) => {
    return state.prop_values.filter(v => v.material_properties_id === propId)
  }
};

const actions = {
  async initProperties(context) {
    await axios.get('properties').then((response) => {
      context.commit('SET_PROPERTIES', response.data.properties);
    });
    await axios.get('properties/values').then((response) => {
      context.commit('SET_PROPERTY_VALUES', response.data.values);
    });
  },
/*  initProperties: ({commit}) => {
    axios.get('properties').then((response) => {
      commit('SET_PROPERTIES', response.data.properties);
    });
    axios.get('properties/values').then((response) => {
      commit('SET_PROPERTY_VALUES', response.data.values);
    });
  }*/
};

const mutations = {
  'SET_PROPERTIES' (state, properties) {
    Vue.set(state, 'properties', [...properties]);
  },
  'ADD_PROPERTY' (state, property) {
    state.properties.push(property);
  },
  'SET_PROPERTY_VALUES' (state, prop_values) {
    Vue.set(state, 'prop_values', [...prop_values]);
  },
  'ADD_PROPERTY_VALUE' (state, prop_value) {
    state.prop_values.push(prop_value);
  },
  'UPDATE_PROPERTY_VALUE' (state, prop_value) {
    let index = state.prop_values.findIndex(v => v.id === prop_value.id);
    state.prop_values.splice(index, 1, prop_value);
  },
  'DELETE_PROPERTY_VALUE' (state, prop_value) {
    let index = state.prop_values.findIndex(v => v.id === prop_value.id);
    state.prop_values.splice(index, 1);
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}