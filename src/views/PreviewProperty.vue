<template>
  <div class="preview-container">
    <h1 class="page-title">Preview Property Listing</h1>

    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p>Submitting your property...</p>
    </div>

    <div class="property-details">
      <!-- Basic Information -->
      <div class="detail-section">
        <h2 class="section-title">Basic Information</h2>
        <p><strong>Property Type:</strong> {{ propertyStore.property.basic.propertyType }}</p>
        <p><strong>Sale or Rent:</strong> {{ propertyStore.property.basic.saleOrRent }}</p>
        <p><strong>Title:</strong> {{ propertyStore.property.basic.title }}</p>
        <p><strong>Description:</strong> {{ propertyStore.property.basic.description }}</p>
        <p><strong>Location:</strong> {{ propertyStore.property.basic.location }}</p>
        <p><strong>Size:</strong> {{ propertyStore.property.basic.size }} sq. ft.</p>
        <p><strong>Bedrooms:</strong> {{ propertyStore.property.basic.bedrooms }}</p>
        <p><strong>Bathrooms:</strong> {{ propertyStore.property.basic.bathrooms }}</p>
        <p><strong>Floor:</strong> {{ propertyStore.property.basic.floor }}</p>
        <p><strong>Age:</strong> {{ propertyStore.property.basic.age }}</p>
      </div>

      <!-- Pricing -->
      <div class="detail-section">
        <h2 class="section-title">Pricing</h2>
        <p><strong>Price:</strong> ${{ propertyStore.property.pricing.price }}</p>
        <p><strong>Maintenance:</strong> {{ propertyStore.property.pricing.maintenance }}</p>
        <p><strong>Deposit:</strong> {{ propertyStore.property.pricing.deposit }}</p>
        <p><strong>Payment Terms:</strong> {{ propertyStore.property.pricing.paymentTerms }}</p>
      </div>

      <!-- Features -->
      <div class="detail-section">
        <h2 class="section-title">Features & Amenities</h2>
        <p><strong>Furnishing:</strong> {{ propertyStore.property.features.furnishing }}</p>
        <p><strong>Parking:</strong> {{ propertyStore.property.features.parking }}</p>
        <p><strong>Security:</strong> {{ propertyStore.property.features.security }}</p>
        <p><strong>Amenities:</strong> {{ propertyStore.property.features.amenities.join(', ') }}</p>
      </div>

      <!-- Media -->
       <div class="detail-section">
        <h2 class="section-title">Visual Media</h2>
        <div class="media-grid">
          <div v-for="(photo, index) in propertyStore.property.media.photos" :key="`photo-${index}`">
            <img :src="photo.previewUrl" class="media-item" alt="Photo" />
          </div>
          <div v-for="(video, index) in propertyStore.property.media.videos" :key="`video-${index}`">
            <video :src="video.previewUrl" class="media-item" controls></video>
          </div>
        </div>
      </div>

      <!-- Contact -->
      <div class="detail-section">
        <h2 class="section-title">Contact Information</h2>
        <p><strong>Name:</strong> {{ propertyStore.property.contact.name }}</p>
        <p><strong>Email:</strong> {{ propertyStore.property.contact.email }}</p>
        <p><strong>Phone:</strong> {{ propertyStore.property.contact.phone }}</p>
         <p><strong>Contact Method:</strong> {{ propertyStore.property.contact.contactMethod }}</p>
      </div>

      <!-- Legal -->
      <div class="detail-section">
        <h2 class="section-title">Legal Information</h2>
        <p><strong>Ownership:</strong> {{ propertyStore.property.legal.ownershipDocs }}</p>
        <p><strong>Registration:</strong> {{ propertyStore.property.legal.registration }}</p>
      </div>
    </div>

    <button @click="submitProperty" class="submit-btn" :disabled="isLoading">Finalize and Submit</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePropertyStore } from '../stores/property';
import { getAuth } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

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

  try {
    propertyStore.setOwnerId(user.uid);

    const storage = getStorage();
    const firestore = getFirestore();

    // Upload photos
    const photoUrls = await Promise.all(
      propertyStore.property.media.photos.map(async (photo: MediaItem) => {
        const photoRef = storageRef(storage, `properties/${user.uid}/${Date.now()}_${photo.file.name}`);
        await uploadBytes(photoRef, photo.file);
        return await getDownloadURL(photoRef);
      })
    );

    // Upload videos
    const videoUrls = await Promise.all(
      propertyStore.property.media.videos.map(async (video: MediaItem) => {
        const videoRef = storageRef(storage, `properties/${user.uid}/${Date.now()}_${video.file.name}`);
        await uploadBytes(videoRef, video.file);
        return await getDownloadURL(videoRef);
      })
    );

    const propertyData = {
      ...propertyStore.property,
      mediaUrls: { photos: photoUrls, videos: videoUrls },
      createdAt: serverTimestamp()
    };
    delete (propertyData as any).media; 

    await addDoc(collection(firestore, 'properties'), propertyData);

    alert('Property submitted successfully!');
    propertyStore.resetState();
    router.push('/');
  } catch (error) {
    console.error('Error submitting property:', error);
    alert('An error occurred while submitting the property. Please try again.');
  } finally {
    isLoading.value = false;
  }
};

</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 3000;
}

.spinner {
  border: 4px solid rgba(0, 122, 255, 0.1);
  border-top: 4px solid var(--primary-blue);
  border-radius: 50%;
  width: 56px;
  height: 56px;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-overlay p {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.01em;
}

.preview-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
  background: linear-gradient(to bottom, #f5f7fa 0%, #ffffff 100%);
  min-height: 100vh;
}

@media (min-width: 768px) {
  .preview-container {
    padding: 2rem;
  }
}

.page-title {
  font-size: 1.875rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 2rem;
  text-align: center;
  letter-spacing: -0.03em;
  padding-top: 1rem;
}

@media (min-width: 768px) {
  .page-title {
    font-size: 2.5rem;
    margin-bottom: 3rem;
  }
}

.detail-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 0.5px solid rgba(255, 255, 255, 0.8);
}

@media (min-width: 768px) {
  .detail-section {
    padding: 2rem;
  }
}

.detail-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-blue);
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid rgba(0, 122, 255, 0.15);
}

@media (min-width: 768px) {
  .section-title {
    font-size: 1.5rem;
  }
}

.detail-section p {
  font-size: 1rem;
  line-height: 1.75;
  color: var(--text-secondary);
  margin-bottom: 0.875rem;
  padding: 0.75rem;
  background: rgba(0, 122, 255, 0.02);
  border-radius: 12px;
}

.detail-section p:last-child {
  margin-bottom: 0;
}

.detail-section p strong {
  color: var(--text-primary);
  font-weight: 700;
  display: inline-block;
  min-width: 140px;
  margin-right: 0.5rem;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (min-width: 640px) {
  .media-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }
}

@media (min-width: 1024px) {
  .media-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
}

.media-item {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 16px;
  border: 1.5px solid rgba(0, 122, 255, 0.15);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s;
}

.media-item:active {
  transform: scale(0.98);
}

.submit-btn {
  display: block;
  width: 100%;
  padding: 1rem 1.5rem;
  font-size: 1.125rem;
  font-weight: 700;
  text-align: center;
  background: linear-gradient(135deg, var(--primary-blue), #0051d5);
  color: var(--white);
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 122, 255, 0.3);
  letter-spacing: 0.02em;
  min-height: 56px;
  margin-top: 2rem;
}

.submit-btn:active {
  transform: scale(0.98);
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
}

@media (min-width: 768px) {
  .submit-btn:hover {
    box-shadow: 0 8px 24px rgba(0, 122, 255, 0.4);
    transform: translateY(-2px);
  }
}

.submit-btn:disabled {
  background: #e0e0e0;
  color: #9e9e9e;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}
</style>
