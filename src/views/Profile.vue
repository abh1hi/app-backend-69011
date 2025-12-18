<template>
  <div class="dashboard-page">
    
    <div class="dashboard-container">
      <!-- User Profile Header -->
      <header class="profile-header-card" v-if="user">
        <div class="header-top">
          <div class="user-info">
             <div class="avatar-placeholder">
               <span class="material-symbols-outlined">person</span>
             </div>
             <div class="text-content">
               <h1 class="user-name">{{ userProfile?.displayName || user.displayName || 'User' }}</h1>
               <div class="badges-row">
                 <span v-if="userProfile?.role" class="role-pill" :class="userProfile.role">
                    {{ userProfile.role }}
                 </span>
                 <span v-if="userProfile?.role === 'dealer'" class="verification-pill" :class="{ verified: userProfile.isVerified }">
                    {{ userProfile.isVerified ? 'Verified' : 'Pending' }}
                 </span>
               </div>
             </div>
          </div>
          
          <div class="header-actions">
            <button @click="openEditProfile" class="icon-btn" title="Edit Profile">
              <span class="material-symbols-outlined">edit</span>
            </button>
            <button @click="handleLogout" class="icon-btn danger" title="Sign Out">
              <span class="material-symbols-outlined">logout</span>
            </button>
          </div>
        </div>

        <div class="contact-grid" v-if="userProfile">
          <div class="contact-item" v-if="userProfile.email">
            <span class="material-symbols-outlined">mail</span>
            <span>{{ userProfile.email }}</span>
          </div>
          <div class="contact-item" v-if="user.phoneNumber || userProfile.contactPhone">
            <span class="material-symbols-outlined">call</span>
            <span>{{ userProfile.contactPhone || user.phoneNumber }}</span>
          </div>
          <div class="contact-item full-width" v-if="userProfile.address">
            <span class="material-symbols-outlined">location_on</span>
            <span>{{ userProfile.address }}</span>
          </div>
        </div>
      </header>

      <!-- Dealer Documents (if dealer) -->
      <section v-if="userProfile?.role === 'dealer'" class="section-block">
         <div class="section-header">
           <h3>Verification Documents</h3>
         </div>
         <div class="documents-card">
            <div class="document-row" v-if="userProfile.documents?.aadharCardUrl">
               <div class="doc-icon">
                 <span class="material-symbols-outlined">description</span>
               </div>
               <div class="doc-info">
                 <span class="doc-name">Aadhar Card.pdf</span>
                 <a :href="userProfile.documents.aadharCardUrl" target="_blank" class="doc-link">View</a>
               </div>
               <span class="material-symbols-outlined check-icon">check_circle</span>
            </div>
         </div>
      </section>

      <!-- Upgrade Prompt (if buyer) -->
      <section v-if="userProfile?.role === 'buyer'" class="upgrade-section">
        <div class="upgrade-banner">
           <div class="upgrade-text">
             <h3>Become a Dealer</h3>
             <p>List properties and reach thousands of potential buyers.</p>
           </div>
           <button @click="showUploadSheet = true" class="primary-btn">Upgrade Now</button>
        </div>
      </section>

      <!-- Properties Section -->
      <section class="section-block properties-section">
        <div class="section-header">
          <h3>My Properties</h3>
          <button v-if="userProfile?.role === 'dealer'" @click="router.push('/add-property')" class="add-btn">
             <span class="material-symbols-outlined">add</span> New
          </button>
        </div>

        <div v-if="documents.length > 0" class="properties-grid">
           <PropertyCard 
            v-for="property in documents" 
            :key="property.id" 
            :property="property"
            :show-owner-actions="true"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </div>

        <div v-else-if="!loading && !error" class="empty-state">
           <span class="material-symbols-outlined empty-icon">home_work</span>
           <p>No properties listed yet.</p>
        </div>

        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
        </div>

        <div v-if="hasMore && !loading" class="load-more-row">
          <button @click="loadMore" class="load-more-btn">Load More</button>
        </div>
      </section>

    </div>

    <!-- Modals & Sheets -->
    <IDUploadActionSheet 
      :isVisible="showUploadSheet"
      @upload-complete="handleUpgradeUpload"
      @close="showUploadSheet = false"
    />

    <div v-if="!userProfile && user" class="profile-setup-card">
      <h3>Complete Setup</h3>
      <p>Finish setting up your account to continue.</p>
      <button @click="initializeProfile" class="primary-btn">Continue as Buyer</button>
    </div>

    <FormModal
      :isVisible="showEditProfileModal"
      title="Edit Profile"
      @close="showEditProfileModal = false"
      @save="saveProfileChanges"
    >
      <div class="form-group">
        <label>Full Name</label>
        <input v-model="editForm.displayName" type="text" class="input-field" placeholder="John Doe" />
      </div>

      <div class="form-group">
        <label>Email</label>
        <input v-model="editForm.email" type="email" class="input-field" placeholder="email@example.com" />
      </div>

      <div class="form-group">
        <label>Phone</label>
        <input v-model="editForm.contactPhone" type="tel" class="input-field" placeholder="+91..." />
      </div>

      <div class="form-group">
        <label>Address</label>
        <textarea v-model="editForm.address" rows="3" class="input-field textarea"></textarea>
      </div>
    </FormModal>

  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';
import { usePropertyStore } from '../stores/property';
import { useInfiniteScroll } from '../composables/useInfiniteScroll';
import PropertyCard from '../components/PropertyCard.vue';
import IDUploadActionSheet from '../components/IDUploadActionSheet.vue';
import FormModal from '../components/FormModal.vue';

const userStore = useUserStore();
console.log('[Profile.vue] userStore initialized:', userStore);
console.log('[Profile.vue] userStore keys:', Object.keys(userStore));
console.log('[Profile.vue] userStore methods:', 
  Object.keys(userStore).filter(k => typeof userStore[k] === 'function')
);
console.log('[Profile.vue] Has updateUserProfile?', 'updateUserProfile' in userStore);
console.log('[Profile.vue] updateUserProfile type:', typeof userStore.updateUserProfile);

const propertyStore = usePropertyStore();
const router = useRouter();
const user = computed(() => userStore.user);
const userProfile = computed(() => userStore.profile);

const showUploadSheet = ref(false);
const showEditProfileModal = ref(false);
const editForm = reactive({ displayName: '', email: '', contactPhone: '', address: '' });

const ownerId = computed(() => user.value?.uid || null);
const { documents, loading, error, hasMore, loadMoreDocuments } = useInfiniteScroll('properties', { ownerId });

const handleLogout = async () => {
  await userStore.logout();
  router.push('/'); 
};

const loadMore = () => loadMoreDocuments();
const handleEdit = (id: string) => router.push({ name: 'EditProperty', params: { id } });

const handleDelete = async (id: string) => {
  if (confirm('Delete this property?')) {
    try {
      await propertyStore.deleteProperty(id);
      documents.value = documents.value.filter(p => p.id !== id);
    } catch (e) {
      alert('Failed to delete property.');
    }
  }
};

const handleUpgradeUpload = async (file: File) => {
  try {
    await userStore.upgradeToDealer(file);
    showUploadSheet.value = false;
  } catch (e) {
    alert('Upgrade failed.');
  }
};

const initializeProfile = async () => {
  if (!user.value) return;
  await userStore.createUserProfile(user.value.uid, { role: 'buyer', isVerified: false });
};

const isSaving = ref(false);

const openEditProfile = () => {
  // Populate form with current user data
  editForm.displayName = userProfile.value?.displayName || user.value?.displayName || '';
  editForm.email = userProfile.value?.email || user.value?.email || '';
  editForm.contactPhone = userProfile.value?.contactPhone || user.value?.phoneNumber || '';
  editForm.address = userProfile.value?.address || '';
  showEditProfileModal.value = true;
};

const saveProfileChanges = async () => {
  if (!user.value) return;

  try {
    isSaving.value = true;
    
    // Prepare update payload
    const updates = {
      displayName: editForm.displayName,
      email: editForm.email,
      contactPhone: editForm.contactPhone,
      address: editForm.address
    };

    await userStore.updateUserProfile(user.value.uid, updates);
    
    showEditProfileModal.value = false;
    alert('Profile updated successfully!');
  } catch (error) {
    console.error('Failed to update profile:', error);
    alert('Failed to update profile. Please try again.');
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background: #f8f9fa;
  font-family: 'Outfit', sans-serif;
  padding-bottom: 80px;
}

.dashboard-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

/* Header Card */
.profile-header-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid #f0f0f0;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
}

.header-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }

.user-info { display: flex; align-items: center; gap: 1.5rem; }

.avatar-placeholder {
  width: 64px; height: 64px; background: #f0f0f0; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}
.avatar-placeholder span { font-size: 32px; color: #bababa; }

.user-name { font-size: 2rem; font-weight: 700; color: #111; margin: 0 0 6px 0; line-height: 1.1; }

.badges-row { display: flex; gap: 8px; }
.role-pill, .verification-pill {
  font-size: 0.75rem; font-weight: 600; text-transform: uppercase; padding: 4px 10px; border-radius: 100px;
}
.role-pill.buyer { background: #e3f2fd; color: #1976d2; }
.role-pill.dealer { background: #e8f5e9; color: #2e7d32; }
.verification-pill.verified { background: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9; }
.verification-pill { background: #fff3e0; color: #f57c00; }

.header-actions { display: flex; gap: 8px; }
.icon-btn {
  width: 40px; height: 40px; border-radius: 50%; border: 1px solid #eee; background: white;
  display: flex; align-items: center; justify-content: center; cursor: pointer; color: #555;
  transition: all 0.2s;
}
.icon-btn:hover { background: #f5f5f5; }
.icon-btn.danger:hover { background: #fee2e2; color: #ef4444; border-color: #fee2e2; }

/* Contact Grid */
.contact-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
  background: #fafafa; padding: 1.5rem; border-radius: 16px;
}
.contact-item { display: flex; align-items: center; gap: 10px; color: #444; font-size: 0.95rem; }
.contact-item.full-width { grid-column: 1 / -1; }
.contact-item .material-symbols-outlined { color: #888; font-size: 18px; }

/* Section Block */
.section-block { margin-bottom: 3rem; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.section-header h3 { font-size: 1.5rem; font-weight: 600; color: #111; margin: 0; }

.add-btn {
  display: flex; align-items: center; gap: 6px; padding: 8px 16px;
  background: #111; color: white; border-radius: 100px; font-weight: 500; font-size: 0.9rem; border: none; cursor: pointer;
}
.add-btn span { font-size: 18px; }

/* Upgrade Banner */
.upgrade-banner {
  background: linear-gradient(135deg, #111 0%, #333 100%);
  color: white; padding: 2rem; border-radius: 20px;
  display: flex; justify-content: space-between; align-items: center;
}
.upgrade-text h3 { margin: 0 0 8px 0; font-size: 1.5rem; }
.upgrade-text p { margin: 0; opacity: 0.8; }
.primary-btn {
  background: white; color: #111; font-weight: 600; padding: 12px 24px; border-radius: 100px; border: none; cursor: pointer;
}

/* Documents */
.documents-card { background: white; border: 1px solid #eee; border-radius: 16px; padding: 4px; }
.document-row {
  display: flex; align-items: center; gap: 16px; padding: 16px;
}
.doc-icon {
  width: 48px; height: 48px; background: #e3f2fd; color: #1976d2; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
}
.doc-info { flex: 1; display: flex; flex-direction: column; }
.doc-name { font-weight: 600; color: #111; }
.doc-link { font-size: 0.85rem; color: #666; }
.check-icon { color: #2e7d32; }

/* Properties Grid */
.properties-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px;
}
.empty-state { text-align: center; color: #888; padding: 4rem; }
.empty-icon { font-size: 48px; margin-bottom: 1rem; opacity: 0.5; }

/* Forms */
.form-group { margin-bottom: 1.5rem; }
.form-group label { display: block; margin-bottom: 8px; font-weight: 500; color: #444; font-size: 0.9rem; }
.input-field {
  width: 100%; padding: 12px; border: 1px solid #e0e0e0; border-radius: 10px; font-size: 1rem; font-family: 'Outfit';
  transition: border-color 0.2s;
}
.input-field:focus { outline: none; border-color: #111; }
.textarea { resize: vertical; }

.loading-state { display: flex; justify-content: center; padding: 2rem; }
.spinner { width: 30px; height: 30px; border: 2px solid #eee; border-top-color: #111; border-radius: 50%; animation: spin 0.8s infinite linear; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 640px) {
  .header-top { flex-direction: column; align-items: flex-start; gap: 1rem; }
  .header-actions { position: absolute; top: 2rem; right: 2rem; }
  .profile-header-card { position: relative; }
  .upgrade-banner { flex-direction: column; align-items: flex-start; gap: 1rem; }
  .contact-grid { grid-template-columns: 1fr; }
}
</style>
