import axios from 'axios';
import store from '../store/index';
import {i18n} from "../i18n";

export default function setup() {
  axios.interceptors.request.use(function(config) {
    const token = store.getters.token;
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
      console.log('MESSAGE');
      try {
        store.dispatch('notify', {id: 0, message: i18n.t('general.error.api_down'), color: 'red'});
      } catch {}
    }
    return Promise.reject(error);
  });
}