
<template>
    <ion-page>
        <ion-content class="ion-padding">
            <Logo />
            <br/>
            <vs-alert >
                This service allows you to get the <b>trust factor</b> in the user.
                <br/>
                Trust factor which depends on a lot of things
                <br/>
                Which allows you to identify advertising <b>bots, spammers and scammers</b>
                <br/>
                <br/>
                <br/>
                <br/>
                To get started, log in 
            </vs-alert>
        </ion-content>
        <ion-toolbar>
            <p class="read-the-docs">By signing in, you agree to the processing of Personal Data</p>
        </ion-toolbar>
    
    </ion-page>
</template>

<script setup lang="ts">
import Logo from "./Logo.vue";
import { onIonViewWillLeave, onIonViewDidEnter } from "@ionic/vue";
import { useMainStore } from '../stores/MainStore';
import { useIonRouter } from "@ionic/vue";
import { useMiniApp } from "../stores/miniApp";  

const store = useMainStore();
const miniApp = useMiniApp();
const router = useIonRouter();

onIonViewDidEnter(() => {
    const btn = miniApp.MainButton;

    btn.color = "#800080"
    btn.show().enable().setText("Sign In").onClick(doLogin);
});

onIonViewWillLeave(() => {
    miniApp.MainButton.hide();
    miniApp.MainButton.offClick(doLogin);
});



async function doLogin() {
    miniApp.MainButton.showProgress();
    await store.getMeRequest();
    console.log(store.hasLoaded, store.hasErrorAuth)
    if (store.hasLoaded) {
        miniApp.MainButton.hideProgress();
        router.replace({ path: '/main' });
        return;
    }
    if (store.hasErrorAuth) {
        miniApp.MainButton.hideProgress();
        router.replace({ path: '/error' });
        return;
    }
}
</script>
<style scoped>
ion-card {
    transition: transform 100ms;
    filter: drop-shadow(0 0 165px #646cffaa);
}

ion-card:hover {
    transform: scale(1.06);
}

ion-toolbar {
    filter: drop-shadow(0 0 55px #646cffaa);
}
</style>