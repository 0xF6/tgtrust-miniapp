
<template>
    <ion-page >
        <ion-header>
            <ion-chip color="warning">Balance: {{ store.totalCoins }} 🪙</ion-chip>
        </ion-header>
        <ion-content class="ion-padding">
            <br/>
            <br/>
            <Logo />
            <p>
                Get Telegram Trust Factor by username
            </p>
            <div class="card">

                <vs-input v-model="userInputUsername" placeholder="username" style="width: 100%;" color="#7D33FF">
      <template #icon>
        <vs-icon> <vs-icon-Hashtag /> </vs-icon>
      </template>
    </vs-input>
                
                <br/>
                <p class="read-the-docs">Every request consume 100 🪙</p>
                <p class="read-the-docs">Coins are being restored every day</p>
                <p class="read-the-docs">If the user is already in the database, the coins are not consumed</p>
                <p class="read-the-docs">Next coins granted in:</p>
                <p class="read-the-docs">
                    <ion-chip color="warning">

                    <vue-countdown :time="store.countdownTimer" v-slot="{ hours, minutes, seconds }">
                        {{ hours }} hours, {{ minutes }} minutes, {{ seconds }} seconds
                    </vue-countdown></ion-chip>
                    
                </p>
            </div>
        </ion-content>
        <ion-footer>
        </ion-footer>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { onIonViewDidEnter, onIonViewWillLeave, toastController  } from '@ionic/vue';
import { useMainStore } from '../stores/MainStore';
import { useIonRouter } from "@ionic/vue";
import Logo from "./Logo.vue";
import { useMiniApp } from '../stores/miniApp';

const store = useMainStore();
const router = useIonRouter();
const miniApp = useMiniApp();


let userInputUsername = ref("");

onIonViewDidEnter(() => {
    const btn = miniApp.MainButton;

    btn.color = "#800080"
    btn.show().enable().setText("Submit").onClick(goToUserView);
});

onIonViewWillLeave(() => {
    miniApp.MainButton.hide();
    miniApp.MainButton.offClick(goToUserView);
});

async function goToUserView() {
    console.error("goToUserView")
    if (store.totalCoins < 100) {
        const toast = await toastController.create({
            message: 'You don \'t have enough 🪙',
            duration: 1500,
            position: "bottom"
        });
        await toast.present();
        return;
    }

    console.log("goToUserView", `/user/${userInputUsername.value}`);
    nextTick(() => router.push(`/user/${userInputUsername.value}`));
}

</script>
<style scoped>
ion-item {
    filter: drop-shadow(0 0 55px #646cffaa);
}

.logosvg {
    display: flex;
    margin: auto;
    justify-content: center;
    text-align: center;
    left: 50%;
    position: relative;
    transform: translateX(-50%) scale(0.5);
    top: -15px;
}

.svg-container {
    filter: drop-shadow(0 0 45px #646cffaa);
    width: 100%;
    height: 200px;
}

ion-header {
    position: absolute !important;
}
</style>

