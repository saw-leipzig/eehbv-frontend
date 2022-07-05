import Vue from 'vue'

const state = {
  user: {
    id: 0,
    role: 0,
    username: '',
    token: ''
  }
};

const getters = {
  user: state => state.user,
  token: state => state.user.token,
  userRole: state => state.user.role
};

const actions = {
  login: ({commit}, cred) => {
    commit('SET_USER', { id: 0, role: 0, username: cred.username, token: 'TOKEN' });
  }
};

const mutations = {
  'SET_USER' (state, user) {
    localStorage.setItem('USER', JSON.stringify(user));
    Vue.set(state, 'user', user);
  },
  'LOGOUT' (state) {
    localStorage.removeItem('USER');
    Vue.set(state, 'user', { id: 0, role: 0, username: '', token: ''});
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}