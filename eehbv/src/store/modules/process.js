import Vue from 'vue'
import axios from "axios";

const state = {
    processes: []
};

const getters = {
    processes: state => state.processes
};

const actions = {
    initProcesses: ({commit}) => {
        axios.get('/api/v1/processes').
            then((response) => {
                commit('SET_PROCESSES', response.data.processes);
        });
    }
};

const mutations = {
    'SET_PROCESSES' (state, processes) {
        Vue.set(state, 'processes', [...processes]);
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}