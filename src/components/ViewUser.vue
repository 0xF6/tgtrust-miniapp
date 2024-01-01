
<template>
    <ion-page>
        <ion-content class="ion-padding">
            <Logo />

            <div class="card" v-if="!selectedUser">
                <ion-progress-bar type="indeterminate"></ion-progress-bar>
            </div>

            <div class="card card-main" v-if="selectedUser" style="padding: unset !important;">
                <div class="profile-card js-profile-card perfect_trust_block" style=" width: 100%;height: 100%;">
                    <div class="profile-card__img verified" style="    height: 150px;width: 150px;">
                        <video v-if="selectedUser.avatar && selectedUser.avatar.extensions === 'mp4'" crossorigin="anonymous" 
                        style="width: 150px; height: 150px; cursor: pointer;"
                        width="150" height="150" autoplay loop alt="profile card"  @click="openUserLink" :src="convertAvatarUrl(selectedUser.avatar.url)">
                        </video>
                        <a v-else-if="selectedUser.avatar">
                            <img crossorigin="anonymous" style=" cursor: pointer;" @click="openUserLink" :src="convertAvatarUrl(selectedUser.avatar.url)" alt="profile card">
                        </a>
                        <a v-else>
                            <img crossorigin="anonymous" style=" cursor: pointer;" @click="openUserLink" :src="`https://eu.ui-avatars.com/api/?name=${selectedUser.name}`" alt="profile card">
                        </a>
                    </div>

                    <div class="profile-card__cnt js-profile-cnt">

                        <div class="profile-card__name">
                            {{ selectedUser.name }}
                        </div>
                        <div class="profile-card__txt"> 
                            <a style="color: white; cursor: pointer;" @click="openUserLink">@{{ selectedUser.username }}</a>
                        </div>

                        <div class="profile-card-inf">
                            <div class="profile-card-inf__item">
                                <div class="profile-card-inf__title verified">
                                    
                                    {{ selectedUser.trustIndex }}</div>
                                <div class="profile-card-inf__txt"><ion-chip color="tertiary">Trust Index</ion-chip></div>
                            </div>
                        </div>

                    </div>

                </div>
            <ion-button v-if="!sharing" @click="getScreenshot">Share</ion-button>
            <p v-if="sharing" style="font-size: 1.1em !important;" class="read-the-docs">Check your trust in <p style="color: burlywood;">@warden_trust_bot</p></p>

            </div>


        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import Logo from "./Logo.vue";
import { ref, nextTick } from "vue";
import { useRouter } from "vue-router";
import { onIonViewDidEnter, onIonViewWillLeave, toastController  } from '@ionic/vue';
import { miniAppUserTrustResponse, useMainStore } from '../stores/MainStore';
import { useMiniApp } from "../stores/miniApp";
import { toPng } from "html-to-image";

const router = useRouter();
const miniApp = useMiniApp();
const store = useMainStore();

const username = router.currentRoute.value.params["username"] as string;
const selectedUser = ref(null as miniAppUserTrustResponse | null);
const sharing = ref(false);

onIonViewDidEnter(() => {
    miniApp.BackButton.onClick(goBack).show();
    getTrustFor();
});
function convertAvatarUrl(url: string): string {
    console.warn(url, store.backendUrl);
    return new URL(url, `https://${store.backendUrl}`).href;
}
onIonViewWillLeave(() => {
    miniApp.BackButton.offClick(goBack).hide();
});

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function requestWriteAccess(): Promise<boolean> {
    return new Promise((resolve) => miniApp.requestWriteAccess(resolve))
}

function openUserLink() {
    miniApp.openTelegramLink(`https://t.me/${username}`);
}
function goBack() {
    nextTick(() => router.back());
}
async function getTrustFor() {
    console.log("getTrustFor", username);

    if (username === "") return;
    const r = await store.getTrustFor(username);

    if (!r || r === "not_found" || r === "balance_not_enough") {
        console.error("error");
        let msg = "";

        if (r === "not_found")
            msg = `Username ${username} not found.`;
        else if (r === "balance_not_enough")
            msg = "Balance Not Enough";
        else 
            msg = "Internal error"

        const toast = await toastController.create({
            message: msg,
            position: "bottom",
            duration: 1500
        });
        await toast.present();
        await sleep(1600);
        router.back();
        return;
    }
    console.log("Success", r);
    selectedUser.value = r;
}

async function getScreenshot() {
    const writeAccessGranted = await requestWriteAccess();

    if (!writeAccessGranted) {
        const toast = await toastController.create({
            message: "Request write access has denied, cant share result",
            position: "bottom",
            duration: 1500
        });
        await toast.present();
        return;
    }


    sharing.value = true;
    
    document.getElementsByClassName("card-main")[0].style.padding = "1px";
    const a = await toPng(document.body, {
        quality: 1
    });
    sharing.value = false;
    document.getElementsByClassName("card-main")[0].style.padding = "0px";
    
    const shareResult = await store.shareResult(a);

    if (shareResult != "ok") {
        const toast = await toastController.create({
            message: "Internal error when sharing...",
            position: "bottom",
            duration: 1500
        });
        await toast.present();
    } else {
        const toast = await toastController.create({
            message: "Sharing complete!",
            position: "bottom",
            duration: 1500
        });
        await toast.present();
    }

    /*html2canvas(document.body, {
        foreignObjectRendering: true,
        allowTaint: true,
        useCORS: true
    }).then(canvas => {
        document.body.appendChild(canvas)

        console.log(canvas.toDataURL());
    });*/
}
</script>

<style scoped></style>
