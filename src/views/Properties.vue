<template>
  <div class="properties-page">
    <div class="page-header">
      <h1 class="page-title">Available Properties</h1>
    </div>

    <div v-if="error" class="error-state">
      <p>{{ error }}</p>
    </div>

    <div class="properties-grid">
      <PropertyCard v-for="property in properties" :key="property.id" :property="property" />
    </div>

    <div v-if="loading" class="loading-indicator">
      <div class="spinner"></div>
    </div>

    <div v-if="!loading && properties.length === 0 && !error" class="empty-state">
      <p>No properties found. Add one to get started!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import PropertyCard from '../components/PropertyCard.vue';
import { useInfiniteScroll } from '../composables/useInfiniteScroll';

const { documents: properties, loading, error } = useInfiniteScroll('properties');
</script>

<style scoped>
.properties-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.page-title {
  font-size: 2.8rem;
  font-weight: 800;
  color: var(--text-primary);
}

.properties-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.loading-indicator, .error-state, .empty-state {
  text-align: center;
  padding: 4rem 1rem;
  font-size: 1.1rem;
  color: var(--text-secondary);
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary-blue);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
