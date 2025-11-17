<template>
  <div class="my-properties-container">
    <h2 class="section-title">My Properties</h2>
    <div v-if="loading && documents.length === 0" class="loading-state">
      <div class="spinner"></div>
      <p>Loading my properties...</p>
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
      <p>You haven't listed any properties yet.</p>
       <router-link to="/add-property" class="add-property-btn">Add a Property</router-link>
    </div>
     <div v-if="hasMore && !loading" class="load-more-container">
        <button @click="loadMore" class="load-more-button">Load More</button>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { useInfiniteScroll } from '../composables/useInfiniteScroll';
import PropertyCard from '../components/PropertyCard.vue';

const user = ref<User | null>(null);
const auth = getAuth();
const ownerId = ref<string | null>(null);

const { documents, loading, error, hasMore, loadMoreDocuments } = useInfiniteScroll('properties', { ownerId });

onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      user.value = currentUser;
      ownerId.value = currentUser.uid;
    } else {
      user.value = null;
      ownerId.value = null;
    }
  });
});

const loadMore = () => {
  loadMoreDocuments();
};
</script>

<style scoped>
.my-properties-container {
  padding: 1rem;
  background: linear-gradient(to bottom, #f5f7fa 0%, #ffffff 100%);
  min-height: 100vh;
}

@media (min-width: 768px) {
  .my-properties-container {
    padding: 2rem 1.5rem;
  }
}

.section-title {
  text-align: center;
  font-size: 1.875rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 2rem;
  letter-spacing: -0.03em;
  padding-top: 1rem;
}

@media (min-width: 768px) {
  .section-title {
    font-size: 2.5rem;
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
  width: 48px;
  height: 48px;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p, .error-state p, .empty-state p {
  font-size: 1.125rem;
  color: var(--text-secondary);
  font-weight: 500;
  margin-bottom: 1.5rem;
}

.add-property-btn {
  background: linear-gradient(135deg, var(--primary-blue), #0051d5);
  color: white;
  padding: 1rem 2rem;
  border-radius: 16px;
  text-decoration: none;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-block;
  box-shadow: 0 4px 16px rgba(0, 122, 255, 0.3);
  letter-spacing: 0.02em;
  min-height: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.add-property-btn:active {
  transform: scale(0.98);
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
}

@media (min-width: 768px) {
  .add-property-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 122, 255, 0.4);
  }
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
