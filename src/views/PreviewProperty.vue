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
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 3000;
}

.spinner {
  border: 6px solid #f3f3f3;
  border-top: 6px solid var(--primary-blue);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-overlay p {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
}

.preview-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: var(--white);
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.08);
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 2rem;
  text-align: center;
}

.detail-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e9ecef;
}

.detail-section:last-child {
  border-bottom: none;
}

.section-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--primary-blue);
  margin-bottom: 1.5rem;
}

.detail-section p {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text-secondary);
}

.detail-section p strong {
  color: var(--text-primary);
  font-weight: 600;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
}

.media-item {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid #eee;
}

.submit-btn {
  display: block;
  width: 100%;
  padding: 1rem;
  font-size: 1.2rem;
  font-weight: 700;
  text-align: center;
  background: linear-gradient(45deg, #28a745, #218838);
  color: var(--white);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(40, 167, 69, 0.3);
}

.submit-btn:disabled {
  background: #e9ecef;
  cursor: not-allowed;
  box-shadow: none;
}

.submit-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4);
}
</style>
