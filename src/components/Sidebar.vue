<template>
  <aside class="sidebar" :class="{ 'is-open': isOpen }">
    <div class="sidebar-header">
      <h2 class="sidebar-title">Aapna Ashiana</h2>
    </div>
    <nav class="sidebar-nav">
      <router-link to="/" class="nav-item" @click="closeSidebar">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span>Home</span>
      </router-link>
      <router-link to="/properties" class="nav-item" @click="closeSidebar">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M12 10v10"/></svg>
        <span>Properties</span>
      </router-link>
      <router-link to="/add-property" class="nav-item" @click="closeSidebar">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
        <span>Add Property</span>
      </router-link>
      <router-link to="/dashboard" class="nav-item" @click="closeSidebar">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
        <span>Dashboard</span>
      </router-link>
      <router-link to="/login" class="nav-item" @click="closeSidebar">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
        <span>Login</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close']);

const closeSidebar = () => {
  emit('close');
};
</script>

<style scoped>
.sidebar {
  position: fixed; /* Correct positioning for viewport */
  top: 0;
  left: 0;
  width: 250px;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-right: 1px solid var(--card-border);
  z-index: 200;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  transform: translateX(-100%); /* Hide off-screen by default */
  transition: transform 0.3s ease-in-out;
}

.sidebar.is-open {
  transform: translateX(0); /* Show on screen */
}

.sidebar-header {
  margin-bottom: 2rem;
  text-align: center;
}

.sidebar-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary-blue);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  color: var(--text-dark);
  font-weight: 500;
  transition: background-color 0.2s, color 0.2s;
}

.nav-item:hover,
.router-link-active {
  background-color: var(--primary-blue-light);
  color: var(--primary-blue);
}

.nav-item svg {
  width: 24px;
  height: 24px;
}

/* On desktop, sidebar is always visible */
@media (min-width: 768px) {
  .sidebar {
    transform: translateX(0);
  }
}
</style>
