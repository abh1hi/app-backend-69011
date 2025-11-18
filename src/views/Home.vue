<template>
  <div class="home-container">
    <div class="hero-section">
      <transition-group name="fade" tag="div" class="hero-background">
        <div v-for="(image, index) in images" :key="index" v-show="index === currentImageIndex" class="hero-image" :style="{ backgroundImage: `url(${image})` }"></div>
      </transition-group>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">Find Your Dream Home</h1>
        <p class="hero-subtitle">The best place to find your perfect home, is just a click away.</p>
        <HomeSearch />
      </div>
    </div>
    
    <QuickActions />
    <FeaturedProperties />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import HomeSearch from '../components/HomeSearch.vue';
import QuickActions from '../components/QuickActions.vue';
import FeaturedProperties from '../components/FeaturedProperties.vue';

const images = ref([
  'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2592&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2670&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1605146769289-440113cc3d00?q=80&w=2670&auto=format&fit=crop',
]);

const currentImageIndex = ref(0);
let intervalId: any = null;

onMounted(() => {
  intervalId = setInterval(() => {
    currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length;
  }, 5000); // Change image every 5 seconds
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<style scoped>
.home-container {
  background: linear-gradient(to bottom, #f5f7fa 0%, #ffffff 100%);
  min-height: 100vh;
}

.hero-section {
  position: relative;
  height: 60vh;
  min-height: 450px;
  max-height: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  padding: 1rem;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.hero-image {
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: opacity 1s ease-in-out;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 122, 255, 0.7), rgba(0, 81, 213, 0.8));
}

.hero-content {
  position: relative;
  z-index: 2;
  color: var(--white);
  padding: 1.5rem;
  width: 100%;
  max-width: 800px;
}

.hero-title {
  font-size: 2.25rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
  letter-spacing: -0.03em;
  line-height: 1.2;
}

@media (min-width: 768px) {
  .hero-title {
    font-size: 3.5rem;
    margin-bottom: 1rem;
  }
}

.hero-subtitle {
  font-size: 1.0625rem;
  font-weight: 400;
  margin-bottom: 2.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  opacity: 0.95;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

@media (min-width: 768px) {
  .hero-subtitle {
    font-size: 1.2rem;
    margin-bottom: 3rem;
  }
}

@media (max-width: 640px) {
  .hero-section {
    height: 65vh;
    min-height: 500px;
  }
  .hero-title {
    font-size: 2rem;
  }
  .hero-subtitle {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
}
</style>
