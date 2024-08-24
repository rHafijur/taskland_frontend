import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import Aura from '@primevue/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

import '@/assets/styles.scss';
import '@/assets/tailwind.css';

const app = createApp(App);

router.beforeEach(async (to, from) => {
    if (to.name === 'register') {
        return;
    }
    if (localStorage.getItem('auth_token') == null && to.name !== 'login') {
        return { name: 'login' };
    }
});

import Echo from 'laravel-echo';
import 'pusher-js';
// require('pusher-js');
window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: '2f6ad2c73ecbb3f9b61e',
    cluster: 'ap2',
    forceTLS: true
});

app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.use(ToastService);
app.use(ConfirmationService);

app.mount('#app');
