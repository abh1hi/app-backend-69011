<template>
  <div id="app-container">
    <router-view v-slot="{ Component, route }">
      <!-- Main Layout for all pages except Login -->
      <MainLayout v-if="route.name !== 'Login' && route.name !== 'Signup'">
        <Transition :name="transitionName" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </MainLayout>
      
      <!-- Bare layout for Login/Auth pages -->
      <Transition :name="transitionName" mode="out-in" v-else>
        <component :is="Component" :key="route.path" />
      </Transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import MainLayout from './layouts/MainLayout.vue';
import { useUserStore } from './stores/userStore';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

const router = useRouter();
const transitionName = ref('fade');

const userStore = useUserStore();
const user = computed(() => userStore.user);

onMounted(async () => {
  userStore.listenForAuthStateChanges();
  
  if (Capacitor.isNativePlatform()) {
    try {
      await StatusBar.setBackgroundColor({ color: '#FFFFFF' });
      await StatusBar.setStyle({ style: Style.Light }); // Dark icons for light background
    } catch (e) {
      console.warn('StatusBar error:', e);
    }
  }
});

onUnmounted(() => {
  userStore.stopListeningForAuthStateChanges();
});

// Track navigation direction for animations
router.beforeEach((to, from) => {
  const toDepth = to.path.split('/').length;
  const fromDepth = from.path.split('/').length;
  
  if (toDepth > fromDepth) {
    transitionName.value = 'slide-forward';
  } else if (toDepth < fromDepth) {
    transitionName.value = 'slide-back';
  } else {
     transitionName.value = 'fade';
  }
});
</script>

<style scoped>
#app-container {
  min-height: 100vh;
}

/* Router Transition Animations */
.slide-forward-enter-active,
.slide-forward-leave-active,
.slide-back-enter-active,
.slide-back-leave-active,
.fade-enter-active,
.fade-leave-active {
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Keep complex slide animations if desired, or simplify for desktop */
</style>