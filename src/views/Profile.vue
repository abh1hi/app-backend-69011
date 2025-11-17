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
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(to bottom, #f5f7fa 0%, #ffffff 100%);
  min-height: 100vh;
}

@media (min-width: 768px) {
  .dashboard-page {
    padding: 2rem 1.5rem;
  }
}

.profile-card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 0.5px solid rgba(255, 255, 255, 0.8);
}

@media (min-width: 768px) {
  .profile-card {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 2rem;
  }
}

.profile-header {
  flex: 1;
}

.profile-name {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

@media (min-width: 768px) {
  .profile-name {
    font-size: 2rem;
  }
}

.profile-phone {
  font-size: 1rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.logout-button {
  background: linear-gradient(135deg, #ff3b30, #d70015);
  color: white;
  border-radius: 16px;
  padding: 0.875rem 1.5rem;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(255, 59, 48, 0.3);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 48px;
  width: 100%;
  justify-content: center;
}

@media (min-width: 768px) {
  .logout-button {
    width: auto;
  }
}

.logout-button:active {
  transform: scale(0.98);
  box-shadow: 0 2px 8px rgba(255, 59, 48, 0.3);
}

@media (min-width: 768px) {
  .logout-button:hover {
    box-shadow: 0 8px 24px rgba(255, 59, 48, 0.4);
    transform: translateY(-2px);
  }
}

.properties-section {
  margin-top: 1rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

@media (min-width: 768px) {
  .section-title {
    font-size: 1.875rem;
    margin-bottom: 2rem;
  }
}

.properties-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .properties-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .properties-list {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}

.loading-indicator, .no-properties, .error-state {
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

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
