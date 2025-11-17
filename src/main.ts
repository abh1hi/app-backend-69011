import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { App as CapacitorApp } from '@capacitor/app';
import './style.css';
import './assets/main.css';
import App from './App.vue';
import router from './router';

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);

app.mount('#app');

// Handle Android back button
CapacitorApp.addListener('backButton', () => {
  const currentRoute = router.currentRoute.value;
  
  // If we're not on the home page, navigate back in router
  if (currentRoute.name !== 'Home' && currentRoute.name !== null) {
    router.back();
  } else {
    // If we're on home page, check if there's browser history
    // If yes, go back; if no, exit the app
    if (window.history.length > 1) {
      // Try to go back - if it doesn't work, exit
      const currentPath = window.location.pathname;
      router.back();
      
      // Use a small timeout to check if navigation happened
      setTimeout(() => {
        if (window.location.pathname === currentPath) {
          // Navigation didn't happen, exit app
          CapacitorApp.exitApp();
        }
      }, 100);
    } else {
      // No history, exit the app
      CapacitorApp.exitApp();
    }
  }
});
