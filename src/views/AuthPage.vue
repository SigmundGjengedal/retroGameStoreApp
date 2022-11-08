<script setup lang="ts">
/* ionic */
import {
  IonPage,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonCard,
  IonButton,
  IonInput,
  IonCheckbox,
  IonItem,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonIcon,
  IonList,
  IonButtons,
  IonBackButton,
  onIonViewDidEnter,
  onIonViewWillEnter,
} from "@ionic/vue";
/* utils */
import { ref } from "vue";
import { authService } from "../services/directus.service";
/* router */
import { useRouter } from "vue-router";
import { presentToast } from "../lib/utils";
const router = useRouter();
/* state */
const keepLoggedIn = ref(false);
const isUser = ref(true);


const userDetails = ref({
  firstName: "",
  email: "",
  password: "",
});

const login = async () => {
  try {
    await authService.login(
      userDetails.value.email,
      userDetails.value.password
    );
    // alt etter her kjøres bare om promise ble fulfilled. Derfor kan vi route brukeren til index
    router.replace("/home");
  } catch (error) {
    presentToast(`${error}`, "bottom", "warning");
  }
};
const register = async () => {
  try {
    await authService.register(
      userDetails.value.firstName,
      userDetails.value.email,
      userDetails.value.password
    );
    await login();
  } catch (error) {
    presentToast(`${error}`, "bottom", "warning");
  }
};


</script>
<template>
  <ion-page class="auth-container">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>retro🕹 </ion-title>
      </ion-toolbar>
    </ion-header>
    <img class="hero-image" src="/assets/icon/controller.png" />
    <ion-content >
      <!-- segment chooser -->
      <ion-segment value="Login">
        <ion-segment-button value="Login" @click="isUser = true">
          <ion-label>Login</ion-label>
        </ion-segment-button>
        <ion-segment-button value="Register" @click="isUser = false">
          <ion-label>Register</ion-label>
        </ion-segment-button>
      </ion-segment>
      <!-- login -->
      <ion-list>
        <ion-item v-if="!isUser">
          <ion-label class="label-mild" position="floating">Fornavn</ion-label>
          <ion-input type="text" v-model="userDetails.firstName" />
        </ion-item>

        <ion-item>
          <ion-label class="label-mild" position="floating">Email</ion-label>
          <ion-input
            type="text"
            placeholder="email"
            v-model="userDetails.email"
          />
        </ion-item>
        <ion-item>
          <ion-label class="label-mild" position="floating">Passord</ion-label>
          <ion-input type="text" v-model="userDetails.password" />
        </ion-item>
        <ion-item>
          <ion-checkbox slot="start" v-model="keepLoggedIn" />
          <ion-label> Keep me logged in</ion-label>
        </ion-item>
        <ion-button v-if="isUser" @click="login"
          >Log in
        </ion-button>
        <ion-button v-if="!isUser" @click="register"
          >Registrer
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
ion-button {
  margin: 50px 10px 50px 10px;
}
.label-mild {
  --color: #8a8a8a !important;
}
.hero-image {
  width: 70vw;
  align-self: center;
}
ion-button {
  --background: #adddd0;
  border-radius: 5px;
}
</style>
