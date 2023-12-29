<script setup lang="ts">
import { MainButton, BackButton } from "vue-tg";
import { ref } from 'vue'
import { miniAppUserTrustResponse, useMainStore } from "./../stores/MainStore";

function onInput(event: CustomEvent ) {
  console.log(event.detail.value);
  userInputUsername.value = event.detail.value;
}


const step = ref(-1)
const isLoaderActive = ref(false);
let userInputUsername = ref("");
const store = useMainStore();


const selectedUser = ref({
  avatar: null,
  trustIndex: 0,
  verdict: "AwfulStage"
} as miniAppUserTrustResponse);

async function doLogin() {
  console.log(store);
  await store.getMeRequest();
  console.log(store.hasLoaded, store.hasErrorAuth)
  if (store.hasLoaded) {
    step.value = 0;
    return;
  }
  if (store.hasErrorAuth) {
    step.value = -2;
    return;
  }
}
function goBack() {
  step.value--;
  selectedUser.value = {
  avatar: null,
  trustIndex: 0,
  verdict: "AwfulStage"
} as miniAppUserTrustResponse;
}


async function getTrustFor() {
  isLoaderActive.value = true;
  console.log("getTrustFor", userInputUsername);

  if (userInputUsername.value === "") return;
  const r = await store.getTrustFor(userInputUsername.value);

  if (!r) {
    console.error("error");
    isLoaderActive.value = false;
    return;
  }

  selectedUser.value = r;
  console.log("Success", r);
  isLoaderActive.value = false;
  step.value++;
}

</script>

<template>
  <div v-if="step == -2">
    <p style="font-size: xx-large;">
      Internal error, try later
    </p>
  </div>
  <div v-if="step == -1">
    <p>
      Authtorizing...
    </p>
    <ion-progress-bar type="indeterminate"></ion-progress-bar>
    <MainButton @click="doLogin()" text="Login" color="#800080" />
  </div>

  <div v-if="step == 0">
    <p>
      Get Telegram Trust Factor by username
    </p>
    <br />
    <br />
    <div class="card">
      <ion-item>
        <ion-input @ionInput="onInput($event)" :value="userInputUsername" type="text" class="ion-input-username" label="@"
          placeholder="username"></ion-input>
      </ion-item>
      <p v-if="store.currentPeriodExecutionCount === 4" class="read-the-docs">Used {{ 4 - store.currentPeriodExecutionCount }}\4 request</p>
      <p v-if="store.currentPeriodExecutionCount === 3" class="read-the-docs">Used {{ 4 - store.currentPeriodExecutionCount }}\4 request</p>
      <p v-if="store.currentPeriodExecutionCount !== 4" class="read-the-docs">
        <vue-countdown :time="store.currentPeriodExecutionStart" v-slot="{ days, hours, minutes, seconds }">
          Reset will be in：{{ days }} days, {{ hours }} hours, {{ minutes }} minutes, {{ seconds }} seconds.
        </vue-countdown>
      </p>
      <p v-if="store.currentPeriodExecutionCount === 2" class="read-the-docs" style="color: orange">Used {{ 4 - store.currentPeriodExecutionCount }}\4 request</p>
      <p v-if="store.currentPeriodExecutionCount === 1" class="read-the-docs" style="color: red">Used {{ 4 - store.currentPeriodExecutionCount }}\4 request</p>
      <p v-if="store.currentPeriodExecutionCount === 0" class="read-the-docs" style="color: red">Used {{ 4 - store.currentPeriodExecutionCount }}\4 request</p>
    </div>

    <p class="read-the-docs held-bottom">By submitting a request, you agree to the processing of Personal Data</p>
    <MainButton v-if="store.currentPeriodExecutionCount === 0" :disabled="true" :progress="isLoaderActive" text="Submit" color="#808080" />
    <MainButton v-if="store.currentPeriodExecutionCount > 0" @click="getTrustFor()" :disabled="store.currentPeriodExecutionCount === 0" :progress="isLoaderActive" text="Submit" color="#800080" />
  </div>

  <div v-if="step == 1">
    <div class="card">
      <div class="profile-card js-profile-card perfect_trust_block" trust="307" user-id="6218095187">
        <div class="profile-card__img verified">
          <a v-if="selectedUser.avatar && selectedUser.avatar.extensions === 'mp4'">
            <video width="150" height="150" autoplay loop alt="profile card">
                <source :src="selectedUser.avatar.url" type="video/mp4">
            </video>
          </a>
          <a v-else>
            <img :src="selectedUser.avatar?.url" alt="profile card">
          </a>

        </div>

        <div class="profile-card__cnt js-profile-cnt">

          <div class="profile-card__name">
            {{ selectedUser.name }}
          </div>
          <div class="profile-card__txt"> <a style="color: white">@{{ selectedUser.username }}</a>
          </div>

          <div class="profile-card-inf">
            <div class="profile-card-inf__item">
              <div class="profile-card-inf__title verified">{{ selectedUser.trustIndex }}</div>
              <div class="profile-card-inf__txt">Trust Index</div>
            </div>
          </div>

        </div>

      </div>
    </div>

    <BackButton @click="goBack()" v-if="step > 0" />
  </div>
</template>

<style scoped>
.profile-card {
  width: 100%;
  min-height: 380px;
  margin: auto;
  max-width: 240px;
  position: relative;
  margin-top: 85px;
}

.perfect_trust_block {
  position: relative;
}

.profile-card__img.verified {
  box-shadow: 0px 5px 50px 0px #6c44fc, 0px 0px 0px 2px rgba(107, 74, 255, 0.5);
}

.profile-card__img {
  width: 150px;
  height: 150px;
  margin-left: auto;
  margin-right: auto;
  transform: translateY(-50%);
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  z-index: 4;
}

.profile-card__cnt {
  margin-top: -35px;
  text-align: center;
  padding: 0 20px;
  padding-bottom: 40px;
  transition: all 0.3s;
}

.profile-card__name {
  font-weight: 700;
  font-size: 29px;
  color: #6944ff;
  margin-bottom: 15px;
}

.profile-card__txt {
  font-size: 18px;
  font-weight: 500;
  color: #e5f4ff;
  margin-bottom: 15px;
}

.profile-card-inf {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  align-items: flex-start;
  margin-top: 35px;
}

.profile-card-inf__title {
  font-weight: 700;
  font-size: 27px;
  color: #324e63;
}


.awful {
  color: red !important;
}

.bad {
  color: darkred !important;
}

.lower {
  color: indianred !important;
}

.good {
  color: yellow !important;
}

.perfect {
  color: lawngreen !important;
}

.verified {
  color: mediumpurple;
}


.read-the-docs {
  color: #696868;
  font-size: smaller;
}

.held-bottom {
  bottom: 0;
  position: absolute;
}

.label-text-wrapper {
  -webkit-margin-end: 1px !important;
  margin-inline-end: 1px !important;
}</style>
