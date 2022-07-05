import axios from 'axios';
import store from '../store/index';
import {i18n} from "../i18n";

export default function setup() {
  axios.interceptors.request.use(function(config) {
    let token = store.getters.token;
    if (token === 'TOKEN' || token === '') {
      const user = localStorage.getItem('USER');
      if (user !== null) {
        store.commit('SET_USER', JSON.parse(user));
        token = user.token;
      }
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, function(err) {
    return Promise.reject(err);
  });

  axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    if (error.message && error.message === 'Request failed with status code 500') {
      console.log('Status Code 500');
      try {
        store.dispatch('notify', {id: 0, message: i18n.t('general.error.api_down'), color: 'red'});
      } catch {}
    }
    return Promise.reject(error);
  });
}