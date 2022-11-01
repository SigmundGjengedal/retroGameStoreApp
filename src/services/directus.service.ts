import { Directus } from "@directus/sdk";

/* en service abstraherer bort tredjeparten, altså directus */

export const directus = new Directus("https://iw3vs8zi.directus.app", {
  auth: {
    mode: "json",
  },
});

/* login, registrerering, osv */
export const authService = {
  async login(email: string, password: string) {
    return await directus.auth.login({ email, password }); // returner access token
  },
  async register(
    firstName: string,
    email: string,
    password: string
  ): Promise<boolean> {
    const createUserResult = await directus.users.createOne({
      first_name: firstName,
      email,
      password,
      role: "2ccd059a-bf74-4c60-b53d-ec89c7d56e68",
    });

    return !!createUserResult?.email;
  },
  async logout() {
    return await directus.auth.logout();
  },
  async currentUser() {
    return await directus.users.me.read({
      fields: ["email", "first_name"],
    });
  },

  isLoggedIn() {
    const userAccessToken = localStorage.getItem("auth_token");
    if (userAccessToken != null) {
      return true;
    } else return false;
  },
};
