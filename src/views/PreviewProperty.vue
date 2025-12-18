<template>
  <div class="preview-page">
    <div class="preview-container">
      <header class="page-header">
        <button class="back-btn" @click="router.back()">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 class="page-title">Review Listing</h1>
      </header>

      <div class="property-card-preview">
         <!-- Hero Image Proxy -->
         <div class="hero-preview" v-if="propertyStore.property.media.photos.length">
            <img :src="propertyStore.property.media.photos[0]?.previewUrl" class="hero-img" alt="Property Hero">
            <div class="hero-overlay">
               <span class="badge">{{ propertyStore.property.basic.saleOrRent }}</span>
            </div>
         </div>
         <div class="hero-placeholder" v-else>
           <span class="material-symbols-outlined">image</span>
           <p>No image uploaded</p>
         </div>

         <div class="content-body">
            <div class="header-section">
               <h2 class="property-title">{{ propertyStore.property.basic.title }}</h2>
               <div class="location-row">
                 <span class="material-symbols-outlined icon">location_on</span>
                 {{ propertyStore.property.basic.location }}
               </div>
               <div class="price-tag">
                 <span class="currency">₹</span>
                 {{ propertyStore.property.pricing.price?.toLocaleString() || 0 }}
               </div>
            </div>

            <div class="divider"></div>

            <div class="specs-row">
               <div class="spec-item">
                 <span class="material-symbols-outlined">bed</span>
                 <span>{{ propertyStore.property.basic.bedrooms }} Beds</span>
               </div>
               <div class="spec-item">
                 <span class="material-symbols-outlined">bathtub</span>
                 <span>{{ propertyStore.property.basic.bathrooms }} Baths</span>
               </div>
               <div class="spec-item">
                 <span class="material-symbols-outlined">square_foot</span>
                 <span>{{ propertyStore.property.basic.size }} {{ propertyStore.property.basic.sizeUnit }}</span>
               </div>
            </div>

            <div class="section-block">
               <h3>Description</h3>
               <p class="desc-text">{{ propertyStore.property.basic.description }}</p>
            </div>

            <div class="section-block">
               <h3>Details</h3>
               <div class="details-grid">
                  <div class="detail-item">
                    <span class="label">Type</span>
                    <span class="val">{{ propertyStore.property.basic.propertyType }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Status</span>
                    <span class="val">{{ propertyStore.property.basic.saleOrRent }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Furnishing</span>
                    <span class="val">{{ propertyStore.property.features.furnishing || '-' }}</span>
                  </div>
                   <div class="detail-item">
                    <span class="label">Floor</span>
                    <span class="val">{{ propertyStore.property.basic.floor || '-' }}</span>
                  </div>
               </div>
            </div>

            <div class="section-block" v-if="propertyStore.property.features.amenities.length">
               <h3>Amenities</h3>
               <div class="amenities-list">
                 <span v-for="amenity in propertyStore.property.features.amenities" :key="amenity" class="amenity-chip">
                   <span class="material-symbols-outlined">check</span> {{ amenity }}
                 </span>
               </div>
            </div>

             <div class="section-block">
               <h3>Contact</h3>
               <div class="contact-preview">
                  <div class="agent-info">
                     <div class="avatar-placeholder">{{ propertyStore.property.contact.name?.[0] || 'A' }}</div>
                     <div>
                       <div class="agent-name">{{ propertyStore.property.contact.name }}</div>
                       <div class="agent-role">Owner/Agent</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div class="action-bar-sticky">
         <div v-if="isLoading" class="loading-state">
            <div class="spinner-sm"></div> Submitting...
         </div>
         <button v-else @click="submitProperty" class="submit-btn-lg">
           Publish Listing
           <span class="material-symbols-outlined">send</span>
         </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePropertyStore } from '../stores/property';
import { getAuth } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface MediaItem {
  file: File;
  previewUrl: string;
}

const router = useRouter();
const propertyStore = usePropertyStore();
const isLoading = ref(false);

const submitProperty = async () => {
  isLoading.value = true;
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    alert('You must be logged in to submit a property.');
    isLoading.value = false;
    return;
  }

  const propertyId = propertyStore.propertyId;
  if (!propertyId) {
    alert('Error: A unique property ID was not found. Cannot submit.');
    console.error('Submission failed: propertyId is null or undefined in the store.');
    isLoading.value = false;
    return;
  }

  try {
    propertyStore.setOwnerId(user.uid);

    const storage = getStorage();
    const firestore = getFirestore();

    // Upload photos
    const photoUrls = await Promise.all(
      propertyStore.property.media.photos.map(async (photo: MediaItem) => {
        const photoRef = storageRef(storage, `properties/${user.uid}/${propertyId}/${Date.now()}_${photo.file.name}`);
        await uploadBytes(photoRef, photo.file);
        return await getDownloadURL(photoRef);
      })
    );

    // Upload videos
    const videoUrls = await Promise.all(
      propertyStore.property.media.videos.map(async (video: MediaItem) => {
        const videoRef = storageRef(storage, `properties/${user.uid}/${propertyId}/${Date.now()}_${video.file.name}`);
        await uploadBytes(videoRef, video.file);
        return await getDownloadURL(videoRef);
      })
    );

    const propertyData = {
      ...propertyStore.property,
      mediaUrls: { photos: photoUrls, videos: videoUrls },
      createdAt: serverTimestamp()
    };
    // Clean up unnecessary data before saving
    delete (propertyData as any).media;
    delete (propertyData as any).propertyId; 

    // Use setDoc with the specific placeId to create the document
    const propertyRef = doc(firestore, 'properties', propertyId);
    await setDoc(propertyRef, propertyData);

    alert('Property submitted successfully!');
    propertyStore.resetState(); // Clear the form data
    router.push('/'); // Navigate to home page

  } catch (error) {
    console.error('Error submitting property:', error);
    alert('An error occurred while submitting the property. Please try again.');
  } finally {
    isLoading.value = false;
  }
};

</script>

<style scoped>
.preview-page {
  min-height: 100vh;
  background: #f8f9fa;
  font-family: 'Outfit', sans-serif;
  padding-bottom: 100px;
}

.preview-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 1.5rem;
}

.page-header {
  display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;
}

.back-btn {
  width: 40px; height: 40px; border-radius: 50%; background: white; border: 1px solid #eee;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
}

.page-title { margin: 0; font-size: 1.5rem; font-weight: 700; color: #111; }

/* Card Preview */
.property-card-preview {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  border: 1px solid #eee;
}

.hero-preview {
  position: relative;
  height: 300px;
  width: 100%;
}

.hero-img {
  width: 100%; height: 100%; object-fit: cover;
}

.hero-overlay {
  position: absolute; top: 16px; left: 16px;
}

.badge {
  background: rgba(0,0,0,0.7); color: white; padding: 4px 12px; border-radius: 100px;
  font-size: 0.8rem; font-weight: 600; text-transform: uppercase; backdrop-filter: blur(4px);
}

.hero-placeholder {
  height: 200px; background: #f0f0f0; display: flex; flex-direction: column;
  align-items: center; justify-content: center; color: #888;
}

.content-body {
  padding: 24px;
}

.header-section { margin-bottom: 20px; }
.property-title { font-size: 1.5rem; font-weight: 700; color: #111; margin: 0 0 8px 0; line-height: 1.2; }
.location-row { display: flex; align-items: center; gap: 4px; color: #666; font-size: 0.95rem; margin-bottom: 12px; }
.location-row .icon { font-size: 18px; color: #888; }

.price-tag { font-size: 1.75rem; font-weight: 700; color: #111; }
.currency { font-size: 1rem; vertical-align: top; margin-right: 2px; }

.divider { height: 1px; background: #eee; margin: 20px 0; }

.specs-row {
  display: flex; justify-content: space-between; margin-bottom: 24px;
}
.spec-item {
  display: flex; flex-direction: column; align-items: center; gap: 6px; font-size: 0.9rem; color: #444; font-weight: 500;
}
.spec-item .material-symbols-outlined { font-size: 24px; color: #111; background: #f5f5f5; padding: 8px; border-radius: 50%; }

.section-block { margin-bottom: 24px; }
.section-block h3 { font-size: 1.1rem; font-weight: 600; margin-bottom: 12px; color: #111; }
.desc-text { color: #555; line-height: 1.6; font-size: 0.95rem; }

.details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.detail-item { background: #f9f9f9; padding: 10px 12px; border-radius: 8px; }
.detail-item .label { display: block; font-size: 0.75rem; color: #888; margin-bottom: 2px; text-transform: uppercase; }
.detail-item .val { font-size: 0.95rem; font-weight: 600; color: #111; }

.amenities-list { display: flex; flex-wrap: wrap; gap: 8px; }
.amenity-chip {
  display: flex; align-items: center; gap: 6px; padding: 6px 12px;
  background: white; border: 1px solid #e0e0e0; border-radius: 100px; font-size: 0.85rem; color: #333;
}
.amenity-chip span { font-size: 16px; color: #2e7d32; }

/* Contact Preview */
.contact-preview {
  background: #f5f5f5; padding: 16px; border-radius: 12px;
}
.agent-info { display: flex; align-items: center; gap: 12px; }
.avatar-placeholder {
  width: 48px; height: 48px; background: #ddd; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; font-weight: 700; color: #555;
}
.agent-name { font-weight: 600; color: #111; }
.agent-role { font-size: 0.8rem; color: #666; }

/* Sticky Footer */
.action-bar-sticky {
  position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
  width: 90%; max-width: 500px;
  z-index: 100;
}
.submit-btn-lg {
  width: 100%; padding: 16px; background: #111; color: white; border: none; border-radius: 100px;
  font-size: 1.1rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 10px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3); cursor: pointer; transition: transform 0.2s;
}
.submit-btn-lg:hover { transform: scale(1.02); }
.submit-btn-lg:active { transform: scale(0.98); }

.loading-state {
  width: 100%; padding: 16px; background: rgba(255,255,255,0.9); backdrop-filter: blur(10px);
  border-radius: 100px; border: 1px solid #eee; display: flex; align-items: center; justify-content: center; gap: 10px;
  font-weight: 600; color: #555;
}
.spinner-sm {
  width: 20px; height: 20px; border: 2px solid #ddd; border-top-color: #111; border-radius: 50%; animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
