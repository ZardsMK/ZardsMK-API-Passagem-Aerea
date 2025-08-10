import { createApp } from 'vue';

import App from './App';

import store from './config/store';
import installBootstrap from './config/bootstrap';
import router from './config/router';

import Vue3Toasity from 'vue3-toastify'
import 'vue-toastification/dist/index.css'

import 'font-awesome/css/font-awesome.css'

const app = createApp(App);

app.use(store);
installBootstrap(app);
app.use(Vue3Toasity, {
    autoClose: 3000,
    position: 'top-right',
    theme: 'colored',
});

app.use(router);
app.mount('#app');