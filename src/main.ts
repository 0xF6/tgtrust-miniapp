import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import VueTelegram from 'vue-tg'
import { IonicVue } from '@ionic/vue'
import { maskito } from '@maskito/vue';
import { createPinia } from 'pinia'

import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

import * as IonComponents from '@ionic/vue';
import VueCountdown from '@chenfengyuan/vue-countdown';

const app = createApp(App);
const pinia = createPinia()

// retarder code
Object.keys(IonComponents).forEach(key => {
    if (/^Ion[A-Z]\w+$/.test(key)) {
        app.component(key, (IonComponents as any)[key]);
    }
});

app.component(VueCountdown.name, VueCountdown);

app.use(VueTelegram)
    .use(pinia)
    .use(IonicVue)
    .directive("maskito", maskito)
    .mount('#app')
