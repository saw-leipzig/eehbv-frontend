import Vue from 'vue'
import axios from "axios";

//const host = 'http://localhost:8080';

const state = {
    componentTypes: [],
    componentInfos: []
};

const getters = {
    componentTypes: state => state.componentTypes,
    componentInfos: state => state.componentInfos
};

const actions = {
    initComponents: ({commit}) => {
        axios.get('/api/components').
            then((response) => {
                commit('SET_COMPONENTS', response.data._embedded.components);
        });
        axios.get('/api/componentInfoes').
            then((response) => {
                commit('SET_COMPONENT_INFOS', response.data._embedded.componentInfoes);
        });
    }
};

const mutations = {
    'SET_COMPONENTS' (state, componentTypes) {
        Vue.set(state, 'componentTypes', [...componentTypes]);
    },
    'SET_COMPONENT_INFOS' (state, infos) {
        Vue.set(state, 'componentInfos', [...infos]);
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}