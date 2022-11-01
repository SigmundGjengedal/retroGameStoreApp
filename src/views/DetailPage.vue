<script setup lang="ts">
import { directus } from "@/services/directus.service";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonBackButton,
  IonTitle,
  IonContent,
  IonIcon,
  onIonViewDidEnter,
  IonSpinner,
} from "@ionic/vue";

import DetailedSalesCard from "@/components/DetailedSalesCard.vue";

/* icon */
import { chatboxOutline } from "ionicons/icons";
/* utils */
import { ref } from "vue";
/* henter id */
import { useRoute } from "vue-router";
const route = useRoute();
const { id } = route.params;
/* state */
const isModalOpen = ref(false);
const newCommentText = ref("");
const isLoadingCampSpot = ref(true);

/* dirctus data */
const data = ref(null);

onIonViewDidEnter(() => {
  fetchCampingSpot();
});

/* query for en rad (spot) i tabellen. Id kommer fra route.params */
const fetchCampingSpot = async () => {
  const response = await directus.graphql.items(`
  query{
    camp_spots_by_id(id:${id}) {
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
    data.value = response.data.camp_spots_by_id; // skal fikses med typescript
    isLoadingCampSpot.value = false;
  }
};

/* legge til en ny kommentar */
const addNewComment = () => {
  /*   data.value.comments.unshift({
    id: 2,
    username: "N/A",
    comment: newCommentText.value,
  });

  isModalOpen.value = false;
  newCommentText.value = ""; */
};
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title v-if="isLoadingCampSpot">
          <ion-spinner></ion-spinner
        ></ion-title>
        <ion-title v-if="data"> {{ data.title }} (id:{{ id }}) </ion-title>
        <ion-buttons slot="end">
          <ion-button @click="isModalOpen = true">
            <ion-icon :icon="chatboxOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <!-- content på pagen -->
    <ion-content :fullscreen="true" v-if="data && !isLoadingCampSpot">
      <!-- hero image -->
      <detailed-sales-card :key="data.id" :spot="data" />

      <!--  <ion-card class="comments">
        <ion-list>
          <ion-list-header>
            <ion-label>
              Kommentarfelt
              <ion-icon :icon="chatboxOutline"></ion-icon>
            </ion-label>
          </ion-list-header>

       
          <ion-item v-for="comment in data.comments" :key="comment.id">
            <ion-avatar slot="start">
              <img
                src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw=="
              />
            </ion-avatar>
            <ion-label ion-text-wrap>
              <ion-text>
                <b>{{ comment.username }}</b>
              </ion-text>
              <ion-text>
                <p>{{ comment.comment }}</p>
              </ion-text>
            </ion-label>
          </ion-item>
        </ion-list>
      </ion-card>

  
      <ion-modal
        :is-open="isModalOpen"
        :initial-breakpoint="0.25"
        :breakpoints="[0, 0.25, 0.5, 0.75]"
        @did-dismiss="isModalOpen = false"
      >
        <ion-content>
          <ion-item lines="none">
            <ion-label position="floating">Ny kommentar</ion-label>
            <ion-textarea v-model="newCommentText"> </ion-textarea>
            <ion-button @click="addNewComment">Legg til kommentar</ion-button>
          </ion-item>
        </ion-content>
      </ion-modal>
       -->
    </ion-content>
  </ion-page>
</template>
<style scoped>
.img-container {
  display: flex;
}
.padding {
  padding: 1em 0;
}
.circle-img {
  width: 15em;
  height: 15em;
  border-radius: 50%;
  margin: auto;
  justify-content: center;
}
.comments {
  background: var(--ion-color-sigmunds);
}
.comment ion-icon {
  background: black;
}
</style>
