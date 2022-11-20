<script setup lang="ts">
import { IonSlide } from "@ionic/vue";

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

