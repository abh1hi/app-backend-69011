<template>
  <div class="dashboard-page">
    <!-- User Profile Section -->
    <div v-if="user" class="profile-card glass-card">
      <div class="profile-header">
        <h2 class="profile-name">{{ user.displayName || 'User' }}</h2>
        <p class="profile-phone">{{ user.phoneNumber || 'No phone number' }}</p>
      </div>
      <button @click="handleLogout" class="logout-button">
        <i class="fas fa-sign-out-alt"></i>
        <span>Sign Out</span>
      </button>
    </div>

    <!-- Listed Properties Section -->
    <div class="properties-section">
      <h3 class="section-title">My Listed Properties</h3>
      <div v-if="documents.length > 0" class="properties-list">
        <PropertyCard 
          v-for="property in documents" 
          :key="property.id" 
          :property="property" 
        />
      </div>
      <div v-if="loading" class="loading-indicator">
        <div class="spinner"></div>
      </div>
      <div v-if="!loading && documents.length === 0 && !error" class="no-properties">
        <p>You haven't listed any properties yet.</p>
      </div>
      <div v-if="error" class="error-state">
        <p>{{ error }}</p>
      </div>
      
      <!-- Load More Button -->
      <div v-if="hasMore && !loading" class="load-more-container">
        <button @click="loadMore" class="load-more-button">Load More</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '../stores/user';
import { useInfiniteScroll } from '../composables/useInfiniteScroll';
import PropertyCard from '../components/PropertyCard.vue';

const userStore = useUserStore();
const user = computed(() => userStore.user);

const ownerId = computed(() => user.value?.uid || null);

// Get all the reactive properties from the composable
const { documents, loading, error, hasMore, loadMoreDocuments } = useInfiniteScroll('properties', { ownerId });

const handleLogout = async () => {
  await userStore.logout();
};

const loadMore = () => {
  loadMoreDocuments();
};
</script>

<style scoped>
.dashboard-page {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.profile-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  margin-bottom: 2.5rem;
  border-radius: 20px;
}

.profile-name {
  font-size: 2rem;
  font-weight: 800;
}

.logout-button {
  background-color: #ff4d4d;
  color: white;
  border-radius: 12px;
  padding: 0.8rem 1.3rem;
}

.properties-section {
  margin-top: 2rem;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.properties-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}

.loading-indicator, .no-properties, .error-state {
  text-align: center;
  padding: 4rem 1rem;
  font-size: 1.1rem;
  color: var(--text-secondary);
}

.spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid var(--primary-blue);
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
    margin: 0 auto;
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

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
