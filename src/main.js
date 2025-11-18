import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { App as CapacitorApp } from '@capacitor/app';
import './style.css';
import './assets/main.css';
import App from './App.vue';
import router from './router';
import { useGoogleMaps } from './composables/useGoogleMaps';
const app = createApp(App);
const pinia = createPinia();
app.use(router);
app.use(pinia);
// Mount the app immediately for a faster startup.
app.mount('#app');
// Load Google Maps in the background.
// The composable will handle the loading state.
const { load } = useGoogleMaps();
load();
// Handle Android back button
CapacitorApp.addListener('backButton', () => {
    if (router.currentRoute.value.name !== 'Home') {
        router.back();
    }
    else {
        CapacitorApp.exitApp();
    }
});
