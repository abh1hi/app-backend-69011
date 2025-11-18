<template>
  <nav class="bottom-nav">
    <router-link to="/" class="nav-item">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      <span>Home</span>
    </router-link>
    <router-link to="/properties" class="nav-item">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M12 10v10"/></svg>
      <span>Properties</span>
    </router-link>
    <router-link v-if="user" to="/add-property" class="nav-item" @click="loadMaps">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
      <span>Add</span>
    </router-link>
    <router-link v-if="user" to="/dashboard" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
        <span>Dashboard</span>
    </router-link>
    <router-link v-if="!user" to="/login" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
        <span>Login</span>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '../stores/user';
import { useGoogleMaps } from '../composables/useGoogleMaps';

const userStore = useUserStore();
const user = computed(() => userStore.user);
const { load: loadMapsApi } = useGoogleMaps();

const loadMaps = () => {
  loadMapsApi();
};
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  min-height: 64px;
  padding-bottom: env(safe-area-inset-bottom, 0);
  padding-left: env(safe-area-inset-left, 0);
  padding-right: env(safe-area-inset-right, 0);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border-top: 0.5px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  z-index: 100;
  box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.04);
  /* Ensure content doesn't overlap with safe areas */
  padding-top: 8px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: rgba(0, 0, 0, 0.5);
  font-size: 0.6875rem;
  font-weight: 500;
  flex: 1;
  padding: 8px 4px;
  gap: 4px;
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  min-height: 56px;
  /* Account for safe area at bottom */
  padding-bottom: calc(4px + env(safe-area-inset-bottom, 0) * 0.5);
}

.nav-item:active {
  transform: scale(0.95);
}

.nav-item.router-link-active {
  color: var(--primary-blue);
}

.nav-item.router-link-active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 3px;
  background: var(--primary-blue);
  border-radius: 0 0 3px 3px;
}

.nav-item svg {
  width: 24px;
  height: 24px;
  transition: transform 0.2s;
}

.nav-item.router-link-active svg {
  transform: scale(1.1);
}

.nav-item span {
  font-weight: 500;
  letter-spacing: -0.1px;
}

@media (min-width: 768px) {
  .bottom-nav {
    display: none;
  }
}
</style>
