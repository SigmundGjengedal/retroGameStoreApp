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
    <ion-grid>
      <ion-row>
        <!-- v-for="id in spot.images" -->
        <ion-col size="6" v-for="id in spot.images" :key="id">
          <CampingSpotImage :image-id="id" />
        </ion-col>
      </ion-row>
    </ion-grid>

    <!-- hashtags -->
    <ion-card-header>
      <ion-chip v-for="hash in spot.hashtags" :key="hash">
        #{{ hash }}
      </ion-chip>
      <ion-card-title>{{ spot.title }}</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      {{ spot.description }}
    </ion-card-content>
  </ion-card>
</template>
