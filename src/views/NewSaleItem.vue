<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonBackButton,
  IonTextarea,
  IonItem,
  IonLabel,
  IonInput,
  IonList,
  IonChip,
  IonSpinner,
  IonModal,
  IonIcon,
} from "@ionic/vue";
// icons
import { image, add, trashOutline } from "ionicons/icons";
// services
import { directus } from "@/services/directus.service";
// utils
import { presentToast } from "../lib/utils";
// Camera
import { Camera, CameraResultType } from "@capacitor/camera";

// state
import { ref } from "vue";
const isModalOpen = ref(false);
const newHashtagText = ref("");
const userUpload = ref({
  image: [],
  title: "",
  description: "",
  tags: [],
  imageIds: [],
});

var isLoading = ref(false);

// add new hashtag handler (kan ikke v-model et array ?)

const addNewHashtag = () => {
  if (newHashtagText.value) {
    //Logic to avoid duplicate hashtags
    if (userUpload.value.tags.includes(newHashtagText.value)) {
      presentToast("Tagen finnes allerede", "middle", "warning");
    } else {
      userUpload.value.tags.push(newHashtagText.value);
    }
  }
  newHashtagText.value = ""; // reset
};

// trigger camera og adde bilde
const triggerCamera = async () => {
  isLoading.value = true;
  try {
    const photo = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });
    if (photo.webPath) {
      userUpload.value.image.push(photo.webPath);
    }
  } catch (error) {
    presentToast("Bruker avbrøt bilde", "bottom", "warning");
  }
  isLoading.value = false;
  isModalOpen.value = false;
};
console.log(isLoading.value);

const changePicture = async () => {
  userUpload.value.image = []; // reset
  await triggerCamera();
};

// handler for DATA posting til DB
const submitNewSaleItem = async () => {
  if (!userUpload.value.image[0]) {
    presentToast("du må laste opp bilde", "bottom", "warning");
    return;
  }
  if (!userUpload.value.description || !userUpload.value.title) {
    presentToast("du må fylle inn alle felt", "bottom", "warning");
    return;
  }
  // logic to post the camp spot to the backend/Directus
  try {
    isLoading.value = true;

    // henter bilde(r) fra ref. Må resolve promise når  async brukes i map.
    let blobFiles = await Promise.all(
      userUpload.value.image.map(async (img) => {
        const response = await fetch(img);
        const imageBlob = await response.blob();
        return imageBlob;
      })
    );
    // formData object som vi sender til database/directus
    const formData = new FormData();
    // legger inn hvert bilde i objektet
      blobFiles.forEach((file) => {
        formData.append("file", file);
      })
    const fileUpload = await directus.files.createOne(formData);
    // dersom bildet ble lastet opp.
    if (fileUpload) {
      if(fileUpload.length > 0){
        fileUpload.forEach((obj: object) => userUpload.value.imageIds.push(obj.id));
      }else{
        userUpload.value.imageIds.push(fileUpload.id)
      }
      await directus.items("sale_posts").createOne({
        title: userUpload.value.title,
        description: userUpload.value.description,
        hashtags: userUpload.value.tags,
        images: userUpload.value.imageIds,
      });
      presentToast("Annonsen ble lastet opp🙌", "bottom", "success");
    }
    isLoading.value = false;
  } catch (error) {
    presentToast(
      "Noe gikk galt ved opplasting av Annonsen!",
      "bottom",
      "warning"
    );
    console.log(error);
    isLoading.value = false;
  }
};
</script>
<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button default-href="/"> </ion-back-button>
          <ion-title>NY ANNONSE🕹</ion-title>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list>
        <!-- image upload -->

        <ion-button @click="triggerCamera" class="image-picker" color="light">
          Last opp fil eller bilde <ion-icon :icon="image"></ion-icon>
        </ion-button>

        <!-- image preview -->
        <section>
          <ion-button
            @click="isModalOpen = true"
            fill="default"
            class="remove-image-preview"
          >
            <ion-icon slot="icon-only" :icon="trashOutline" color="danger">
            </ion-icon>
          </ion-button>
          <img v-if="userUpload.image[0]" :src="userUpload.image[0]" />
        </section>

        <!-- Title input -->
        <ion-item>
          <ion-label position="floating">Tittel</ion-label>
          <ion-input type="text" v-model="userUpload.title" />
        </ion-item>
        <!-- Beskrivelse input -->
        <ion-item>
          <ion-label position="floating">Beskrivelse</ion-label>
          <ion-textarea v-model="userUpload.description"></ion-textarea>
        </ion-item>

        <!-- Tags input, med button. skal være array -->
        <ion-item class="tags-input">
          <ion-label position="floating">Hashtag</ion-label>
          <ion-input type="text" v-model="newHashtagText" />
          <ion-button color="dark" slot="end" @click="addNewHashtag"
            ><ion-icon :icon="add"></ion-icon
          ></ion-button>
        </ion-item>
        <!-- vise tags når de legges inn  -->

        <ion-item lines="none">
          <ion-chip v-for="tag in userUpload.tags" :key="tag">{{ tag }}</ion-chip>
        </ion-item>
        <!-- submit button -->
        <ion-button color="dark" @click="submitNewSaleItem">
          <ion-spinner v-if="isLoading" name="circles"></ion-spinner>
          <span v-else> Send inn teltplass</span>
        </ion-button>
      </ion-list>

      <!-- modal for å endre bilde -->
      <ion-modal
        :is-open="isModalOpen"
        :initial-breakpoint="0.25"
        :breakpoints="[0.5, 0.75]"
        @did-dismiss="isModalOpen = false"
      >
        <ion-content>
          <ion-item lines="none">
            <ion-button @click="changePicture">Ta nytt bilde</ion-button>
          </ion-item>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>
<style scoped>
ion-content {
  --ion-background-color: #f4f4f4;
  display: flex;
}
ion-list {
  display: flex;
  flex-direction: column;
}
.image-picker {
  height: 20vh;
  margin: 10px auto;
  border: 2px #8a8a8a dashed;
  border-radius: 8px;
  font-size: medium;
}
ion-button {
  margin: 10px auto;
  width: 80vw;
}

.tags-input ion-button {
  width: 4em;
}

ion-modal ion-button {
  margin: 2em;
  height: 3em;
}

ion-spinner {
  margin: 0 auto;
  width: 4em;
}

.remove-image-preview {
  position: absolute;
  right: 10px;
  width: 4em;
}
</style>
