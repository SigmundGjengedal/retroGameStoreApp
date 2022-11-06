<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet
  }
});
</script>
<style>
@font-face {
  font-family: "GameFont";
  src: local("GameFont"),
  url(./Fonts/PressStart2P-Regular.ttf) format("truetype");
}

ion-title, ion-label,ion-card-title {
  font-family: "GameFont", Helvetica, Arial;
  font-size: 16px;
}
ion-button {
  font-family: "GameFont", Helvetica, Arial;
}


</style>