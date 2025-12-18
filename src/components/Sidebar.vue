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
      <button v-if="user" class="nav-item" @click="handleAddPropertyClick">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
        <span>Add Property</span>
      </button>
      <router-link v-if="user" to="/dashboard" class="nav-item" @click="closeSidebar">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
        <span>Dashboard</span>
      </router-link>
      <router-link to="/contact" class="nav-item" @click="closeSidebar">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.28-2.28a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        <span>Contact Us</span>
      </router-link>
      <button v-if="user" class="nav-item logout-button" @click="handleLogout">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        <span>Logout</span>
      </button>
    </nav>
    <IDUploadActionSheet 
      :isVisible="showUpgradeSheet"
      @upload-complete="handleUpgrade"
    />
  </aside>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';
import IDUploadActionSheet from './IDUploadActionSheet.vue';

defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close']);
const userStore = useUserStore();
const router = useRouter();
const user = computed(() => userStore.user);
const userProfile = computed(() => userStore.profile);

const showUpgradeSheet = ref(false);

const closeSidebar = () => {
  emit('close');
};

const handleLogout = async () => {
  await userStore.logout();
  closeSidebar();
};

const handleAddPropertyClick = () => {
  if (userProfile.value?.role === 'dealer') {
    router.push('/add-property');
    closeSidebar();
  } else {
    showUpgradeSheet.value = true;
  }
};

const handleUpgrade = async (file: File) => {
  try {
    await userStore.upgradeToDealer(file);
    showUpgradeSheet.value = false;
    router.push('/add-property');
    closeSidebar();
  } catch (error) {
    console.error("Upgrade failed", error);
    alert("Failed to upgrade account.");
  }
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
  border-radius: 100px; /* MORE ROUNDED */
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


</style>
