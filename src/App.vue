<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div>
    <img src="/icon_final.svg" class="logo" alt="Vite logo" />
  </div>
  <HelloWorld />
</template>

<style scoped>
.logo {
  max-width: 100%;
  height: 100px;
  scale: 7;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 1em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 1em #42b883aa);
}
</style>
