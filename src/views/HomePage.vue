<script setup lang="ts">
import { directus } from "@/services/directus.service";
import { ICampSpot, ICampSpotsResponse } from "@/models/CampSpotModels";
import { authService } from "@/services/directus.service";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  onIonViewDidEnter,
  IonRefresher,
  IonRefresherContent,
  RefresherCustomEvent,
} from "@ionic/vue";
import { ref } from "vue";
import homeCardVue from "@/components/homeCard.vue";

const campingSpots = ref<ICampSpot[]>([]);

/* lifeycle method */
onIonViewDidEnter(() => {
  fetchCampingSpots();
});

const refreshCampingSpotsView = async (event: RefresherCustomEvent) => {
  await fetchCampingSpots();
  event.target.complete();
};

// BRUKES av både onViewDidEnter og ion-refreshener.
const fetchCampingSpots = async () => {
  const response = await directus.graphql.items<ICampSpotsResponse>(`
  query{
    sale_posts {
      id,
      title,
      description,
      hashtags,
      images,
      user_created{
        first_name
      }
    }
  }
  `);
  if (response.status === 200 && response.data) {
    campingSpots.value = [...response.data.sale_posts];
  }
};
console.log(campingSpots);
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>retro🕹</ion-title>
        <ion-buttons slot="start">
          <ion-button router-link="/new">ADD</ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button @click="authService.logout">LOGOUT</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <!--  pull to refresh -->
      <ion-refresher slot="fixed" @ionRefresh="refreshCampingSpotsView($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- mapper ut card, med binding til key i objekt -->
      <home-card-vue v-for="spot in campingSpots" :key="spot.id" :spot="spot" />
    </ion-content>
  </ion-page>
</template>

<style></style>
