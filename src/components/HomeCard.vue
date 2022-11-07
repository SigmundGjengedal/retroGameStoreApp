<script setup lang="ts">
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
} from "@ionic/vue";
import ArticleImage from "./ArticleImage.vue";

defineProps(["spot"]);
</script>
<template>
  <ion-card :router-link="'/detail/' + spot.id">
    <ArticleImage :image-id="spot.images[0]" />
    <!-- hashtags -->
    <ion-card-header>
      <ion-card-subtitle>{{ spot.title }}</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
      <p>   💰 {{ spot.price }} kr</p>
      <p>  🕹 {{ spot.platform }}</p>
    </ion-card-content>
  </ion-card>
</template>
<style scoped>
ion-card {
  min-height: 240px;
}
</style>
