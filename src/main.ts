import './assets/scss/base/_index.scss';

import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';

import App from './App.vue';
import en from './locales/en.json';
import es from './locales/es.json';
// import router from './router';
import { LANGS } from './utils/constants';
import type { tLangs } from './types/general';

type MessageSchema = typeof en;

function detectBaseLanguage(locale = '') {
  locale = locale.toLowerCase();

  for (const lang of LANGS) {
    if (locale.startsWith(lang)) {
      return lang;
    }
  }

  return 'en';
}
//вернуть когда будут языки 
// const userLang = detectBaseLanguage(navigator?.language || 'en');
const userLang = 'en';

const i18n = createI18n<[MessageSchema], tLangs>({
  legacy: false,
  locale:  userLang || 'en',
  fallbackLocale: 'en',
  messages: {
    en: en,
    es: es,
  },
});

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
// app.use(router);
app.use(i18n);

app.mount('#app');
