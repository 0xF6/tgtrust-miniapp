<script lang="ts" setup>
import { useIonRouter } from "@ionic/vue";
const router = useIonRouter();

router.push("/auth");


try { (window as any).Telegram.WebApp.expand(); } catch { }
</script>
<template>
  <ion-app>
    <ion-router-outlet  />
  </ion-app>
</template>

<style>
.fade-enter-active, .fade-leave-active {
  transition-property: opacity;
  transition-duration: .25s;
}

.fade-enter-active {
  transition-delay: .25s;
}

.fade-enter, .fade-leave-active {
  opacity: 0
}
</style>