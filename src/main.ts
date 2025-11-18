import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { App as CapacitorApp } from '@capacitor/app';
import './style.css';
import './assets/main.css';
import App from './App.vue';
import router from './router';
import { useGoogleMaps } from './composables/useGoogleMaps';
import { firebaseApp } from './firebase-config';

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);

const { load } = useGoogleMaps();
load().then(() => {
  app.mount('#app');
});

// Handle Android back button
CapacitorApp.addListener('backButton', () => {
  if (router.currentRoute.value.name !== 'Home') {
    router.back();
  } else {
    CapacitorApp.exitApp();
  }
});
