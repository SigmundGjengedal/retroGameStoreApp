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
  IonCard,
  IonList,
  IonListHeader,
  IonLabel,
  IonItem,
  IonTextarea,
  IonAvatar,
  IonModal,
  IonText,
  IonInput,
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
const isLoadingContent = ref(false);
/* comment data */
const newComment = ref({
  comment: "",
  firstname: "",
  sale_post_id: "",
});

/* dirctus data */
const data = ref(null);
var isLoading = ref(false);

onIonViewDidEnter(() => {
  fetchSalePosts();
});

/* query for en rad (spot) i tabellen. Id kommer fra route.params */
const fetchSalePosts = async () => {
  isLoadingContent.value = true;
  const response = await directus.graphql.items(`
  query{
    sale_posts_by_id(id:${id}) {
      id,
      title,
      description,
      hashtags,
      images,
      price,
      condition,
      platform,
      comment_ids {
        id
        comment
        firstname
        date_created
      }
    }
  }
  `);
  if (response.status === 200 && response.data) {
    data.value = response.data.sale_posts_by_id; // skal fikses med typescript
    isLoadingContent.value = false;
  }
};


const submitNewComment = async () => {
  // logic to post the camp spot to the backend/Directus
  try {
    isLoading.value = true;
    await directus.items("sale_posts_comments").createOne({
      comment: newComment.value.comment,
      firstname: newComment.value.firstname,
      sale_post_id: id,
    });
    isLoading.value = false;
    fetchSalePosts();
    isModalOpen.value=false;
  } catch (error) {
    console.log(error);
    isLoading.value = false;
  }
};

</script>

<template>
  <ion-page>
    <!-- navbar -->
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title v-if="isLoadingContent">
          <ion-spinner></ion-spinner
        ></ion-title>
        <ion-title v-if="data">retro🕹</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="isModalOpen = true">
            <ion-icon :icon="chatboxOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <!-- content på pagen -->
    <ion-content :fullscreen="true" v-if="data && !isLoadingContent">
      <!-- hero image -->
      <detailed-sales-card :key="data.id" :spot="data" />

      <!-- COMMENTS -->
      <ion-card class="comments"  >
        <ion-list lines="inset">
          <ion-list-header>
            <ion-label>
              Kommentarfelt
              <ion-icon :icon="chatboxOutline"></ion-icon>
            </ion-label>
          </ion-list-header>
          <ion-item  v-for="comment in data.comment_ids" :key="comment" >
            <ion-avatar slot="start">
              <img
                  src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw=="
              />
            </ion-avatar>
            <ion-label>
              <ion-text>
                <p > {{ comment.firstname}}</p>
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
        :initial-breakpoint="0.5"
        :breakpoints="[0, 0.25, 0.5, 0.75]"
        @did-dismiss="isModalOpen = false"
      >
        <ion-content class="comment-module">
          <ion-item lines="none">
            <ion-label position="floating">Fornavn</ion-label>
            <ion-input type="text" v-model="newComment.firstname" />
            <ion-label position="floating">kommentar:</ion-label>
            <ion-textarea class="custom-textarea" autoGrow="true" placeholder="..." v-model="newComment.comment"> </ion-textarea>
           <br/>
            <ion-button @click="submitNewComment"
              >SEND</ion-button
            >
          </ion-item>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>
<style scoped>

.comments {
  background: var(--ion-color-sigmunds);
}
.comment ion-icon {
  background: black;
}

ion-textarea.custom-textarea {
  --background: #373737;
  --color: #fff;
  --padding-end: 10px;
  --padding-start: 10px;
  --placeholder-color: #ddd;

}
.comment-module{
  --font-size:20px;
}
ion-item > ion-button{
  height: 50px;
}

template {
  font-family: 'Press Start 2P', sans-serif;
}
</style>
