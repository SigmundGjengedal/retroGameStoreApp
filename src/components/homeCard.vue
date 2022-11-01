<script setup lang="ts">
import {
  IonCard,
  IonCardTitle,
  IonCardHeader,
  IonCardContent,
  IonChip,
  IonGrid,
  IonCol,
  IonRow,
} from "@ionic/vue";
import CampingSpotImage from "./CampingSpotImage.vue";
defineProps(["spot"]);
</script>
<template>
  <ion-card :router-link="'/detail/' + spot.id">
    <CampingSpotImage :image-id="spot.images[0]" />
    <!-- hashtags -->
    <ion-card-header>
      <ion-chip v-for="hash in spot.hashtags" :key="hash">
        #{{ hash }}
      </ion-chip>
      <ion-card-title>{{ spot.title }}</ion-card-title>
    </ion-card-header>
  </ion-card>
</template>
