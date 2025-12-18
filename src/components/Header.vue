<template>
  <header :class="['green-header', { 'scrolled': isScrolled, 'home-mode': isHome }]">
    <div class="header-left">
      <router-link to="/" class="brand-logo">
        <img src="/logo/logo.jpg" alt="Logo" class="logo-img" />
        Apna Aashiyanaa
      </router-link>
    </div>

    <nav class="header-center desktop-only">
      <div class="nav-pill">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/search" class="nav-link">Property List</router-link>
        <a href="#" class="nav-link">About Us</a>
        <a href="#" class="nav-link">Contact Us</a>
      </div>
    </nav>

    <div class="header-right">
       <button class="lang-btn desktop-only">
          <span class="globe-icon">🌐</span> Eng
       </button>
       
       <div class="desktop-only">
           <template v-if="user">
              <button class="auth-btn profile-btn" @click="$router.push('/dashboard')">
                 Dashboard
              </button>
           </template>
           <template v-else>
              <router-link to="/login" class="auth-btn signup-btn">Sign Up</router-link>
           </template>
       </div>

       <button class="mobile-menu-btn mobile-only" @click="$emit('toggle-sidebar')">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
       </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '../stores/userStore';

const route = useRoute();
const userStore = useUserStore();
const user = computed(() => userStore.user);

defineEmits(['toggle-sidebar']);

const isScrolled = ref(false);
const isHome = computed(() => route.path === '/');

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.green-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  padding-top: env(safe-area-inset-top);
  z-index: 100;
  transition: all 0.3s ease;
  background: transparent;
  height: calc(80px + env(safe-area-inset-top));
}

.green-header.scrolled {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  height: calc(70px + env(safe-area-inset-top));
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

.green-header:not(.home-mode) {
    background: white;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05); 
    border-bottom: 1px solid #eee;
}
.green-header:not(.home-mode) .brand-logo { color: #333; }
.green-header:not(.home-mode) .nav-link { color: #555; }

.brand-logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  text-decoration: none;
  font-family: 'Outfit', sans-serif;
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-img {
    height: 40px;
    width: 40px;
    border-radius: 20%;
    object-fit: cover;
    border: 2px solid rgba(255,255,255,0.2);
}

.green-header.scrolled .brand-logo { color: #333; }
.green-header.scrolled .logo-img { border-color: #eee; }

.nav-pill {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  padding: 5px;
  border-radius: 30px;
  display: flex;
  gap: 5px;
  border: 1px solid rgba(255,255,255,0.1);
}

.green-header.scrolled .nav-pill {
    background: #f5f5f5;
    border-color: #eee;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s;
}

.green-header.scrolled .nav-link { color: #555; }

.nav-link:hover { color: rgba(255,255,255,0.8); }
.green-header.scrolled .nav-link:hover { color: #000; }

.nav-link.router-link-active {
  background: white;
  color: #333 !important;
  font-weight: 600;
}
.green-header.scrolled .nav-link.router-link-active {
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.lang-btn {
  background: none;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  font-weight: 500;
}
.green-header.scrolled .lang-btn { color: #333; }

.auth-btn {
  padding: 10px 24px;
  border-radius: 30px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
  text-decoration: none;
  font-size: 0.9rem;
}

.signup-btn {
  background: #007aff;
  color: white;
}

.profile-btn {
  background: #007aff;
  color: white;
}

.auth-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(163, 230, 53, 0.4);
}

.mobile-menu-btn {
    background: none; border: none; color: white; cursor: pointer;
}
.green-header.scrolled .mobile-menu-btn { color: #333; }

.desktop-only { display: flex; }
.mobile-only { display: none; }

@media (max-width: 1024px) {
  .green-header { 
    padding: 0 20px;
    padding-top: env(safe-area-inset-top);
    height: calc(64px + env(safe-area-inset-top)); 
    background: rgba(0,0,0,0.2) !important;
    backdrop-filter: blur(10px); 
  } 
      
  .desktop-only { display: none; }
  .mobile-only { display: block; }
  
  .brand-logo { font-size: 1.25rem; }
}
</style>
