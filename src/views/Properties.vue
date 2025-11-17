<template>
  <div class="properties-page">
    <div class="page-header">
      <h1 class="page-title">Available Properties</h1>
      <button @click="isFilterModalVisible = true" class="filter-button">Filter</button>
    </div>

    <FilterProperties 
      :isVisible="isFilterModalVisible" 
      @close="isFilterModalVisible = false"
      @apply-filters="applyFilters" 
    />

    <div v-if="error" class="error-state">
      <p>{{ error }}</p>
    </div>

    <div class="properties-grid">
      <PropertyCard v-for="property in documents" :key="property.id" :property="property" />
    </div>

    <div v-if="loading && documents.length === 0" class="loading-indicator">
      <div class="spinner"></div>
    </div>

    <div v-if="!loading && documents.length === 0 && !error" class="empty-state">
      <p>No properties found. Try adjusting your filters.</p>
    </div>

    <div v-if="hasMore && !loading" class="load-more-container">
      <button @click="loadMore" class="load-more-button">Load More</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PropertyCard from '../components/PropertyCard.vue';
import FilterProperties from '../components/FilterProperties.vue';
import { useInfiniteScroll } from '../composables/useInfiniteScroll';
import { usePropertyStore } from '../stores/property';

const isFilterModalVisible = ref(false);
const { documents, loading, error, hasMore, loadMoreDocuments } = useInfiniteScroll('properties');
const propertyStore = usePropertyStore();

const applyFilters = (filters: any) => {
  propertyStore.clearCache('properties'); // Clear existing results
  loadMoreDocuments(filters);
  isFilterModalVisible.value = false;
};

const loadMore = () => {
  loadMoreDocuments();
};
</script>

<style scoped>
.properties-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
  background: linear-gradient(to bottom, #f5f7fa 0%, #ffffff 100%);
  min-height: 100vh;
}

@media (min-width: 768px) {
  .properties-page {
    padding: 2rem 1.5rem;
  }
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-top: 1rem;
}

@media (min-width: 768px) {
  .page-header {
    margin-bottom: 3rem;
  }
}

.page-title {
  font-size: 1.875rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.03em;
}

@media (min-width: 768px) {
  .page-title {
    font-size: 2.75rem;
  }
}

.filter-button {
  background: linear-gradient(135deg, var(--primary-blue), #0051d5);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.properties-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .properties-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .properties-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}

.loading-indicator, .error-state, .empty-state {
  text-align: center;
  padding: 4rem 1rem;
  font-size: 1.125rem;
  color: var(--text-secondary);
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
  width: 48px;
  height: 48px;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.load-more-container {
  text-align: center;
  margin-top: 3rem;
  padding: 2rem 0;
}

.load-more-button {
  background: linear-gradient(135deg, var(--primary-blue), #0051d5);
  color: white;
  padding: 1rem 2.5rem;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 122, 255, 0.3);
  letter-spacing: 0.02em;
  min-height: 52px;
  min-width: 160px;
}

.load-more-button:active {
  transform: scale(0.98);
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
}

@media (min-width: 768px) {
  .load-more-button:hover {
    box-shadow: 0 8px 24px rgba(0, 122, 255, 0.4);
    transform: translateY(-2px);
  }
}
</style>
