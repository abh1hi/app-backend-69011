<template>
  <div class="featured-properties-container">
    <h2 class="section-title">Featured Properties</h2>
    <p class="section-subtitle">Handpicked properties by our team</p>
    <div v-if="loading && documents.length === 0" class="loading-state">
      <div class="spinner"></div>
      <p>Loading properties...</p>
    </div>
    <div v-if="error" class="error-state">
       <p>{{ error }}</p>
    </div>
    <div v-if="!error" class="properties-grid">
      <PropertyCard 
        v-for="property in documents" 
        :key="property.id" 
        :property="property"
      />
    </div>
     <div v-if="!loading && documents.length === 0 && !error" class="empty-state">
      <p>No properties found. Be the first to add one!</p>
    </div>
    <div v-if="hasMore && !loading" class="load-more-container">
        <button @click="loadMore" class="load-more-button">Load More</button>
      </div>
  </div>
</template>

<script setup lang="ts">
import { useInfiniteScroll } from '../composables/useInfiniteScroll';
import PropertyCard from './PropertyCard.vue';

const { documents, loading, error, hasMore, loadMoreDocuments } = useInfiniteScroll('properties');

const loadMore = () => {
  loadMoreDocuments();
};

</script>

<style scoped>
.featured-properties-container {
  padding: 2.5rem 1rem;
  background: var(--background-color-soft);
}

@media (min-width: 768px) {
  .featured-properties-container {
    padding: 4rem 1.5rem;
  }
}

.section-title {
  text-align: center;
  font-size: 1.875rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  letter-spacing: -0.6px;
}

.section-subtitle {
  text-align: center;
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 2.5rem;
  font-weight: 400;
}

@media (min-width: 768px) {
  .section-title {
    font-size: 2.5rem;
  }
  .section-subtitle {
    font-size: 1.125rem;
    margin-bottom: 3rem;
  }
}

.properties-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

@media (min-width: 640px) {
  .properties-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.75rem;
  }
}

@media (min-width: 1024px) {
  .properties-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}

.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 4rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.spinner {
  border: 3px solid rgba(0, 122, 255, 0.1);
  border-top: 3px solid var(--primary-blue);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p, .error-state p, .empty-state p {
  font-size: 1rem;
  color: var(--text-secondary);
  font-weight: 500;
  opacity: 0.7;
}

.load-more-container {
  text-align: center;
  margin-top: 3rem;
  padding: 2rem 0;
}

.load-more-button {
  background: var(--primary-blue);
  color: white;
  padding: 14px 32px;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 4px 16px rgba(0, 122, 255, 0.25);
  letter-spacing: -0.2px;
}

.load-more-button:active {
  transform: scale(0.96);
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.25);
}

@media (min-width: 768px) {
  .load-more-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 122, 255, 0.3);
  }
}
</style>
