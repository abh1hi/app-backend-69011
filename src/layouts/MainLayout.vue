<template>
  <div class="main-layout" :class="{ 'home-layout': isHome }">
    <!-- New Header Component -->
    <Header @toggle-sidebar="toggleSidebar" />

    <!-- Unified Sidebar Drawer (Overlays on both mobile and desktop) -->
    <Sidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />
    <div v-if="isSidebarOpen" class="overlay" @click="isSidebarOpen = false"></div>

    <!-- Main Content Area -->
    <main class="content-area">
      <div class="content-container">
        <slot></slot>
      </div>
    </main>

    <!-- Mobile Bottom Navigation -->
    <nav class="mobile-bottom-nav mobile-only">
      <BottomNav />
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import Header from '../components/Header.vue';
import Sidebar from '../components/Sidebar.vue';
import BottomNav from '../components/BottomNav.vue';
import { useUserStore } from '../stores/userStore';

const isSidebarOpen = ref(false);
// const user = computed(() => userStore.user); // Removed unused
const route = useRoute();

const isHome = computed(() => route.path === '/');

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: white;
}

/* --- Layout & Content --- */
.content-area {
  flex: 1;
  width: 100%;
  padding-top: 80px; /* Space for header on standard pages */
  padding-bottom: 80px; /* Space for bottom nav on mobile */
  padding-left: 0;
  padding-right: 0;
  overflow-x: hidden;
}

.main-layout.home-layout .content-area {
    padding-top: 0; /* Home page goes under header */
}

.content-container {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(2px);
  z-index: 99;
  animation: fade-in 0.2s ease-out;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.mobile-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 40;
}

/* --- Media Queries --- */
.mobile-only { display: block; }

@media (min-width: 1024px) {
  .mobile-only { display: none; }

  .content-area {
    padding-bottom: 0; /* No bottom nav on desktop */
  }
}
</style>
