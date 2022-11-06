<script setup lang="ts">
import { directus } from "@/services/directus.service";
import { ISaleItem, ISaleItemsResponse } from "@/models/SaleItemModels";
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
import HomeCardVue from "@/components/HomeCard.vue";
import {presentToast} from "@/lib/utils";

const saleItems = ref<ISaleItem[]>([]);
const isLoggedInStatus = ref(false);




/* lifeycle method */
onIonViewDidEnter( () => {
  fetchAllPosts();
  checkAuth();
});

const handleLogout = async () => {
    await authService.logout();
    await presentToast(`Du er nå logget ut`, "bottom", "success");
    await checkAuth();
};

const refreshHomePage = async (event: RefresherCustomEvent) => {
  await fetchAllPosts();
  event.target.complete();
};
const checkAuth = async () => {
  isLoggedInStatus.value = await authService.isLoggedIn()
}
// BRUKES av både onViewDidEnter og ion-refreshener.
const fetchAllPosts = async () => {
  const response = await directus.graphql.items<ISaleItemsResponse>(`
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
    saleItems.value = [...response.data.sale_posts];
  }
};
console.log(saleItems);
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>retro🕹</ion-title>
        <ion-buttons slot="start">
          <ion-button router-link="/new">ADD</ion-button>
        </ion-buttons>
        <ion-buttons v-if="isLoggedInStatus" slot="end">
          <ion-button @click="handleLogout">LOGOUT</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <!--  pull to refresh -->
      <ion-refresher slot="fixed" @ionRefresh="refreshHomePage($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- mapper ut card, med binding til key i objekt -->
      <home-card-vue v-for="spot in saleItems" :key="spot.id" :spot="spot" />
    </ion-content>
  </ion-page>
</template>


