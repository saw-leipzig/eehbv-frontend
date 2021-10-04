import Vue from 'vue'
import VueI18n from "vue-i18n"
import { deDE, enUS } from './locale'

Vue.use(VueI18n);

export const i18n = new VueI18n({
    locale: 'de_DE',
    messages: {
        'de_DE': deDE,
        'en_US': enUS
    }
});