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
        <router-view v-slot="{ Component, route }">
          <Transition :name="transitionName" mode="out-in">
            <component :is="Component" :key="route.path" />
          </Transition>
        </router-view>
      </main>
      <BottomNav />
    </div>
    <div v-if="isSidebarOpen" class="overlay" @click="isSidebarOpen = false"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Sidebar from './components/Sidebar.vue';
import BottomNav from './components/BottomNav.vue';
import { useUserStore } from './stores/user';

const isSidebarOpen = ref(false);
const userStore = useUserStore();
const router = useRouter();
const transitionName = ref('slide-forward');

// Track navigation direction for animations
router.beforeEach((to, from) => {
  const toDepth = to.path.split('/').length;
  const fromDepth = from.path.split('/').length;
  
  // Determine if we're going forward or backward
  if (toDepth > fromDepth) {
    transitionName.value = 'slide-forward';
  } else if (toDepth < fromDepth) {
    transitionName.value = 'slide-back';
  } else {
    // Same depth, check route names for common patterns
    const forwardRoutes = ['PropertyDetails', 'AddProperty', 'PreviewProperty'];
    const backwardRoutes = ['Home', 'Properties'];
    
    if (forwardRoutes.includes(to.name as string) && !forwardRoutes.includes(from.name as string)) {
      transitionName.value = 'slide-forward';
    } else if (backwardRoutes.includes(to.name as string)) {
      transitionName.value = 'slide-back';
    } else {
      transitionName.value = 'fade';
    }
  }
});

onMounted(() => {
  userStore.listenForAuthStateChanges();
});
</script>

<style scoped>
#app-container {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f5f7fa 0%, #ffffff 100%);
}

.main-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  transition: margin-left 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  padding-top: env(safe-area-inset-top, 0);
  padding-left: calc(20px + env(safe-area-inset-left, 0));
  padding-right: calc(20px + env(safe-area-inset-right, 0));
  min-height: 64px;
  height: calc(64px + env(safe-area-inset-top, 0));
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);
}

.hamburger-menu {
  background: none;
  border: none;
  color: var(--primary-blue);
  cursor: pointer;
  padding: 8px;
  border-radius: 10px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hamburger-menu:active {
  background: rgba(0, 122, 255, 0.1);
  transform: scale(0.95);
}

.hamburger-menu svg {
  width: 24px;
  height: 24px;
}

.header-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-blue);
  letter-spacing: -0.5px;
}

.user-profile {
  color: var(--primary-blue);
  padding: 8px;
  border-radius: 10px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-profile:active {
  background: rgba(0, 122, 255, 0.1);
  transform: scale(0.95);
}

.user-profile svg {
  width: 24px;
  height: 24px;
}

.main-content {
  flex-grow: 1;
  padding: 0;
  /* Account for bottom nav + safe area */
  padding-bottom: calc(72px + env(safe-area-inset-bottom, 0));
  background: transparent;
  position: relative;
  overflow-x: hidden;
  min-height: calc(100vh - 64px - env(safe-area-inset-top, 0));
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 199;
  animation: fade-in 0.3s;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Router Transition Animations */
.slide-forward-enter-active,
.slide-forward-leave-active,
.slide-back-enter-active,
.slide-back-leave-active,
.fade-enter-active,
.fade-leave-active {
  transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              opacity 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  will-change: transform, opacity;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}

/* Forward Slide Animation (iOS push) */
.slide-forward-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-forward-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.slide-forward-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.slide-forward-leave-to {
  transform: translateX(-30%);
  opacity: 0.3;
}

/* Backward Slide Animation (iOS pop) */
.slide-back-enter-from {
  transform: translateX(-30%);
  opacity: 0.3;
}

.slide-back-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.slide-back-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.slide-back-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Fade Animation (for same-level transitions) */
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}


/* Desktop Styles */
@media (min-width: 768px) {
  .main-container {
    margin-left: 280px;
  }

  .hamburger-menu, .overlay, .header-title {
    display: none;
  }

  .app-header {
    justify-content: flex-end;
    padding: 0 32px;
    height: 72px;
  }

  .main-content {
    padding: 0;
    padding-bottom: 0;
  }
}

/* Mobile Styles */
@media (max-width: 767px) {
  .user-profile {
    display: none;
  }

  .hamburger-menu {
    display: flex;
  }
  
  .overlay {
    display: block;
  }
}
</style>
