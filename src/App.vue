<template>
  <div id="app-container">
    <Sidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />
    <div class="main-container">
      <header class="app-header">
        <button class="hamburger-menu" @click="isSidebarOpen = !isSidebarOpen">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <div class="header-title">Aapna Ashiana</div>
        <div class="user-profile">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </div>
      </header>
      <main class="main-content">
        <router-view />
      </main>
      <BottomNav />
    </div>
    <div v-if="isSidebarOpen" class="overlay" @click="isSidebarOpen = false"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Sidebar from './components/Sidebar.vue';
import BottomNav from './components/BottomNav.vue';

const isSidebarOpen = ref(false);
</script>

<style scoped>
#app-container {
  min-height: 100vh;
  background-color: var(--background-light);
}

.main-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  transition: margin-left 0.3s ease-in-out;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  height: 60px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--card-border);
  position: sticky;
  top: 0;
  z-index: 10;
}

.hamburger-menu {
  background: none;
  border: none;
  color: var(--primary-blue);
  cursor: pointer;
  padding: 0;
}

.header-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-blue);
}

.user-profile {
  color: var(--primary-blue);
}

.main-content {
  flex-grow: 1;
  padding: 1.5rem;
  padding-bottom: 70px; /* Space for BottomNav */
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 199; /* Below sidebar, above everything else */
}

/* Desktop Styles */
@media (min-width: 768px) {
  .main-container {
    margin-left: 250px; /* Space for the sidebar */
  }

  .hamburger-menu, .overlay, .header-title {
    display: none;
  }

  .app-header {
    justify-content: flex-end;
  }

  .main-content {
    padding: 2rem;
  }
}

/* Mobile Styles */
@media (max-width: 767px) {
  .user-profile {
    display: none;
  }

  /* Hide the hamburger and overlay when sidebar is not open */
  .hamburger-menu {
      display: block;
  }
  .overlay {
      display: block;
  }
}
</style>
