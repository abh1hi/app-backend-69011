<template>
  <div class="add-property-page">
    <div class="add-property-container">
      <header class="page-header">
        <button class="back-btn" @click="$router.back()">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 class="page-title">Add Property</h1>
      </header>

      <div class="progress-overview">
         <div class="progress-text">
            <span>Completion Status</span>
            <span class="percentage">{{ completionPercentage }}%</span>
         </div>
         <div class="progress-track">
            <div class="progress-fill" :style="{ width: completionPercentage + '%' }"></div>
         </div>
      </div>

      <div class="form-grid">
        <button @click="openSection('basic')" class="section-card" :class="{ completed: propertyStore.completedSections.basic }">
           <div class="icon-box">
             <span class="material-symbols-outlined">info</span>
           </div>
           <div class="card-info">
             <h3>Basic Details</h3>
             <p>Location, type, size</p>
           </div>
           <div class="status-indicator">
             <span class="material-symbols-outlined" v-if="propertyStore.completedSections.basic">check_circle</span>
             <span class="material-symbols-outlined pending" v-else>arrow_forward_ios</span>
           </div>
        </button>

        <button @click="openSection('pricing')" class="section-card" :class="{ completed: propertyStore.completedSections.pricing }">
           <div class="icon-box">
             <span class="material-symbols-outlined">payments</span>
           </div>
           <div class="card-info">
             <h3>Pricing & Financials</h3>
             <p>Price, deposit, and terms</p>
           </div>
           <span class="material-symbols-outlined status-icon">check_circle</span>
        </button>

        <button @click="openSection('features')" class="section-card" :class="{ completed: propertyStore.completedSections.features }">
           <div class="icon-box">
             <span class="material-symbols-outlined">star</span>
           </div>
           <div class="card-info">
             <h3>Features & Amenities</h3>
             <p>Parking, furnishing, etc.</p>
           </div>
           <span class="material-symbols-outlined status-icon">check_circle</span>
        </button>

        <button @click="openSection('media')" class="section-card" :class="{ completed: propertyStore.completedSections.media }">
           <div class="icon-box">
             <span class="material-symbols-outlined">image</span>
           </div>
           <div class="card-info">
             <h3>Visual Media</h3>
             <p>Photos and videos</p>
           </div>
           <span class="material-symbols-outlined status-icon">check_circle</span>
        </button>

         <button @click="openSection('contact')" class="section-card" :class="{ completed: propertyStore.completedSections.contact }">
           <div class="icon-box">
             <span class="material-symbols-outlined">contact_page</span>
           </div>
           <div class="card-info">
             <h3>Contact Details</h3>
             <p>Owner info and preferences</p>
           </div>
           <span class="material-symbols-outlined status-icon">check_circle</span>
        </button>

         <button @click="openSection('legal')" class="section-card" :class="{ completed: propertyStore.completedSections.legal }">
           <div class="icon-box">
             <span class="material-symbols-outlined">gavel</span>
           </div>
           <div class="card-info">
             <h3>Legal Info</h3>
             <p>Documents and registration</p>
           </div>
           <span class="material-symbols-outlined status-icon">check_circle</span>
        </button>
      </div>
    
      <div class="action-footer">
        <div v-if="!allSectionsCompleted" class="progress-message">
          <span class="material-symbols-outlined">pending</span>
          Complete all sections to preview
        </div>
        <button v-else @click="previewProperty" class="primary-btn">
          Preview Property
          <span class="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>

    </div>

    <!-- Modals -->
    <FormModal 
      :isVisible="isBasicModalVisible" 
      title="Basic Information"
      @close="isBasicModalVisible = false"
      @save="saveSection('basic')"
    >
       <div class="form-group">
        <label>Property Type</label>
        <div class="input-wrapper" @click="openPicker('Property Type', propertyStore.propertyTypes, 'basic.propertyType')">
           <input type="text" v-model="propertyStore.property.basic.propertyType" readonly placeholder="Select Type" class="input-field cursor-pointer">
           <span class="material-symbols-outlined chevron">expand_more</span>
        </div>
        <span v-if="basicErrors.propertyType" class="error-msg">{{ basicErrors.propertyType }}</span>
      </div>

       <div class="form-group">
        <label>Sale or Rent</label>
         <div class="input-wrapper" @click="openPicker('Sale or Rent', ['For Sale', 'For Rent'], 'basic.saleOrRent')">
           <input type="text" v-model="propertyStore.property.basic.saleOrRent" readonly placeholder="Select Option" class="input-field cursor-pointer">
           <span class="material-symbols-outlined chevron">expand_more</span>
        </div>
        <span v-if="basicErrors.saleOrRent" class="error-msg">{{ basicErrors.saleOrRent }}</span>
      </div>

      <div class="form-group">
        <label>Title</label>
        <input type="text" v-model="propertyStore.property.basic.title" class="input-field" placeholder="e.g. Luxury 3BHK Villa">
        <span v-if="basicErrors.title" class="error-msg">{{ basicErrors.title }}</span>
      </div>

      <div class="form-group">
        <label>Description</label>
        <textarea v-model="propertyStore.property.basic.description" class="input-field textarea" placeholder="Describe the property..."></textarea>
        <span v-if="basicErrors.description" class="error-msg">{{ basicErrors.description }}</span>
      </div>
      
      <div class="form-group">
          <label>Location</label>
          <LocationPicker @location-selected="handleLocationSelected" />
          <span v-if="basicErrors.location" class="error-msg">{{ basicErrors.location }}</span>
          <div v-if="isCheckingDuplicates" class="validating-msg">Verifying address...</div>
      </div>

      <div class="row-2">
         <div class="form-group">
            <label>City</label>
            <input type="text" v-model="propertyStore.property.basic.city" readonly class="input-field readonly">
             <span v-if="basicErrors.city" class="error-msg">{{ basicErrors.city }}</span>
         </div>
         <div class="form-group">
            <label>State</label>
            <input type="text" v-model="propertyStore.property.basic.state" readonly class="input-field readonly">
             <span v-if="basicErrors.state" class="error-msg">{{ basicErrors.state }}</span>
         </div>
      </div>

       <div class="row-2">
          <div class="form-group">
            <label>Pincode</label>
            <input type="text" v-model="propertyStore.property.basic.pincode" readonly class="input-field readonly">
             <span v-if="basicErrors.pincode" class="error-msg">{{ basicErrors.pincode }}</span>
          </div>
           <div class="form-group">
            <label>Floor</label>
            <input type="text" v-model="propertyStore.property.basic.floor" class="input-field" placeholder="e.g. 1st">
             <span v-if="basicErrors.floor" class="error-msg">{{ basicErrors.floor }}</span>
          </div>
       </div>

      <div class="form-group">
        <label>Size</label>
        <div class="flex-input-group">
          <input type="number" v-model.number="propertyStore.property.basic.size" placeholder="Area" class="input-field flex-grow">
          <div class="unit-selector" @click="openPicker('Size Unit', propertyStore.measurementUnits, 'basic.sizeUnit')">
             <span>{{ propertyStore.property.basic.sizeUnit || 'Unit' }}</span>
             <span class="material-symbols-outlined">expand_more</span>
          </div>
        </div>
        <span v-if="basicErrors.size" class="error-msg">{{ basicErrors.size }}</span>
      </div>

      <div class="row-2">
          <div class="form-group">
            <label>Bedrooms</label>
            <input type="number" v-model.number="propertyStore.property.basic.bedrooms" class="input-field">
            <span v-if="basicErrors.bedrooms" class="error-msg">{{ basicErrors.bedrooms }}</span>
          </div>
          <div class="form-group">
            <label>Bathrooms</label>
            <input type="number" v-model.number="propertyStore.property.basic.bathrooms" class="input-field">
            <span v-if="basicErrors.bathrooms" class="error-msg">{{ basicErrors.bathrooms }}</span>
          </div>
      </div>

      <div class="form-group">
        <label>Age of Property</label>
        <input type="text" v-model="propertyStore.property.basic.age" class="input-field" placeholder="e.g. 5 Years">
        <span v-if="basicErrors.age" class="error-msg">{{ basicErrors.age }}</span>
      </div>
    </FormModal>

    <FormModal 
      :isVisible="isPricingModalVisible" 
      title="Pricing"
      @close="isPricingModalVisible = false"
      @save="saveSection('pricing')"
    >
      <div class="form-group">
        <label>Price (₹)</label>
        <input type="number" v-model.number="propertyStore.property.pricing.price" class="input-field" placeholder="0">
      </div>
      <div class="form-group">
        <label>Maintenance (Monthly)</label>
        <input type="text" v-model="propertyStore.property.pricing.maintenance" class="input-field" placeholder="e.g. 2000">
      </div>
      <div class="form-group">
        <label>Deposit (if Rent)</label>
        <input type="text" v-model="propertyStore.property.pricing.deposit" class="input-field" placeholder="e.g. 50000">
      </div>
      <div class="form-group">
        <label>Payment Terms</label>
        <input type="text" v-model="propertyStore.property.pricing.paymentTerms" class="input-field" placeholder="e.g. Monthly Advance">
      </div>
    </FormModal>

     <FormModal 
      :isVisible="isFeaturesModalVisible" 
      title="Features"
      @close="isFeaturesModalVisible = false"
      @save="saveSection('features')"
    >
      <div class="form-group">
        <label>Furnishing</label>
         <div class="input-wrapper" @click="openPicker('Furnishing Status', ['Furnished', 'Semi-Furnished', 'Unfurnished'], 'features.furnishing')">
           <input type="text" v-model="propertyStore.property.features.furnishing" readonly placeholder="Select" class="input-field cursor-pointer">
           <span class="material-symbols-outlined chevron">expand_more</span>
        </div>
      </div>
      <div class="form-group">
        <label>Parking</label>
        <input type="text" v-model="propertyStore.property.features.parking" class="input-field" placeholder="e.g. Covered, 2 Cars">
      </div>
      <div class="form-group">
        <label>Security</label>
        <input type="text" v-model="propertyStore.property.features.security" class="input-field" placeholder="e.g. CCTV, Guard">
      </div>
      
      <div class="form-group">
        <label>Amenities</label>
        <div class="amenities-grid">
           <label v-for="amenity in allAmenities" :key="amenity" class="amenity-checkbox">
             <input type="checkbox" :value="amenity" v-model="propertyStore.property.features.amenities" hidden>
             <span class="chip" :class="{ active: propertyStore.property.features.amenities.includes(amenity) }">{{ amenity }}</span>
           </label>
        </div>
        
        <div class="custom-amenity-row">
            <input type="text" v-model="newAmenity" placeholder="Add custom amenity" class="input-field" @keyup.enter="addCustomAmenity">
            <button @click="addCustomAmenity" type="button" class="add-icon-btn">
               <span class="material-symbols-outlined">add</span>
            </button>
        </div>

         <div class="active-amenities-list">
             <span v-for="amenity in propertyStore.property.features.amenities" :key="amenity" class="active-chip">
               {{ amenity }} 
               <span @click="removeAmenity(amenity)" class="remove-x">&times;</span>
             </span>
          </div>
      </div>
    </FormModal>

    <FormModal 
      :isVisible="isMediaModalVisible" 
      title="Visual Media"
      @close="isMediaModalVisible = false"
      @save="saveSection('media')"
    >
      <div class="media-actions">
        <button @click="addMedia('photo')" class="secondary-btn">
           <span class="material-symbols-outlined">add_a_photo</span> Add Photo
        </button>
        <button @click="addMedia('video')" class="secondary-btn">
           <span class="material-symbols-outlined">videocam</span> Add Video
        </button>
      </div>

      <div class="media-previews" v-if="propertyStore.property.media.photos.length">
         <h4>Photos</h4>
         <div class="preview-scroll">
           <div v-for="(photo, index) in propertyStore.property.media.photos" :key="index" class="preview-card">
              <img :src="photo.previewUrl" class="preview-img"/>
           </div>
         </div>
      </div>

       <div class="media-previews" v-if="propertyStore.property.media.videos.length">
         <h4>Videos</h4>
         <div class="preview-scroll">
           <div v-for="(video, index) in propertyStore.property.media.videos" :key="index" class="preview-card">
             <video :src="video.previewUrl" class="preview-img"></video>
           </div>
         </div>
      </div>
    </FormModal>

    <FormModal 
      :isVisible="isContactModalVisible" 
      title="Contact Info"
      @close="isContactModalVisible = false"
      @save="saveSection('contact')"
    >
      <div class="form-group">
        <label>Name</label>
        <input type="text" v-model="propertyStore.property.contact.name" class="input-field">
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" v-model="propertyStore.property.contact.email" class="input-field">
      </div>
      <div class="form-group">
        <label>Phone</label>
        <input type="tel" v-model="propertyStore.property.contact.phone" class="input-field">
      </div>
      <div class="form-group">
        <label>Preferred Contact</label>
         <div class="input-wrapper" @click="openPicker('Preferred Contact Method', ['Email', 'Phone', 'Either'], 'contact.contactMethod')">
           <input type="text" v-model="propertyStore.property.contact.contactMethod" readonly placeholder="Select" class="input-field cursor-pointer">
           <span class="material-symbols-outlined chevron">expand_more</span>
        </div>
      </div>
    </FormModal>

    <FormModal 
      :isVisible="isLegalModalVisible" 
      title="Legal Info"
      @close="isLegalModalVisible = false"
      @save="saveSection('legal')"
    >
      <div class="form-group">
        <label>Ownership Docs</label>
        <input type="text" v-model="propertyStore.property.legal.ownershipDocs" class="input-field" placeholder="e.g. Sale Deed">
      </div>
      <div class="form-group">
        <label>Registration</label>
        <input type="text" v-model="propertyStore.property.legal.registration" class="input-field" placeholder="Registration number">
      </div>
    </FormModal>

    <OptionPicker 
      :isVisible="isPickerVisible" 
      :title="pickerTitle" 
      :options="pickerOptions"
      @close="isPickerVisible = false"
      @select="handlePickerSelect"
    />

    <input type="file" ref="fileInput" @change="handleFileChange" hidden>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePropertyStore } from '../stores/property';
import OptionPicker from '../components/OptionPicker.vue';
import FormModal from '../components/FormModal.vue';
import LocationPicker from '../components/LocationPicker.vue';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

interface LocationData {
  address: string;
  placeId: string;
  city: string;
  state: string;
  pincode: string;
}

const router = useRouter();
const propertyStore = usePropertyStore();

onMounted(() => {
  propertyStore.fetchPropertyOptions();
});

const allAmenities = ['Gym', 'Pool', 'Garden', 'Lift', 'Security'];
const fileInput = ref<HTMLInputElement | null>(null);
const mediaType = ref<'photo' | 'video'>('photo');
type PropertySection = 'basic' | 'pricing' | 'features' | 'media' | 'contact' | 'legal';

const isBasicModalVisible = ref(false);
const isPricingModalVisible = ref(false);
const isFeaturesModalVisible = ref(false);
const isMediaModalVisible = ref(false);
const isContactModalVisible = ref(false);
const isLegalModalVisible = ref(false);
const isPickerVisible = ref(false);
const pickerTitle = ref('');
const pickerOptions = ref<string[]>([]);
const activePickerField = ref<string | null>(null);
const selectedLocation = ref<LocationData | null>(null);
const duplicateError = ref('');
const isCheckingDuplicates = ref(false);
const newAmenity = ref('');

const addCustomAmenity = () => {
  const trimmed = newAmenity.value.trim();
  if (trimmed && !propertyStore.property.features.amenities.includes(trimmed)) {
    propertyStore.property.features.amenities.push(trimmed);
  }
  newAmenity.value = '';
};

const removeAmenity = (amenity: string) => {
  propertyStore.property.features.amenities = propertyStore.property.features.amenities.filter(a => a !== amenity);
};

const basicErrors = reactive({
  propertyType: '', saleOrRent: '', title: '', description: '', location: '', state: '', city: '', pincode: '', size: '', bedrooms: '', bathrooms: '', floor: '', age: ''
});

const allSectionsCompleted = computed(() => {
  // Check if at least basic, pricing, and contact are done (simplified requirement for UX)
  // or use strict approach:
  return Object.values(propertyStore.completedSections).every(Boolean);
});

const completionPercentage = computed(() => {
    const total = 6; // basic, pricing, features, media, contact, legal
    const completed = Object.values(propertyStore.completedSections).filter(Boolean).length;
    return Math.round((completed / total) * 100);
});

const openSection = (section: PropertySection) => {
  if (section === 'basic') {
    propertyStore.fetchAvailableStates();
    isBasicModalVisible.value = true;
  }
  else if (section === 'pricing') isPricingModalVisible.value = true;
  else if (section === 'features') isFeaturesModalVisible.value = true;
  else if (section === 'media') isMediaModalVisible.value = true;
  else if (section === 'contact') isContactModalVisible.value = true;
  else if (section === 'legal') isLegalModalVisible.value = true;
};

const validateBasicSection = () => {
  const basic = propertyStore.property.basic;
  let isValid = true;
  Object.keys(basicErrors).forEach(key => basicErrors[key as keyof typeof basicErrors] = '');

  if (!basic.propertyType) { basicErrors.propertyType = 'Required'; isValid = false; }
  if (!basic.saleOrRent) { basicErrors.saleOrRent = 'Required'; isValid = false; }
  if (!basic.title) { basicErrors.title = 'Required'; isValid = false; }
  if (!basic.description) { basicErrors.description = 'Required'; isValid = false; }
  if (!selectedLocation.value?.placeId) { basicErrors.location = 'Required'; isValid = false; }
  if (duplicateError.value) { basicErrors.location = duplicateError.value; isValid = false; }
  if (!basic.state) { basicErrors.state = 'Required'; isValid = false; }
  if (!basic.city) { basicErrors.city = 'Required'; isValid = false; }
  if (!basic.pincode) { basicErrors.pincode = 'Required'; isValid = false; }
  if (!basic.size) { basicErrors.size = 'Required'; isValid = false; }
  if (!basic.bedrooms) { basicErrors.bedrooms = 'Required'; isValid = false; }
  if (!basic.bathrooms) { basicErrors.bathrooms = 'Required'; isValid = false; }
  if (!basic.floor) { basicErrors.floor = 'Required'; isValid = false; }
  if (!basic.age) { basicErrors.age = 'Required'; isValid = false; }

  return isValid;
};

const saveSection = (section: PropertySection) => {
  if (section === 'basic') {
    if (validateBasicSection()) {
      propertyStore.setSectionCompleted(section, true);
      isBasicModalVisible.value = false;
    }
  } else {
    propertyStore.setSectionCompleted(section, true);
    if (section === 'pricing') isPricingModalVisible.value = false;
    else if (section === 'features') isFeaturesModalVisible.value = false;
    else if (section === 'media') isMediaModalVisible.value = false;
    else if (section === 'contact') isContactModalVisible.value = false;
    else if (section === 'legal') isLegalModalVisible.value = false;
  }
};

const openPicker = (title: string, options: string[], field: string) => {
  pickerTitle.value = title;
  pickerOptions.value = options;
  activePickerField.value = field;
  isPickerVisible.value = true;
};

const addMedia = (type: 'photo' | 'video') => {
  mediaType.value = type;
  openPicker(`Add ${type}`, [`Camera`, `Gallery`], 'media');
};

const handlePickerSelect = (val: string) => {
  if (activePickerField.value === 'media') {
    if (fileInput.value) {
      fileInput.value.accept = mediaType.value === 'photo' ? 'image/*' : 'video/*';
      fileInput.value.click();
    }
  } else if (activePickerField.value) {
    const [sec, field] = activePickerField.value.split('.') as [PropertySection, string];
    if (sec && field && propertyStore.property[sec]) (propertyStore.property[sec] as any)[field] = val;
  }
};

const handleFileChange = (e: Event) => {
  const f = (e.target as HTMLInputElement).files?.[0];
  if (f) propertyStore.addMediaFile(mediaType.value, f);
};

const previewProperty = () => {
  if (selectedLocation.value?.placeId) propertyStore.setPropertyId(selectedLocation.value.placeId);
  router.push({ name: 'PreviewProperty' });
};

const handleLocationSelected = async (loc: LocationData) => {
  selectedLocation.value = loc;
  propertyStore.updateProperty('basic', {
    location: loc.address, state: loc.state, city: loc.city, pincode: loc.pincode
  });
  duplicateError.value = '';
  await checkForDuplicate();
};

const checkForDuplicate = async () => {
  if (!selectedLocation.value?.placeId) return;
  isCheckingDuplicates.value = true;
  try {
    const snap = await getDoc(doc(db, "properties", selectedLocation.value.placeId));
    if (snap.exists()) duplicateError.value = 'Property address already listed.';
  } catch (err) {
    console.error(err);
  } finally {
    isCheckingDuplicates.value = false;
  }
};
</script>

<style scoped>
.add-property-page {
  min-height: 100vh;
  background: #f8f9fa;
  font-family: 'Outfit', sans-serif;
}

.add-property-container {
  max-width: 800px;
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

/* Grid */
.form-grid {
  display: grid; grid-template-columns: 1fr; gap: 1rem;
}

@media (min-width: 640px) {
  .form-grid { grid-template-columns: 1fr 1fr; }
}

.section-card {
  display: flex; align-items: center; gap: 1rem;
  padding: 1.25rem;
  background: white; border: 1px solid #eee; border-radius: 16px;
  text-align: left; cursor: pointer; transition: all 0.2s; position: relative;
}

.section-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

.icon-box {
  width: 48px; height: 48px; background: #f0f0f0; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; color: #555;
  flex-shrink: 0;
}

.card-info h3 { margin: 0 0 4px 0; font-size: 1rem; color: #111; }
.card-info p { margin: 0; font-size: 0.8rem; color: #888; }

.status-icon {
  position: absolute; top: 1rem; right: 1rem; font-size: 20px; color: #e0e0e0;
}

.section-card.completed .status-icon { color: #2e7d32; }
.section-card.completed { border-color: #2e7d32; background: #f1f8e9; }
.section-card.completed .icon-box { background: white; color: #2e7d32; }

/* Action Footer */
.action-footer {
  margin-top: 2rem;
  padding: 1.5rem;
  background: white; border-radius: 16px; border: 1px solid #eee;
  display: flex; justify-content: center;
}

.progress-message { display: flex; align-items: center; gap: 8px; color: #888; font-size: 0.9rem; }
.primary-btn {
  background: #111; color: white; border: none; padding: 12px 32px; border-radius: 100px;
  font-weight: 600; font-size: 1rem; cursor: pointer; display: flex; align-items: center; gap: 8px;
}

/* Form Styles */
.form-group { margin-bottom: 1.25rem; }
.form-group label { display: block; margin-bottom: 6px; font-weight: 500; font-size: 0.9rem; color: #444; }

.input-field {
  width: 100%; padding: 12px; border: 1px solid #e0e0e0; border-radius: 10px; font-size: 1rem; font-family: 'Outfit'; background: white;
}
.input-field:focus { outline: none; border-color: #111; }
.input-field.readonly { background: #f9f9f9; cursor: default; }

.input-wrapper { position: relative; }
.cursor-pointer { cursor: pointer; }
.chevron { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #888; pointer-events: none; }

.textarea { resize: vertical; min-height: 80px; }
.error-msg { color: #ef4444; font-size: 0.8rem; margin-top: 4px; display: block; }
.validating-msg { color: #f57c00; font-size: 0.8rem; margin-top: 4px; }

.row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

.flex-input-group { display: flex; gap: 8px; }
.flex-grow { flex: 1; }
.unit-selector {
  display: flex; align-items: center; gap: 4px; padding: 0 12px;
  background: #f0f0f0; border-radius: 10px; cursor: pointer; font-size: 0.9rem; font-weight: 500;
}

/* Amenities */
.amenities-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.chip {
  padding: 6px 14px; background: white; border: 1px solid #e0e0e0; border-radius: 100px;
  font-size: 0.9rem; cursor: pointer; transition: all 0.2s;
}
.chip.active { background: #111; color: white; border-color: #111; }

.custom-amenity-row { display: flex; gap: 8px; margin-bottom: 12px; }
.add-icon-btn {
  width: 44px; height: 44px; background: #111; color: white; border-radius: 10px; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.active-amenities-list { display: flex; flex-wrap: wrap; gap: 6px; }
.active-chip {
  background: #eef; padding: 4px 10px; border-radius: 6px; font-size: 0.85rem; display: flex; align-items: center; gap: 6px;
}
.remove-x { color: red; font-weight: bold; cursor: pointer; }

/* Media */
.media-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
.secondary-btn {
  padding: 12px; border: 1px solid #e0e0e0; background: white; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; font-weight: 500;
}
.preview-scroll {
  display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px;
}
.preview-card {
  width: 100px; height: 100px; flex-shrink: 0; border-radius: 10px; overflow: hidden; border: 1px solid #eee;
}
.preview-img { width: 100%; height: 100%; object-fit: cover; }
</style>
