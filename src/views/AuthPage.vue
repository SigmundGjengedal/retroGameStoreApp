<script setup lang="ts">
/* ionic */
import {
  IonPage,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonIcon,
  IonList,
  IonButtons,
  IonBackButton,
} from "@ionic/vue";
import { eye, eyeOff } from "ionicons/icons";
/* utils */
import { ref } from "vue";
import { authService } from "../services/directus.service";
/* router */
import { useRouter } from "vue-router";
import { presentToast } from "../lib/utils";
import {IUserDetails} from "@/models/SaleItemModels";
const router = useRouter();
/* state */
const isUser = ref(true);
const showPassword = ref(false);

const userDetails = ref<IUserDetails>({
  firstName: "",
  email: "",
  password: "",
});

const passwordCheck = ref("");

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
  if (!userDetails.value.firstName || userDetails.value.firstName.length<2) {
    await presentToast("Du må oppgi fornavn", "bottom", "warning");
    return;
  }
  if (userDetails.value.password === passwordCheck.value){
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
  }else{
    await presentToast("Passordene må være like","bottom","warning");
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
    <div class="login-hero">
      <img  src="/assets/icon/controller.png" />
    </div>
    <ion-content >
      <!-- segment chooser -->
      <ion-segment value="Login">
        <ion-segment-button value="Login" @click="isUser = true">
          <ion-label>Login</ion-label>
        </ion-segment-button>
        <ion-segment-button value="Register" @click="isUser = false">
          <ion-label>Lag konto</ion-label>
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
            type="email"
            v-model="userDetails.email"
          />

        </ion-item>
        <!-- passord-->
        <ion-item>
          <ion-label class="label-mild" position="floating">Passord</ion-label>
          <ion-input  v-if="showPassword"  type="text" v-model="userDetails.password" />
          <ion-input v-else type="password" v-model="userDetails.password" />
          <ion-icon v-if="showPassword"  @click="showPassword = !showPassword" slot="end" :icon="eye"></ion-icon>
          <ion-icon v-else @click="showPassword = !showPassword" slot="end" :icon="eyeOff"></ion-icon>

        </ion-item>
        <ion-item  v-if="!isUser" >
          <ion-label class="label-mild" position="floating">Bekreft Passord</ion-label>
          <ion-input type="password" v-model="passwordCheck" />
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
.login-hero {
  display: flex;
  width: 100vw;
  height: 30vh;
  align-self: center;
  background: url(whitenoise.png);
  animation: whitenoise .1s steps(12) infinite;
}

.login-hero img {
  width: 50vw;
  margin: auto;
}

ion-button {
  --background: #adddd0;
  border-radius: 5px;
}

@keyframes whitenoise {
  0%{
    background-position: 0 0;
  }
  100%{
    background-position: 100% 100%;
  }
}
</style>
