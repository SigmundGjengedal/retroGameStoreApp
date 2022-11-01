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
import ArticleImage from "./ArticleImage.vue";
defineProps(["spot"]);
</script>
<template>
  <ion-card :router-link="'/detail/' + spot.id">
    <ArticleImage :image-id="spot.images[0]" />
    <!-- hashtags -->
    <ion-card-header>
      <ion-chip v-for="hash in spot.hashtags" :key="hash">
        #{{ hash }}
      </ion-chip>
      <ion-card-title>{{ spot.title }}</ion-card-title>
    </ion-card-header>
  </ion-card>
</template>
