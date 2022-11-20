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
  IonSearchbar,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/vue";
import { ref } from "vue";
import HomeCardVue from "@/components/HomeCard.vue";
import { presentToast } from "@/lib/utils";

const saleItems = ref<ISaleItem[]>([]);
const searchTerm = ref("");
const isLoggedInStatus = ref(false);

/* lifeycle method */
onIonViewDidEnter(() => {
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
  isLoggedInStatus.value = await authService.isLoggedIn();
};
// BRUKES av både onViewDidEnter og ion-refreshener.
const fetchAllPosts = async () => {
  const response = await directus.graphql.items<ISaleItemsResponse>(`
  query{
    sale_posts {
      id,
      title,
      images,
      platform,
      price,
    }
  }
  `);
  if (response.status === 200 && response.data) {
    saleItems.value = [...response.data.sale_posts];
  }
};

const fetchSearch = async () => {
  try {
    const response = await directus.graphql.items<ISaleItemsResponse>(`
 query {
  sale_posts(filter:{ _or: [
      {title: { _contains: "${searchTerm.value}"} },
      {platform: { _contains: "${searchTerm.value}"} }
   ]
   }) {
      id,
      title,
      images,
      platform,
      price,
  }
}

  `);
    // Gir beskjed dersom ingen treff
    if (response.status === 200 && response.data.sale_posts[0]) {
      saleItems.value = response.data.sale_posts;
    } else{
      await presentToast(`ingen treff på ${searchTerm.value}`,"bottom", "warning")
    }
  }
  catch (error){
    await presentToast("Du må angi søkeord","bottom", "warning")
  }
};
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
      <ion-toolbar class="search-bar">
        <ion-searchbar
          animated="true"
          placeholder="søk tittel eller plattform"
          v-model="searchTerm"
        ></ion-searchbar>

        <ion-button @click="fetchSearch">SØK</ion-button>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <!--  pull to refresh -->
      <ion-refresher slot="fixed" @ionRefresh="refreshHomePage($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <ion-grid>
        <ion-row>
          <ion-col v-for="spot in saleItems" :key="spot.id" size="6">
            <home-card-vue :spot="spot" />
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- mapper ut card, med binding til key i objekt -->
    </ion-content>
  </ion-page>
</template>
<style scoped>
.search-bar > ion-button {
  display: flex;
  flex-direction: column;
}

ion-col {
  text-align: center;
  border: solid 1px #fff;
  color: #fff;
  background: #EEEEEE;
}

ion-button {
  --background: #adddd0;
  border-radius: 5px;
}

</style>
