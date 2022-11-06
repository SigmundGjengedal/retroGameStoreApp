<script setup lang="ts">
import {
  IonCard,
  IonCardTitle,
  IonCardHeader,
  IonCardContent,
  IonChip,
  IonSlides,
} from "@ionic/vue";
import ArticleImage from "./ArticleImage.vue";
defineProps(["spot"]);
</script>
<template>
  <ion-card :router-link="'/detail/' + spot.id">
    <ion-slides>
      <ArticleImage v-for="id in spot.images" :key="id" :image-id="id" />
    </ion-slides>

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

