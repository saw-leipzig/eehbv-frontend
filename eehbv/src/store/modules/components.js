import axios from "axios";

const host = 'http://localhost:8080';

const state = {
    components: {},
    componentInfos: {}
};

const getters = {
    components: state => state.components,
    componentInfos: state => state.componentInfos
};

const actions = {
    initComponents: ({commit}) => {
        axios.get(host + '/api/components').
            then((response) => {
                commit('SET_COMPONENTS', response.data._embedded.components);
        });
        axios.get(host + '/api/componentInfoes').
            then((response) => {
                commit('SET_COMPONENT_INFOS', response.data._embedded.componentInfoes);
        });
    }
};

const mutations = {
    'SET_COMPONENTS' (state, components) {
        state.components = components;
        console.log(state.components[0].view_name);
    },
    'SET_COMPONENT_INFOS' (state, infos) {
        state.componentInfos = infos;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}