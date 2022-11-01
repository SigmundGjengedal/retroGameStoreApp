import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import HomePage from "../views/HomePage.vue";
import DetailPage from "../views/DetailPage.vue";
import AuthPage from "../views/AuthPage.vue";
import NewSaleItem from "../views/NewSaleItem.vue";
import { authService } from "@/services/directus.service";
import { toastController } from "@ionic/vue";

// navigation guard
// setter opp betingelser for at brukeren blir sendt videre dit den vil
const authenticationRequiredRouteGuard = async () => {
  const userAccessToken = localStorage.getItem("auth_token");

  if (!userAccessToken) {
    return { name: "AuthPage" }; // navnet på login siden
  }

  const userAccessTokenExpiresAt = async () => {
    const userAccessTokenExpiresAt = localStorage.getItem(
      "auth_expires_at"
    ) as unknown as number;

    if (userAccessTokenExpiresAt < new Date().getTime()) {
      const errorToast1 = await toastController.create({
        message: "brukersesjonen er utløpt - logg inn på nytt",
        duration: 3000,
        color: "warning",
      });

      errorToast1.present();

      await authService.logout();
      return { name: "AuthPage" };
    }
  };
};

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/detail/:id",
    name: "Detail",
    component: DetailPage,
  },
  {
    path: "/auth",
    name: "AuthPage",
    component: AuthPage,
  },
  {
    path: "/new",
    name: "NewcampSpot",
    component: NewSaleItem,
    beforeEnter: [authenticationRequiredRouteGuard],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
