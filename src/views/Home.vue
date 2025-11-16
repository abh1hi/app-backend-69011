<template>
  <div class="home-container">
    <div class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">Find Your Dream Home</h1>
        <p class="hero-subtitle">The best place to find your perfect home, is just a click away.</p>
        <PropertySearch />
      </div>
    </div>
    
    <QuickActions />
    <FeaturedProperties />

  </div>
</template>

<script setup lang="ts">
import PropertySearch from '../components/PropertySearch.vue';
import QuickActions from '../components/QuickActions.vue';
import FeaturedProperties from '../components/FeaturedProperties.vue';
</script>

<style scoped>
.home-container {
  background-color: var(--background-color);
}

.hero-section {
  position: relative;
  height: 50vh;
  min-height: 380px;
  background-image: url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2592&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2));
}

.hero-content {
  position: relative;
  z-index: 2;
  color: var(--white);
  padding: 1rem;
}

.hero-title {
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  text-shadow: 0 4px 15px rgba(0,0,0,0.4);
}

.hero-subtitle {
  font-size: 1.1rem;
  font-weight: 400;
  margin-bottom: 2rem;
   text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.2rem;
  }
  .hero-subtitle {
    font-size: 1rem;
  }
  .hero-section {
    height: 45vh;
    min-height: 350px;
  }
}
</style>
