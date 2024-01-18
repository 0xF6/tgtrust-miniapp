
<template>
    <ion-page @ref="page">
        <ion-content class="ion-padding">
            <Logo />

            <div class="card card-main" v-if="selectedUser" style="padding: unset !important;">
                <div class="profile-card js-profile-card">
                    <div :class="`profile-card__img ${getTrustStyle()}`">
                        <video class="profile-video-avatar" v-if="!hasMobile && !sharing && isVideoAvatar"
                            crossorigin="anonymous" width="150" height="150" autoplay loop alt="profile card"
                            @click="openUserLink" :src="convertAvatarUrl(selectedUser.avatar!.url)">
                        </video>
                        <a v-else-if="(hasMobile && isVideoAvatar) || (sharing && isVideoAvatar)">
                            <img crossorigin="anonymous" style=" cursor: pointer;" @click="openUserLink"
                                :src="convertAvatarUrl(selectedUser.thumbnail!.url)" alt="profile card">
                        </a>
                        <a v-else-if="selectedUser.avatar">
                            <img crossorigin="anonymous" style=" cursor: pointer;" @click="openUserLink"
                                :src="convertAvatarUrl(selectedUser.avatar.url)" alt="profile card">
                        </a>
                        <a v-else>
                            <vs-avatar history history-gradient shape="circle" style="cursor: pointer;" size="150" @click="openUserLink" alt="profile card">
                                <vs-icon size="50">
                                    <vs-icon-user />
                                </vs-icon>
                            </vs-avatar>
                        </a>
                    </div>

                    <div class="profile-card__cnt js-profile-cnt">

                        <div :class="`profile-card__name ${getTrustStyle()}`">
                            {{ selectedUser.name }}
                        </div>
                        <div class="profile-card__txt">
                            <a style="color: white; cursor: pointer;" @click="openUserLink">@{{ selectedUser.username }}</a>
                        </div>

                        <div class="profile-card-inf">
                            
                            <div class="profile-card-inf__item">
                                <div :class="`profile-card-inf__title ${getTrustStyle()}`">
                                    {{ getTrustNumber(selectedUser.trust_index) }}
                                </div>
                                <div class="profile-card-inf__txt">
                                    <vs-button type="gradient" size="small" color="#7d33ff" active>
                                        Trust Index
                                    </vs-button>
                                </div>
                            </div>
                            <div class="profile-card-inf__item" >
                                <div :class="`profile-card-inf__title ${getTrustStyle()}`">
                                    {{ getTrustLevel(selectedUser.trust_index) }}<b style="font-size: small;"> level</b>
                                </div>

                                <vs-tooltip color="#7d33ff" type="border-thick">
                                    <div class="profile-card-inf__txt">
                                        <vs-button type="gradient" size="small" color="#7d33ff" active >
                                            Linear Trust
                                        </vs-button>
                                    </div>
                                    <template #content> Linear index is a security level of user </template>
                                </vs-tooltip>
                                
                            </div>
                        
                        </div>
                    </div>
                </div>
                <p v-if="sharing" style="font-size: 1.1em !important;" class="read-the-docs">Check your trust in
                <p style="color: burlywood;">@warden_trust_bot</p>
                </p>

            </div>

            
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import Logo from "./Logo.vue";
import { ref, nextTick, computed } from "vue";
import { useRouter } from "vue-router";
import { onIonViewDidEnter, onIonViewWillLeave, toastController } from '@ionic/vue';
import { miniAppUserTrustResponse, useMainStore } from '../stores/MainStore';
import { useMiniApp } from "../stores/miniApp";
import { toPng } from "html-to-image";
import { VsLoadingFn } from "vuesax-alpha";

const router = useRouter();
const miniApp = useMiniApp();
const store = useMainStore();

const hasMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const username = router.currentRoute.value.params["username"] as string;
const selectedUser = ref(null as miniAppUserTrustResponse | null);
const sharing = ref(false);
const isVideoAvatar = computed(() => selectedUser.value?.avatar?.extensions == "mp4");

const page = ref<HTMLElement>();

onIonViewDidEnter(() => {
    getTrustFor();
});
onIonViewWillLeave(() => {
    miniApp.BackButton.offClick(goBack).hide();
    miniApp.MainButton.hide();
    miniApp.MainButton.offClick(getScreenshot);
});

const loader = VsLoadingFn({   
    target: page
})


/*public TrustVerdict GetVerdict(int index) => index switch
{
    >= 200 => TrustVerdict.VerifiedStage,
    >= 40 => TrustVerdict.CertifiedStage,
    >= 30 => TrustVerdict.PerfectStage,
    >= 20 => TrustVerdict.GoodStage,
    >= 10 => TrustVerdict.LowerStage,
    >= 0 => TrustVerdict.BadStage,
    _ => TrustVerdict.AwfulStage
};*/


function getTrustLevel(index: number) {
    if (index >= 200) return "X";
    if (index >= 40) return "V"
    if (index >= 30) return "IV"
    if (index >= 20) return "IIV"
    if (index >= 10) return "III"
    if (index >= 0) return "II";
    return "I";
}

function getTrustStyle() {
    const index = selectedUser.value?.trust_index ?? 0;
    if (index >= 200) return "verified";
    if (index >= 40) return "superperfect"
    if (index >= 30) return "perfect"
    if (index >= 20) return "good"
    if (index >= 10) return "lower"
    if (index >= 0) return "bad";
    return "awful";
}

function getTrustNumber(index: number) {
    if (index >= 200) return "∞";
    return `${index}`;
}



function convertAvatarUrl(url: string): string {
    console.warn(url, store.backendUrl);
    return new URL(url, `https://${store.backendUrl}`).href;
}

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
        loader.close();
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
            duration: 1500,
            color: "danger"
        });
        await toast.present();
        await sleep(1600);
        router.back();
        return;
    }
    setTimeout(() => {
        console.log("Success", r);
        loader.close();
        selectedUser.value = r;
        miniApp.BackButton.onClick(goBack).show();

        const btn = miniApp.MainButton;

        btn.color = "#800080"
        btn.show().enable().setText("Share Result").onClick(getScreenshot);
    }, 500);
}

async function getScreenshot() {
    const writeAccessGranted = await requestWriteAccess();

    if (!writeAccessGranted) {
        const toast = await toastController.create({
            message: "Request write access has denied, cant share result",
            position: "bottom",
            color: "danger",
            duration: 1500
        });
        await toast.present();
        return;
    }


    sharing.value = true;
    await sleep(500);

    const el = document.getElementsByClassName("card-main")[0];
    // guard for screenshots
    (el as any).style.padding = "1px";
    const a = await toPng(document.body, {
        quality: 2,
        pixelRatio: 5
    });
    (el as any).style.padding = "0px";


    sharing.value = false;

    const shareResult = await store.shareResult(a);

    if (shareResult != "ok") {
        const toast = await toastController.create({
            message: "Internal error when sharing...",
            position: "bottom",
            duration: 1500,
            color: "danger"
        });
        await toast.present();
    } else {
        const toast = await toastController.create({
            message: "Sharing complete!",
            position: "bottom",
            color: "success",
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

<style scoped>
.profile-video-avatar {
    width: 150px;
    height: 150px;
    cursor: pointer;
}

.profile-card__img {
    height: 150px;
    width: 150px;
}

.profile-card {
    width: 100%;
    height: 100%;
}

@keyframes steam {
    0% {
        background-position: 0 0;
    }

    50% {
        background-position: 400% 0;
    }

    100% {
        background-position: 0 0;
    }
}
.perfect_trust_block:after {
    filter: blur(50px);
}
</style>
