import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { IonicVue } from '@ionic/vue'
import { maskito } from '@maskito/vue';
import { createPinia } from 'pinia'
import router from "./router";
import { init, Replay } from "@sentry/vue";

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


init({
    dsn: "https://1f759484ce6d671b7d09f91e0a51e5f5@o958881.ingest.sentry.io/4506498460286976",
    integrations: [
      new Replay({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    debug: true,
    // Session Replay
    replaysSessionSampleRate: 1.0, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });

const app = createApp(App);
const pinia = createPinia()

// retarder code
Object.keys(IonComponents).forEach(key => {
    if (/^Ion[A-Z]\w+$/.test(key)) {
        app.component(key, (IonComponents as any)[key]);
    }
});

app.component(VueCountdown.name, VueCountdown);


app
    .use(pinia)
    .use(IonicVue)
    .use(router)
    .directive("maskito", maskito)
    .mount('#app')
