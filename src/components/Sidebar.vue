<template>
  <aside class="sidebar" :class="{ 'is-open': isOpen }">
    <div class="sidebar-header">
      <h2 class="sidebar-title">Apna Aashiyanaa</h2>
      <div v-if="user" class="user-info">
        <p class="user-name">{{ user.displayName || 'User' }}</p>
      </div>
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
      <router-link v-if="user" to="/add-property" class="nav-item" @click="closeSidebar">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
        <span>Add Property</span>
      </router-link>
      <router-link v-if="user" to="/dashboard" class="nav-item" @click="closeSidebar">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
        <span>Dashboard</span>
      </router-link>
      <router-link v-if="!user" to="/login" class="nav-item" @click="closeSidebar">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
        <span>Login</span>
      </router-link>
      <button v-if="user" class="nav-item logout-button" @click="handleLogout">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        <span>Logout</span>
      </button>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import { useUserStore } from '../stores/user';

defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close']);
const userStore = useUserStore();
const user = computed(() => userStore.user);

const closeSidebar = () => {
  emit('close');
};

const handleLogout = async () => {
  await userStore.logout();
  closeSidebar();
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border-right: 0.5px solid rgba(0, 0, 0, 0.1);
  z-index: 200;
  padding: 24px;
  display: flex;
  flex-direction: column;
  transform: translateX(-100%);
  transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 2px 0 20px rgba(0, 0, 0, 0.04);
}

.sidebar.is-open {
  transform: translateX(0);
}

.sidebar-header {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.08);
  padding-left: 12px;
  padding-right: 12px;
}

.sidebar-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-blue);
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.user-info {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.user-name {
  font-weight: 600;
  opacity: 0.8;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  padding: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-radius: 10px;
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  letter-spacing: -0.2px;
}

.nav-item:active {
  transform: scale(0.97);
}

.nav-item:hover:not(.router-link-active) {
  background: rgba(0, 0, 0, 0.04);
  color: var(--text-primary);
}

.router-link-active {
  background: var(--primary-blue);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.2);
}

.nav-item svg {
  width: 22px;
  height: 22px;
  color: var(--text-secondary);
  transition: all 0.25s;
}

.nav-item:hover svg {
    color: var(--text-primary);
}

.nav-item.router-link-active svg {
  color: white;
}

.logout-button {
  color: #E53E3E;
  margin-top: auto;
}

.logout-button:hover {
  background: rgba(229, 62, 62, 0.1);
  color: #C53030;
}

@media (min-width: 768px) {
  .sidebar {
    transform: translateX(0);
  }
}
</style>
