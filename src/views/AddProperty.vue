<template>
  <div class="add-property-container">
    <h1 class="page-title">Add New Property</h1>

    <div class="form-sections">
      <button 
        @click="openSection('basic')" 
        class="section-btn" 
        :class="{ completed: propertyStore.completedSections.basic }"
      >
        Property Basic Information
      </button>
      <button 
        @click="openSection('pricing')" 
        class="section-btn" 
        :class="{ completed: propertyStore.completedSections.pricing }"
      >
        Pricing and Financial Details
      </button>
       <button 
        @click="openSection('features')" 
        class="section-btn" 
        :class="{ completed: propertyStore.completedSections.features }"
      >
        Property Features and Amenities
      </button>
      <button 
        @click="openSection('media')" 
        class="section-btn" 
        :class="{ completed: propertyStore.completedSections.media }"
      >
        Visual Media
      </button>
      <button 
        @click="openSection('contact')" 
        class="section-btn" 
        :class="{ completed: propertyStore.completedSections.contact }"
      >
        Contact and Owner Information
      </button>
      <button 
        @click="openSection('legal')" 
        class="section-btn" 
        :class="{ completed: propertyStore.completedSections.legal }"
      >
        Legal and Documentation Details
      </button>
    </div>

    <button v-if="!allSectionsCompleted" class="submit-btn" disabled>
      Complete all sections to continue
    </button>
    <button v-else @click="previewProperty" class="submit-btn preview-btn">
      Preview Property
    </button>

    <!-- Modals -->
    <FormModal 
      :isVisible="isBasicModalVisible" 
      title="Property Basic Information"
      @close="isBasicModalVisible = false"
      @save="saveSection('basic')"
    >
       <div class="form-group">
        <label>Property Type</label>
        <input type="text" v-model="propertyStore.property.basic.propertyType" @click="openPicker('Property Type', ['Apartment', 'House', 'Commercial'], 'basic.propertyType')" readonly class="select-input">
        <span v-if="basicErrors.propertyType" class="error-message">{{ basicErrors.propertyType }}</span>
      </div>
      <div class="form-group">
        <label>Sale or Rent</label>
        <input type="text" v-model="propertyStore.property.basic.saleOrRent" @click="openPicker('Sale or Rent', ['For Sale', 'For Rent'], 'basic.saleOrRent')" readonly class="select-input">
        <span v-if="basicErrors.saleOrRent" class="error-message">{{ basicErrors.saleOrRent }}</span>
      </div>
      <div class="form-group">
        <label>Listing Title</label>
        <input type="text" v-model="propertyStore.property.basic.title">
        <span v-if="basicErrors.title" class="error-message">{{ basicErrors.title }}</span>
      </div>
      <div class="form-group">
        <label>Detailed Description</label>
        <textarea v-model="propertyStore.property.basic.description"></textarea>
        <span v-if="basicErrors.description" class="error-message">{{ basicErrors.description }}</span>
      </div>
       <div class="form-group">
        <label>Location/Address</label>
        <input type="text" v-model="propertyStore.property.basic.location">
        <span v-if="basicErrors.location" class="error-message">{{ basicErrors.location }}</span>
      </div>
        <div class="form-group">
        <label>State</label>
        <input type="text" v-model="propertyStore.property.basic.state" @click="openPicker('State', propertyStore.availableStates, 'basic.state')" readonly class="select-input">
        <span v-if="basicErrors.state" class="error-message">{{ basicErrors.state }}</span>
      </div>
      <div class="form-group">
        <label>Property Size (sq. ft.)</label>
        <input type="number" v-model.number="propertyStore.property.basic.size">
        <span v-if="basicErrors.size" class="error-message">{{ basicErrors.size }}</span>
      </div>
      <div class="form-group">
        <label>Number of Bedrooms</label>
        <input type="number" v-model.number="propertyStore.property.basic.bedrooms">
        <span v-if="basicErrors.bedrooms" class="error-message">{{ basicErrors.bedrooms }}</span>
      </div>
      <div class="form-group">
        <label>Number of Bathrooms</label>
        <input type="number" v-model.number="propertyStore.property.basic.bathrooms">
        <span v-if="basicErrors.bathrooms" class="error-message">{{ basicErrors.bathrooms }}</span>
      </div>
       <div class="form-group">
        <label>Floor Level</label>
        <input type="text" v-model="propertyStore.property.basic.floor">
        <span v-if="basicErrors.floor" class="error-message">{{ basicErrors.floor }}</span>
      </div>
      <div class="form-group">
        <label>Age of Property</label>
        <input type="text" v-model="propertyStore.property.basic.age">
        <span v-if="basicErrors.age" class="error-message">{{ basicErrors.age }}</span>
      </div>
    </FormModal>

    <FormModal 
      :isVisible="isPricingModalVisible" 
      title="Pricing and Financial Details"
      @close="isPricingModalVisible = false"
      @save="saveSection('pricing')"
    >
      <div class="form-group">
        <label>Price (USD)</label>
        <input type="number" v-model.number="propertyStore.property.pricing.price">
      </div>
      <div class="form-group">
        <label>Maintenance Charges (monthly)</label>
        <input type="text" v-model="propertyStore.property.pricing.maintenance">
      </div>
      <div class="form-group">
        <label>Deposit Amount (for rent)</label>
        <input type="text" v-model="propertyStore.property.pricing.deposit">
      </div>
      <div class="form-group">
        <label>Payment Terms</label>
        <input type="text" v-model="propertyStore.property.pricing.paymentTerms">
      </div>
    </FormModal>

     <FormModal 
      :isVisible="isFeaturesModalVisible" 
      title="Property Features and Amenities"
      @close="isFeaturesModalVisible = false"
      @save="saveSection('features')"
    >
      <div class="form-group">
        <label>Furnishing Status</label>
        <input type="text" v-model="propertyStore.property.features.furnishing" @click="openPicker('Furnishing Status', ['Furnished', 'Semi-Furnished', 'Unfurnished'], 'features.furnishing')" readonly class="select-input">
      </div>
      <div class="form-group">
        <label>Parking Availability</label>
        <input type="text" v-model="propertyStore.property.features.parking">
      </div>
      <div class="form-group">
        <label>Security Features</label>
        <input type="text" v-model="propertyStore.property.features.security">
      </div>
      <div class="form-group">
        <label>Additional Amenities</label>
        <div class="amenities-group">
          <label v-for="amenity in allAmenities" :key="amenity" class="amenity-label">
            <input type="checkbox" :value="amenity" v-model="propertyStore.property.features.amenities">
             <span class="checkbox-custom"></span>
            {{ amenity }}
          </label>
        </div>
      </div>
    </FormModal>

    <FormModal 
      :isVisible="isMediaModalVisible" 
      title="Visual Media"
      @close="isMediaModalVisible = false"
      @save="saveSection('media')"
    >
      <div class="media-upload-buttons">
        <button @click="addMedia('photo')" class="media-btn">Add Photo</button>
        <button @click="addMedia('video')" class="media-btn">Add Video</button>
      </div>

      <div class="previews">
        <div v-if="propertyStore.property.media.photos.length" class="preview-section">
          <h4>Photo Previews</h4>
          <div class="preview-grid">
            <img v-for="(photo, index) in propertyStore.property.media.photos" :key="index" :src="photo.previewUrl" class="preview-item"/>
          </div>
        </div>
        <div v-if="propertyStore.property.media.videos.length" class="preview-section">
          <h4>Video Previews</h4>
          <div class="preview-grid">
            <video v-for="(video, index) in propertyStore.property.media.videos" :key="index" :src="video.previewUrl" class="preview-item" controls></video>
          </div>
        </div>
      </div>
    </FormModal>

    <FormModal 
      :isVisible="isContactModalVisible" 
      title="Contact and Owner Information"
      @close="isContactModalVisible = false"
      @save="saveSection('contact')"
    >
      <div class="form-group">
        <label>Name</label>
        <input type="text" v-model="propertyStore.property.contact.name">
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" v-model="propertyStore.property.contact.email">
      </div>
      <div class="form-group">
        <label>Phone</label>
        <input type="tel" v-model="propertyStore.property.contact.phone">
      </div>
      <div class="form-group">
        <label>Preferred Contact Method</label>
        <input type="text" v-model="propertyStore.property.contact.contactMethod" @click="openPicker('Preferred Contact Method', ['Email', 'Phone', 'Either'], 'contact.contactMethod')" readonly class="select-input">
      </div>
    </FormModal>

    <FormModal 
      :isVisible="isLegalModalVisible" 
      title="Legal and Documentation Details"
      @close="isLegalModalVisible = false"
      @save="saveSection('legal')"
    >
      <div class="form-group">
        <label>Ownership Documents</label>
        <input type="text" v-model="propertyStore.property.legal.ownershipDocs">
      </div>
      <div class="form-group">
        <label>Registration Details</label>
        <input type="text" v-model="propertyStore.property.legal.registration">
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
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { usePropertyStore } from '../stores/property';
import OptionPicker from '../components/OptionPicker.vue';
import FormModal from '../components/FormModal.vue';

const router = useRouter();
const propertyStore = usePropertyStore();

const allAmenities = ['Gym', 'Pool', 'Garden', 'Lift'];
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

const basicErrors = reactive({
  propertyType: '',
  saleOrRent: '',
  title: '',
  description: '',
  location: '',
  state: '',
  size: '',
  bedrooms: '',
  bathrooms: '',
  floor: '',
  age: ''
});

const allSectionsCompleted = computed(() => {
  return Object.values(propertyStore.completedSections).every(Boolean);
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

  Object.keys(basicErrors).forEach(key => {
    basicErrors[key as keyof typeof basicErrors] = '';
  });

  if (!basic.propertyType) {
    basicErrors.propertyType = 'Property type is required.';
    isValid = false;
  }
  if (!basic.saleOrRent) {
    basicErrors.saleOrRent = 'Please specify if the property is for sale or rent.';
    isValid = false;
  }
  if (!basic.title) {
    basicErrors.title = 'Listing title is required.';
    isValid = false;
  }
  if (!basic.description) {
    basicErrors.description = 'Detailed description is required.';
    isValid = false;
  }
  if (!basic.location) {
    basicErrors.location = 'Location/Address is required.';
    isValid = false;
  }
  if (!basic.state) {
    basicErrors.state = 'State is required.';
    isValid = false;
  }
  if (!basic.size || basic.size <= 0) {
    basicErrors.size = 'Valid property size is required.';
    isValid = false;
  }
    if (!basic.bedrooms || basic.bedrooms <= 0) {
    basicErrors.bedrooms = 'Valid number of bedrooms is required.';
    isValid = false;
  }
    if (!basic.bathrooms || basic.bathrooms <= 0) {
    basicErrors.bathrooms = 'Valid number of bathrooms is required.';
    isValid = false;
  }
    if (!basic.floor) {
    basicErrors.floor = 'Floor level is required.';
    isValid = false;
  }
    if (!basic.age) {
    basicErrors.age = 'Age of property is required.';
    isValid = false;
  }

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
  openPicker(
    `Add ${type}`,
    [`Take ${type}`, `Choose from Library`],
    'media'
  );
};

const handlePickerSelect = (selectedValue: string) => {
  if (activePickerField.value === 'media') {
    if (fileInput.value) {
      fileInput.value.accept = mediaType.value === 'photo' ? 'image/*' : 'video/*';
      fileInput.value.click();
    }
  } else if (activePickerField.value) {
    const [section, field] = activePickerField.value.split('.') as [PropertySection, string];
    if (section && field && propertyStore.property[section]) {
        (propertyStore.property[section] as any)[field] = selectedValue;
    }
  }
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  propertyStore.addMediaFile(mediaType.value, file);
};

const previewProperty = () => {
  router.push({ name: 'PreviewProperty' });
};

</script>

<style scoped>
.add-property-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
  background: linear-gradient(to bottom, #f5f7fa 0%, #ffffff 100%);
  min-height: 100vh;
}

.error-message {
  color: red;
  font-size: 0.8rem;
  margin-top: 4px;
}

@media (min-width: 768px) {
  .add-property-container {
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
    margin-bottom: 2.5rem;
  }
}

.form-sections {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

@media (min-width: 640px) {
  .form-sections {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
}

@media (min-width: 1024px) {
  .form-sections {
    grid-template-columns: repeat(3, 1fr);
  }
}

.section-btn, .media-btn, .submit-btn {
  padding: 16px 20px;
  font-size: 0.9375rem;
  font-weight: 600;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  text-align: left;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 0.5px solid rgba(255, 255, 255, 0.8);
  min-height: 60px;
  display: flex;
  align-items: center;
  gap: 12px;
  letter-spacing: -0.2px;
}

.section-btn {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  color: var(--text-primary);
  position: relative;
}

.section-btn:active {
  transform: scale(0.97);
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
}

@media (min-width: 768px) {
  .section-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.08);
    border-color: rgba(0, 122, 255, 0.2);
  }
}

.section-btn.completed {
  background: rgba(0, 122, 255, 0.08);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  color: var(--primary-blue);
  border-color: rgba(0, 122, 255, 0.25);
}

.section-btn.completed:before {
  content: '✓';
  font-size: 14px;
  font-weight: 700;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-blue);
  color: white;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
}

.section-btn:not(.completed):before {
  content: '';
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(0, 122, 255, 0.1);
  border-radius: 8px;
  position: relative;
}

.section-btn:not(.completed):before::after {
  content: '→';
  color: var(--primary-blue);
  font-size: 14px;
  font-weight: 600;
  position: absolute;
}

.submit-btn {
  display: block;
  width: 100%;
  text-align: center;
  background: var(--primary-blue);
  color: var(--white);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.2px;
  box-shadow: 0 4px 16px rgba(0, 122, 255, 0.25), 0 2px 8px rgba(0, 122, 255, 0.15);
  justify-content: center;
  border: none;
  min-height: 56px;
}

.submit-btn:active {
  transform: scale(0.98);
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.25);
}

@media (min-width: 768px) {
  .submit-btn:hover {
    box-shadow: 0 8px 24px rgba(0, 122, 255, 0.35), 0 4px 12px rgba(0, 122, 255, 0.2);
    transform: translateY(-2px);
  }
}

.submit-btn:disabled {
  background: rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 0.3);
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
  border-color: rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.preview-btn {
  background: #34c759;
  box-shadow: 0 4px 16px rgba(52, 199, 89, 0.25), 0 2px 8px rgba(52, 199, 89, 0.15);
}

.preview-btn:active {
  transform: scale(0.98);
  box-shadow: 0 2px 8px rgba(52, 199, 89, 0.25);
}

@media (min-width: 768px) {
  .preview-btn:hover {
    box-shadow: 0 8px 24px rgba(52, 199, 89, 0.35), 0 4px 12px rgba(52, 199, 89, 0.2);
    transform: translateY(-2px);
  }
}

.media-btn {
  background: rgba(0, 122, 255, 0.08);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: var(--primary-blue);
  text-align: center;
  justify-content: center;
  border-color: rgba(0, 122, 255, 0.2);
  font-weight: 600;
  letter-spacing: -0.2px;
}

.media-btn:active {
  transform: scale(0.97);
  background: rgba(0, 122, 255, 0.12);
}

@media (min-width: 768px) {
  .media-btn:hover {
    background: rgba(0, 122, 255, 0.12);
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 122, 255, 0.15);
  }
}

.media-upload-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-primary);
  letter-spacing: -0.2px;
  text-transform: uppercase;
  opacity: 0.7;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group input[type="email"],
.form-group input[type="tel"],
.form-group textarea {
  width: 100%;
  padding: 12px 14px;
  border: 0.5px solid rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  font-size: 16px;
  color: var(--text-primary);
  font-family: inherit;
  min-height: 44px;
  letter-spacing: -0.2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  -webkit-appearance: none;
  appearance: none;
}

@media (min-width: 768px) {
  .form-group input[type="text"],
  .form-group input[type="number"],
  .form-group input[type="email"],
  .form-group input[type="tel"],
  .form-group textarea {
    padding: 14px 16px;
    min-height: 48px;
    font-size: 1rem;
  }
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-blue);
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.08), 0 2px 8px rgba(0, 122, 255, 0.1);
  transform: translateY(-1px);
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
  line-height: 1.6;
  padding-top: 12px;
  padding-bottom: 12px;
}

@media (min-width: 768px) {
  .form-group textarea {
    min-height: 120px;
    padding-top: 14px;
    padding-bottom: 14px;
  }
}

.select-input {
  cursor: pointer;
  background: rgba(0, 122, 255, 0.04);
  border-color: rgba(0, 122, 255, 0.2);
}

.select-input:active {
  background: rgba(0, 122, 255, 0.08);
}

.amenities-group {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.875rem;
}

@media (min-width: 640px) {
  .amenities-group {
    grid-template-columns: repeat(2, 1fr);
  }
}

.amenity-label {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 14px;
  border: 0.5px solid rgba(0, 0, 0, 0.08);
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  font-weight: 500;
  letter-spacing: -0.1px;
}

.amenity-label:active {
  transform: scale(0.98);
  background: rgba(0, 122, 255, 0.1);
}

@media (min-width: 768px) {
  .amenity-label:hover {
    background: rgba(0, 122, 255, 0.08);
    border-color: rgba(0, 122, 255, 0.2);
    transform: translateY(-1px);
  }
}

.amenity-label input[type="checkbox"] {
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox-custom {
  width: 22px;
  height: 22px;
  border: 1.5px solid rgba(0, 122, 255, 0.4);
  border-radius: 6px;
  display: inline-block;
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  background-color: rgba(255, 255, 255, 0.9);
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.amenity-label input[type="checkbox"]:checked + .checkbox-custom {
  background-color: var(--primary-blue);
  border-color: var(--primary-blue);
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>');
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
  transform: scale(1.05);
}

.preview-section h4 {
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
  font-size: 0.8125rem;
  letter-spacing: -0.3px;
  text-transform: uppercase;
  opacity: 0.7;
  margin-top: 24px;
}

.preview-section:first-child h4 {
  margin-top: 0;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (min-width: 640px) {
  .preview-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .preview-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.preview-item {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 14px;
  border: 0.5px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  background: rgba(255, 255, 255, 0.5);
}

.preview-item:active {
  transform: scale(0.97);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}
</style>
