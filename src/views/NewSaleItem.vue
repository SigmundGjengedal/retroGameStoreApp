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
  IonIcon,
  IonSelect,
  IonSelectOption,
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
import {INewSaleItem} from "@/models/SaleItemModels";

const isModalOpen = ref(false);
const newHashtagText = ref("");
const userUpload = ref<INewSaleItem>({
  image: [],
  title: "",
  description: "",
  tags: [],
  imageIds: [],
  platform: "",
  price: "",
  condition: "",
  city:"",
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

const deleteSelectedImg = async (img) => {
  const index = userUpload.value.image.indexOf(img);
  if (index > -1) {
    // dersom treff
    userUpload.value.image.splice(index, 1); // fjerner ett element
  }
};

// handler for DATA posting til DB
const submitNewSaleItem = async () => {
  if (!userUpload.value.image[0]) {
    presentToast("du må laste opp bilde", "bottom", "warning");
    return;
  }
  if (!userUpload.value.title
      || !userUpload.value.description
      || !userUpload.value.price
      || !userUpload.value.city
      || !userUpload.value.condition
      || !userUpload.value.platform
  ) {
    presentToast("du må fylle inn alle felt", "bottom", "warning");
    return;
  }
  // logic to post the camp spot to the backend/Directus
  try {
    isLoading.value = true;

    // henter bilde(r) fra ref. Manuell håndtering av filopplastning til Directus.
    // Må resolve promise når  async brukes i map.
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
    });
    const fileUpload = await directus.files.createOne(formData);
    // dersom bildet ble lastet opp.
    if (fileUpload) {
      if (fileUpload.length > 0) {
        fileUpload.forEach((obj: object) =>
          userUpload.value.imageIds.push(obj.id)
        );
      } else {
        userUpload.value.imageIds.push(fileUpload.id);
      }
      await directus.items("sale_posts").createOne({
        title: userUpload.value.title,
        description: userUpload.value.description,
        hashtags: userUpload.value.tags,
        images: userUpload.value.imageIds,
        platform: userUpload.value.platform,
        price: userUpload.value.price,
        condition: userUpload.value.condition,
        city: userUpload.value.city,
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
          <ion-back-button default-href="/"></ion-back-button>
          <ion-title>NY ANNONSE🕹</ion-title>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list>
        <!-- image upload -->

        <ion-button @click="triggerCamera" class="image-picker" color="light">
          Last opp bilde
          <ion-icon :icon="image"></ion-icon>
        </ion-button>

        <!-- image preview -->
        <section>
          <div v-for="img in userUpload.image" :key="img">
            <ion-button
              @click="deleteSelectedImg(img)"
              fill="default"
              class="remove-image-preview"
            >
              <ion-icon slot="icon-only" :icon="trashOutline" color="danger">
              </ion-icon>
            </ion-button>
            <img :src="img" />
          </div>
        </section>

        <!-- Title input -->
        <ion-item>
          <ion-label position="floating">Overskrift *</ion-label>
          <ion-input type="text" v-model="userUpload.title" />
        </ion-item>
        <ion-item>
          <ion-select
            placeholder="Velg plattform *"
            v-model="userUpload.platform"
          >
            <ion-select-option value="atari 2600">atari 2600</ion-select-option>
            <ion-select-option value="atari 7800">atari 7800</ion-select-option>
            <ion-select-option value="game boy">Game Boy</ion-select-option>
            <ion-select-option value="game boy advance"
              >Game Boy Advance</ion-select-option
            >
            <ion-select-option value="nes classic"
              >NES classic</ion-select-option
            >
            <ion-select-option value="nes 8bit">NES 8bit</ion-select-option>
            <ion-select-option value="nintendo 64"
              >Nintendo 64</ion-select-option
            >
            <ion-select-option value="nintendo wii"
              >nintendo wii</ion-select-option
            >
            <ion-select-option value="nintendo gamecube"
              >nintendo gamecube</ion-select-option
            >
            <ion-select-option value="super nes">SUPER NES</ion-select-option>
            <ion-select-option value="sega genesis"
              >Sega Genesis</ion-select-option
            >
            <ion-select-option value="sega saturn"
              >sega saturn</ion-select-option
            >

            <ion-select-option value="playstation classic"
              >Playstation Classic</ion-select-option
            >
          </ion-select>
        </ion-item>
        <ion-item>
          <ion-select placeholder="Tilstand *" v-model="userUpload.condition">
            <ion-select-option value="ny">Ny</ion-select-option>
            <ion-select-option value="brukt">Brukt</ion-select-option>
          </ion-select>
        </ion-item>
        <!-- Beskrivelse input -->
        <ion-item>
          <ion-label position="floating">Beskrivelse *</ion-label>
          <ion-textarea
            autoGrow="true"
            v-model="userUpload.description"
          ></ion-textarea>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Pris *</ion-label>
          <ion-input type="number" v-model="userUpload.price" />
        </ion-item>
        <ion-item>
          <ion-label position="floating">By og postnummer *</ion-label>
          <ion-input type="text" v-model="userUpload.city" />
        </ion-item>
        <!-- Tags input, med button. skal være array -->
        <ion-item class="tags-input">
          <ion-label position="floating">Hashtag</ion-label>
          <ion-input type="text" v-model="newHashtagText" />
          <ion-button slot="end" @click="addNewHashtag">
            <ion-icon :icon="add"></ion-icon>
          </ion-button>
        </ion-item>
        <!-- vise tags når de legges inn  -->

        <ion-item lines="none">
          <ion-chip v-for="tag in userUpload.tags" :key="tag"
            >{{ tag }}
          </ion-chip>
        </ion-item>

        <!-- submit button -->
        <ion-button @click="submitNewSaleItem">
          <ion-spinner v-if="isLoading" name="circles"></ion-spinner>
          <span v-else> LAST OPP ANNONSE</span>
        </ion-button>
      </ion-list>
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

ion-spinner {
  margin: 0 auto;
  width: 4em;
}

.remove-image-preview {
  position: absolute;
  right: 10px;
  width: 4em;
}
ion-button {
  --background: #adddd0;
  border-radius: 5px;
}
</style>