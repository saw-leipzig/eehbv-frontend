export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const OPEN_SNACKBAR = 'OPEN_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';

let timer;

const state = {
  activeMessage: false,
  messages: []
};

const getters = {
  notifications: state => state.notifications,
  activeMessage: state => state.activeMessage,
  messages: state => state.messages
};

const mutations = {
  [ADD_NOTIFICATION]: (state, n) => {
    state.messages.push({ message: n.message, id: n.id, color: n.color ? n.color : '' });
  },
  [OPEN_SNACKBAR]: (state) => {
    state.activeMessage = true;
  },
  [CLOSE_SNACKBAR]: (state) => {
    state.activeMessage = false;
    state.messages.splice(0, 1);
  }
};


const actions = {
  notify({ state, commit }, msg) {
    commit(ADD_NOTIFICATION, msg);
    commit(OPEN_SNACKBAR);

    timer = setInterval(() => {
      commit(CLOSE_SNACKBAR);

      if (state.messages.length > 1) {
        commit(OPEN_SNACKBAR);
      } else {
        clearInterval(timer);
      }
    }, 4000);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
