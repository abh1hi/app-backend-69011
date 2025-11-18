<template>
  <div class="container">
    <h1 class="title">List a New Property</h1>
    <form @submit.prevent="submitProperty" class="form">
      <!-- Basic Information -->
      <div class="form-section">
        <h2 class="section-title">Property Basic Information</h2>
        <div class="form-grid">
          <div class="form-group">
            <label for="propertyType">Property Type*</label>
            <select id="propertyType" v-model="property.propertyType" required>
              <option>Apartment</option>
              <option>House</option>
              <option>Commercial</option>
            </select>
          </div>
          <div class="form-group">
            <label for="status">Sale or Rent*</label>
            <select id="status" v-model="property.status" required>
              <option>Sale</option>
              <option>Rent</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label for="title">Listing Title*</label>
          <input type="text" id="title" v-model="property.title" required>
        </div>
        <div class="form-group">
          <label for="description">Detailed Description*</label>
          <textarea id="description" v-model="property.description" required></textarea>
        </div>
        <div class="form-group">
          <label for="address">Location/Address*</label>
          <input type="text" id="address" v-model="property.address" required>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label for="size">Property Size (sq ft)*</label>
            <input type="number" id="size" v-model="property.size" required>
          </div>
          <div class="form-group">
            <label for="bedrooms">Bedrooms*</label>
            <input type="number" id="bedrooms" v-model="property.bedrooms" required>
          </div>
          <div class="form-group">
            <label for="bathrooms">Bathrooms*</label>
            <input type="number" id="bathrooms" v-model="property.bathrooms" required>
          </div>
        </div>
        <div class="form-grid">
            <div class="form-group">
                <label for="floor">Floor Level</label>
                <input type="number" id="floor" v-model="property.floor">
            </div>
            <div class="form-group">
                <label for="age">Age of Property (Years)</label>
                <input type="number" id="age" v-model="property.age">
            </div>
        </div>
      </div>

      <!-- Pricing and Financials -->
      <div class="form-section">
        <h2 class="section-title">Pricing and Financial Details</h2>
        <div class="form-grid">
            <div class="form-group">
                <label for="price">Price/Rent Amount ₹</label>
                <input type="number" id="price" v-model="property.price">
            </div>
            <div class="form-group">
                <label for="maintenance">Maintenance Charges</label>
                <input type="number" id="maintenance" v-model="property.maintenance">
            </div>
             <div class="form-group">
                <label for="deposit">Deposit Amount</label>
                <input type="number" id="deposit" v-model="property.deposit">
            </div>
        </div>
        <div class="form-group">
            <label for="paymentTerms">Payment Terms</label>
            <input type="text" id="paymentTerms" v-model="property.paymentTerms">
        </div>
      </div>

      <!-- Features and Amenities -->
      <div class="form-section">
        <h2 class="section-title">Property Features and Amenities</h2>
        <div class="form-grid">
            <div class="form-group">
                <label for="furnishing">Furnishing Status</label>
                <select id="furnishing" v-model="property.furnishing">
                <option>Furnished</option>
                <option>Semi-Furnished</option>
                <option>Unfurnished</option>
                </select>
            </div>
            <div class="form-group">
                <label for="parking">Parking</label>
                <select id="parking" v-model="property.parking">
                <option>Available</option>
                <option>Not Available</option>
                </select>
            </div>
        </div>
        <div class="form-group">
          <label>Additional Amenities</label>
          <div class="checkbox-group">
            <label><input type="checkbox" v-model="property.amenities.gym"> Gym</label>
            <label><input type="checkbox" v-model="property.amenities.pool"> Pool</label>
            <label><input type="checkbox" v-model="property.amenities.garden"> Garden</label>
            <label><input type="checkbox" v-model="property.amenities.lift"> Lift</label>
          </div>
        </div>
         <div class="form-group">
            <label for="security">Security Features</label>
            <input type="text" id="security" v-model="property.security">
        </div>
      </div>

      <!-- Visual Media -->
      <div class="form-section">
        <h2 class="section-title">Visual Media</h2>
        <div class="form-group">
          <label for="photos">Photos</label>
          <input type="file" id="photos" @change="handleFileUpload" multiple accept="image/*">
        </div>
        <div class="form-group">
          <label for="videos">Videos</label>
          <input type="file" id="videos" @change="handleFileUpload" multiple accept="video/*">
        </div>
      </div>

      <!-- Contact and Owner Info -->
       <div class="form-section">
        <h2 class="section-title">Contact and Owner Information</h2>
        <div class="form-grid">
          <div class="form-group">
            <label for="contactName">Owner/Agent Name*</label>
            <input type="text" id="contactName" v-model="property.contact.name" required>
          </div>
          <div class="form-group">
            <label for="contactEmail">Email*</label>
            <input type="email" id="contactEmail" v-model="property.contact.email" required>
          </div>
          <div class="form-group">
            <label for="contactPhone">Phone*</label>
            <input type="tel" id="contactPhone" v-model="property.contact.phone" required>
          </div>
        </div>
      </div>

       <!-- Legal and Documentation -->
      <div class="form-section">
        <h2 class="section-title">Legal and Documentation</h2>
        <div class="form-group">
          <label for="ownershipDocs">Ownership Documents</label>
          <input type="text" id="ownershipDocs" v-model="property.legal.ownership">
        </div>
        <div class="form-group">
          <label for="registration">Registration Details</label>
          <input type="text" id="registration" v-model="property.legal.registration">
        </div>
      </div>

      <button type="submit" class="btn-submit" :disabled="isUploading">
        {{ isUploading ? 'Submitting...' : 'Submit Property' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { collection, addDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../firebase';

interface Property {
  propertyType: 'Apartment' | 'House' | 'Commercial';
  status: 'Sale' | 'Rent';
  title: string;
  description: string;
  address: string;
  size: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  floor: number | null;
  age: number | null;
  price: number | null;
  maintenance: number | null;
  deposit: number | null;
  paymentTerms: string;
  furnishing: 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
  parking: 'Available' | 'Not Available';
  amenities: {
    gym: boolean;
    pool: boolean;
    garden: boolean;
    lift: boolean;
  };
  security: string;
  media: {
    photos: string[];
    videos: string[];
  };
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  legal: {
    ownership: string;
    registration: string;
  };
  ownerId: string;
}

const router = useRouter();
const isUploading = ref(false);

const property: Property = reactive({
  propertyType: 'Apartment',
  status: 'Sale',
  title: '',
  description: '',
  address: '',
  size: null,
  bedrooms: null,
  bathrooms: null,
  floor: null,
  age: null,
  price: null,
  maintenance: null,
  deposit: null,
  paymentTerms: '',
  furnishing: 'Unfurnished',
  parking: 'Not Available',
  amenities: {
    gym: false,
    pool: false,
    garden: false,
    lift: false,
  },
  security: '',
  media: {
    photos: [],
    videos: [],
  },
  contact: {
    name: '',
    email: '',
    phone: '',
  },
  legal: {
    ownership: '',
    registration: '',
  },
  ownerId: ''
});

const files = ref<File[]>([]);

const handleFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files) {
    files.value.push(...Array.from(target.files));
  }
};

const submitProperty = async () => {
  if (!auth.currentUser) {
    alert('You must be logged in to list a property.');
    return;
  }

  isUploading.value = true;

  try {
    const photoURLs: string[] = [];
    const videoURLs: string[] = [];

    for (const file of files.value) {
      const fileRef = storageRef(storage, `properties/${auth.currentUser.uid}/${file.name}`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      if (file.type.startsWith('image')) {
        photoURLs.push(downloadURL);
      } else if (file.type.startsWith('video')) {
        videoURLs.push(downloadURL);
      }
    }

    property.media.photos = photoURLs;
    property.media.videos = videoURLs;
    property.ownerId = auth.currentUser.uid;

    await addDoc(collection(db, 'properties'), property);

    alert('Property listed successfully!');
    router.push('/profile');
  } catch (error) {
    console.error('Error submitting property:', error);
    alert('An error occurred. Please try again.');
  } finally {
    isUploading.value = false;
  }
};

</script>

<style scoped>
.container {
  padding: 1rem;
  max-width: 900px;
  margin: 0 auto;
  background: linear-gradient(to bottom, #f5f7fa 0%, #ffffff 100%);
  min-height: 100vh;
}

@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

.title {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--text-primary);
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  padding-top: 1rem;
}

@media (min-width: 768px) {
  .title {
    font-size: 2.5rem;
    margin-bottom: 2.5rem;
  }
}

.form-section {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 0.5px solid rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@media (min-width: 768px) {
  .form-section {
    padding: 2rem;
    margin-bottom: 2rem;
  }
}

.section-title {
  color: var(--primary-blue);
  margin-bottom: 1.5rem;
  font-size: 1.375rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid rgba(0, 122, 255, 0.15);
}

@media (min-width: 768px) {
  .section-title {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

@media (min-width: 640px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .form-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 0.625rem;
  color: var(--text-primary);
  font-size: 0.9375rem;
  letter-spacing: 0.01em;
}

.form-group input, 
.form-group select, 
.form-group textarea {
  padding: 12px 14px;
  border: 1.5px solid rgba(0, 122, 255, 0.15);
  border-radius: 12px;
  font-size: 16px;
  background: rgba(0, 122, 255, 0.02);
  color: var(--text-primary);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  min-height: 44px;
  -webkit-appearance: none;
  appearance: none;
}

@media (min-width: 768px) {
  .form-group input, 
  .form-group select, 
  .form-group textarea {
    padding: 14px 16px;
    border-radius: 14px;
    font-size: 1rem;
    min-height: 48px;
  }
}

.form-group input:focus, 
.form-group select:focus, 
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-blue);
  background: var(--white);
  box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
}

textarea {
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  padding-top: 12px;
  padding-bottom: 12px;
}

@media (min-width: 768px) {
  textarea {
    min-height: 120px;
    padding-top: 14px;
    padding-bottom: 14px;
  }
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 0.5rem;
}

@media (min-width: 640px) {
  .checkbox-group {
    grid-template-columns: repeat(4, 1fr);
  }
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
  padding: 0.75rem;
  background: rgba(0, 122, 255, 0.03);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1.5px solid transparent;
}

.checkbox-group label:hover {
  background: rgba(0, 122, 255, 0.08);
  border-color: rgba(0, 122, 255, 0.2);
}

.checkbox-group input[type="checkbox"] {
  width: 20px;
  height: 20px;
  accent-color: var(--primary-blue);
  cursor: pointer;
}

.btn-submit {
  width: 100%;
  padding: 1rem 1.5rem;
  font-size: 1.125rem;
  background: linear-gradient(135deg, var(--primary-blue), #0051d5);
  color: var(--white);
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 700;
  letter-spacing: 0.02em;
  box-shadow: 0 4px 16px rgba(0, 122, 255, 0.3);
  min-height: 56px;
  margin-top: 1rem;
}

.btn-submit:active {
  transform: scale(0.98);
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
}

@media (min-width: 768px) {
  .btn-submit:hover {
    box-shadow: 0 8px 24px rgba(0, 122, 255, 0.4);
    transform: translateY(-2px);
  }
}

.btn-submit:disabled {
  background: #e0e0e0;
  color: #9e9e9e;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}
</style>
