import Vue from 'vue'
import axios from "axios";

const state = {
    componentTypes: []/*,
    componentInfos: []*/
};

const getters = {
    componentTypes: state => state.componentTypes,/*
    componentInfos: state => state.componentInfos*/
};

const actions = {
    initComponents: ({commit}) => {
        axios.get('component-types').
            then((response) => {
                commit('SET_COMPONENTS', response.data.componentTypes);
        });/*
        axios.get('component-infos').
            then((response) => {
                commit('SET_COMPONENT_INFOS', response.data.infos);
        });*/
    }
};

const mutations = {
    'SET_COMPONENTS' (state, componentTypes) {
        Vue.set(state, 'componentTypes', [...componentTypes]);
    },/*
    'SET_COMPONENT_INFOS' (state, infos) {
        Vue.set(state, 'componentInfos', [...infos]);
    }*/
};

export default {
    state,
    getters,
    actions,
    mutations
}