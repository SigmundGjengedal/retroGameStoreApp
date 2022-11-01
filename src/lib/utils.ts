import { toastController } from "@ionic/vue";
import { warning } from "ionicons/icons";

export async function presentToast(
  message: string,
  position: "top" | "middle" | "bottom",
  color: "success" | "warning"
) {
  const toast = await toastController.create({
    message: `${message}`,
    duration: 1500,
    icon: warning,
    position,
    color,
  });

  await toast.present();
}
