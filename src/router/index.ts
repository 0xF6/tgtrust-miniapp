import { createRouter, createWebHashHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import AuthPage from "./../components/AuthPage.vue";
import MainView from "./../components/MainView.vue";
import ViewUser from "./../components/ViewUser.vue";
const routes: Array<RouteRecordRaw> = [
    {
      path: '/',
      redirect: '/auth',
      meta: { transition: 'slide' },
    },
    {
      path: '/auth',
      name: 'Auth',
      component: AuthPage,
      meta: { transition: 'slide' },
    },
    {
        path: '/main',
        name: 'MainView',
        component: MainView,
        meta: { transition: 'slide' },
    },
    {
        path: '/user/:username',
        name: 'ViewUser',
        component: ViewUser,
    }
];


export default createRouter({
    history: createWebHashHistory(),
    routes 
})