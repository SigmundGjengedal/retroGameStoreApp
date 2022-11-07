<script setup lang="ts">
import { IonSlide } from "@ionic/vue";
// for hente bilder tilbake fra directus, må vi i imagetagen sin href må vi ha med brukerens token. auth_token i localstorage, et Jsonwebtoken
interface Props {
  imageId: string;
}
defineProps<Props>();
</script>
<template>
  <ion-slide>
    <img :src="`https://iw3vs8zi.directus.app/assets/${imageId}`" />
  </ion-slide>
</template>
<style scoped>
</style>

