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

ion-title, ion-label,ion-card-title,h4,h3,h2,h1 {
  font-family: "GameFont", Helvetica, Arial;
  font-size: 16px;
}

ion-button {
  font-family: "GameFont", Helvetica, Arial;
  background:#ADDDD0!important;
  border-radius:5px;
}

span{
  font-weight: bold;
}

ion-toolbar {
  display: flex;
  text-align: center;
}

ion-toolbar{
  --background: #EEEEEE;
}


</style>