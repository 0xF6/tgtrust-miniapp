<script setup lang="ts">
import { MainButton, BackButton } from "vue-tg";
import { ref } from 'vue'
import { miniAppUserTrustResponse, useMainStore } from "./../stores/MainStore";




const step = ref(-1)
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




</script>

<template>
  <div v-if="step == -2">
    <p style="font-size: xx-large;">
      Internal error, try later
    </p>
  </div>
  <div v-if="step == -1">
    <p v-if="store.isDevelopment">
        DEVELOPMENT
    </p>
    <p>
      Authtorizing...
    </p>
    <ion-progress-bar type="indeterminate"></ion-progress-bar>
    <MainButton @click="doLogin()" text="Login" color="#800080" />
  </div>

  <div v-if="step == 0">
   
  </div>

  <div v-if="step == 1">
    

    <BackButton @click="goBack()" v-if="step > 0" />
  </div>
</template>

<style scoped>
</style>
