import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.rakuappdigital.rastla",
  appName: "Luckura",
  webDir: "out",
  ios: {
    contentInset: "always",          // Safe area (notch/home bar) için
    backgroundColor: "#0a0a0f",      // Splash background
    scrollEnabled: false,            // Sayfa scroll değil, içerik scroll
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: "#0a0a0f",
      showSpinner: false,
    },
  },
};

export default config;
