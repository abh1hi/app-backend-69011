<template>
  <div class="home-container">
    <div class="hero-section">
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
import HomeSearch from '../components/HomeSearch.vue';
import QuickActions from '../components/QuickActions.vue';
import FeaturedProperties from '../components/FeaturedProperties.vue';
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
  background-image: url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2592&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  padding: 1rem;
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