<template>
  <div class="featured-properties-container">
    <h2 class="section-title">Featured Properties</h2>
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
}

.section-title {
  text-align: center;
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 2rem;
}

.properties-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 3rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 250px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary-blue);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p, .error-state p, .empty.state p {
  font-size: 1rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.load-more-container {
  text-align: center;
  margin-top: 2rem;
}

.load-more-button {
  background-color: var(--primary-blue);
  color: white;
  padding: 1rem 2.5rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .featured-properties-container {
    padding: 2rem 1rem;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .properties-grid {
    gap: 1.2rem;
  }
}
</style>
