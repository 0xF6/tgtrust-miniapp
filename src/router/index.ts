import { createRouter, createMemoryHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
      path: '/',
      redirect: '/auth',
      meta: { transition: 'slide' },
    },
    {
      path: '/auth',
      name: 'Auth',
      component: import('./../components/AuthPage.vue'),
      meta: { transition: 'slide' },
    },
    {
        path: '/main',
        name: 'MainView',
        component: import('./../components/MainView.vue'),
        meta: { transition: 'slide' },
    },
    {
        path: '/user/:username',
        name: 'ViewUser',
        component: import("./../components/ViewUser.vue"),
    }
];


export default createRouter({
    history: createMemoryHistory(),
    routes 
})