<script setup lang="ts">
import {
  IonCard,
  IonCardTitle,
  IonCardHeader,
  IonCardContent,
  IonChip,
  IonSlides,
  IonCardSubtitle,
} from "@ionic/vue";
import ArticleImage from "./ArticleImage.vue";

defineProps(["spot"]);
</script>
<template>
  <ion-card color="secondary">
    <ion-slides>
      <ArticleImage v-for="id in spot.images" :key="id" :image-id="id" />
    </ion-slides>

    <!-- hashtags -->
    <ion-card-header>
      <ion-chip v-for="hash in spot.hashtags" :key="hash">
        #{{ hash }}
      </ion-chip>
      <ion-card-title>{{ spot.title }}</ion-card-title>
      <h5>{{ spot.price }} NOK</h5>
      <br/>
      <ion-card-title><span>Beskrivelse</span></ion-card-title>
      <ion-card-subtitle> <span>Plattform: </span> {{ spot.platform }}</ion-card-subtitle>
      <ion-card-subtitle><span>tilstand: </span> {{ spot.condition }}</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>


      <p>
        {{ spot.description }}
      </p>

    </ion-card-content>
  </ion-card>
</template>
