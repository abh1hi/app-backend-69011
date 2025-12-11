<template>
  <div class="dashboard-page">
    <!-- User Profile Section -->
    <div v-if="user" class="profile-card glass-card">
      <div class="profile-header">
        <div class="profile-info-row">
          <h2 class="profile-name">{{ user.displayName || 'User' }}</h2>
          <span 
            v-if="userProfile?.role" 
            class="role-badge" 
            :class="userProfile.role"
          >
            {{ userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1) }}
          </span>
        </div>
        <p class="profile-phone">{{ user.phoneNumber || 'No phone number' }}</p>
      </div>
      <button @click="handleLogout" class="logout-button">
        <i class="fas fa-sign-out-alt"></i>
        <span>Sign Out</span>
      </button>
    </div>

    <!-- Dealer Documents Section (Visible Only for Dealers) -->
    <div v-if="userProfile?.role === 'dealer'" class="info-card glass-card">
      <div class="card-header">
        <h3>Verification Documents</h3>
        <span class="status-badge" :class="userProfile.isVerified ? 'verified' : 'pending'">
          {{ userProfile.isVerified ? 'Verified' : 'Pending Verification' }}
        </span>
      </div>
      <div class="documents-list">
        <div class="document-item" v-if="userProfile.documents?.aadharCardUrl">
          <div class="doc-icon">📄</div>
          <div class="doc-info">
            <span class="doc-title">Aadhar Card</span>
            <a :href="userProfile.documents.aadharCardUrl" target="_blank" class="doc-link">View Document</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Become a Dealer Section (Visible Only for Buyers) -->
    <div v-if="userProfile?.role === 'buyer'" class="upgrade-card glass-card">
      <div class="upgrade-content">
        <div class="upgrade-icon">💼</div>
        <div class="upgrade-text">
          <h3>Become a Dealer</h3>
          <p>Upgrade to list properties and reach thousands of buyers.</p>
        </div>
      </div>
      <button @click="showUploadSheet = true" class="upgrade-button">
        Upgrade Now
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
          :show-owner-actions="true"
          @edit="handleEdit"
          @delete="handleDelete"
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

    
    <!-- Initialize Profile Section (Visible when User exists but no Profile) -->
    <div v-if="!userProfile && user" class="info-card glass-card">
      <div class="card-header">
        <h3>Complete Your Profile</h3>
      </div>
      <p style="margin-bottom: 20px; color: var(--text-secondary);">
        It looks like your profile setup isn't complete. Please continue to set up your account.
      </p>
      <button @click="initializeProfile" class="upgrade-button">
        Continue as Buyer
      </button>
    </div>

    <IDUploadActionSheet 
      :isVisible="showUploadSheet"
      @upload-complete="handleUpgradeUpload"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import { usePropertyStore } from '../stores/property';
import { useInfiniteScroll } from '../composables/useInfiniteScroll';
import PropertyCard from '../components/PropertyCard.vue';
import IDUploadActionSheet from '../components/IDUploadActionSheet.vue';
import { ref } from 'vue';

const userStore = useUserStore();
const propertyStore = usePropertyStore();
const router = useRouter();
const user = computed(() => userStore.user);
const userProfile = computed(() => userStore.profile);

const showUploadSheet = ref(false);

const ownerId = computed(() => user.value?.uid || null);

// Get all the reactive properties from the composable
const { documents, loading, error, hasMore, loadMoreDocuments } = useInfiniteScroll('properties', { ownerId });

const handleLogout = async () => {
  await userStore.logout();
  router.push('/'); // Redirect to home after logout
};

const loadMore = () => {
  loadMoreDocuments();
};

const handleEdit = (propertyId: string) => {
  router.push({ name: 'EditProperty', params: { id: propertyId } });
};

const handleDelete = async (propertyId: string) => {
  if (confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
    try {
      // This action will be created in the property store
      await propertyStore.deleteProperty(propertyId);
      // Refresh the list after deletion
      documents.value = documents.value.filter(p => p.id !== propertyId);
      alert('Property deleted successfully.');
    } catch (err) {
      console.error("Error deleting property:", err);
      alert('Failed to delete property.');
    }
  }
};
const handleUpgradeUpload = async (file: File) => {
  try {
    await userStore.upgradeToDealer(file);
    showUploadSheet.value = false;
    alert('Upgrade request submitted! You can now list properties.');
  } catch (e) {
    console.error('Upgrade failed', e);
    alert('Failed to upgrade. Please try again.');
  }
};

const initializeProfile = async () => {
  if (!user.value) return;
  try {
    await userStore.createUserProfile(user.value.uid, { 
      role: 'buyer',
      isVerified: false 
    });
    // Profile should automatically update in store, but we can fetch to be safe
    // userStore.fetchUserProfile(user.value.uid); // fetchUserProfile updates the reactive 'profile'
  } catch (e) {
    console.error('Failed to initialize profile', e);
    alert('Failed to create profile. Please try again.');
  }
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

.upgrade-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-radius: 20px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.upgrade-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.upgrade-icon {
  font-size: 2rem;
  background: rgba(0, 122, 255, 0.1);
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.upgrade-text h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
}

.upgrade-text p {
  margin: 2px 0 0 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.upgrade-button {
  background: var(--primary-blue);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

/* Role Badge Styles */
.profile-info-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 0.5rem;
}

.role-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.role-badge.buyer {
  background: rgba(0, 122, 255, 0.1);
  color: var(--primary-blue);
}

.role-badge.dealer {
  background: rgba(52, 199, 89, 0.1);
  color: #34c759;
}

/* Info Card (Documents) Styles */
.info-card {
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-radius: 20px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.card-header h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.status-badge {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 12px;
}

.status-badge.verified {
  background: rgba(52, 199, 89, 0.1);
  color: #34c759;
}

.status-badge.pending {
  background: rgba(255, 149, 0, 0.1);
  color: #ff9500;
}

.document-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 12px;
}

.doc-icon {
  font-size: 1.5rem;
}

.doc-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.doc-title {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.doc-link {
  font-size: 0.8rem;
  color: var(--primary-blue);
  text-decoration: none;
  font-weight: 500;
}

.doc-link:hover {
  text-decoration: underline;
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
