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

    <button v-if="!allSectionsCompleted" @click="submitProperty" class="submit-btn" disabled>
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
      </div>
      <div class="form-group">
        <label>Sale or Rent</label>
        <input type="text" v-model="propertyStore.property.basic.saleOrRent" @click="openPicker('Sale or Rent', ['For Sale', 'For Rent'], 'basic.saleOrRent')" readonly class="select-input">
      </div>
      <div class="form-group">
        <label>Listing Title</label>
        <input type="text" v-model="propertyStore.property.basic.title">
      </div>
      <div class="form-group">
        <label>Detailed Description</label>
        <textarea v-model="propertyStore.property.basic.description"></textarea>
      </div>
       <div class="form-group">
        <label>Location/Address</label>
        <input type="text" v-model="propertyStore.property.basic.location">
      </div>
      <div class="form-group">
        <label>Property Size (sq. ft.)</label>
        <input type="number" v-model.number="propertyStore.property.basic.size">
      </div>
      <div class="form-group">
        <label>Number of Bedrooms</label>
        <input type="number" v-model.number="propertyStore.property.basic.bedrooms">
      </div>
      <div class="form-group">
        <label>Number of Bathrooms</label>
        <input type="number" v-model.number="propertyStore.property.basic.bathrooms">
      </div>
       <div class="form-group">
        <label>Floor Level</label>
        <input type="text" v-model="propertyStore.property.basic.floor">
      </div>
      <div class="form-group">
        <label>Age of Property</label>
        <input type="text" v-model="propertyStore.property.basic.age">
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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { usePropertyStore } from '../stores/property';
import OptionPicker from '../components/OptionPicker.vue';
import FormModal from '../components/FormModal.vue';

const router = useRouter();
const propertyStore = usePropertyStore();

const allAmenities = ['Gym', 'Pool', 'Garden', 'Lift'];
const fileInput = ref<HTMLInputElement | null>(null);
const mediaType = ref('photo');

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

const allSectionsCompleted = computed(() => {
  return Object.values(propertyStore.completedSections).every(Boolean);
});

const openSection = (section: string) => {
  if (section === 'basic') isBasicModalVisible.value = true;
  else if (section === 'pricing') isPricingModalVisible.value = true;
  else if (section === 'features') isFeaturesModalVisible.value = true;
  else if (section === 'media') isMediaModalVisible.value = true;
  else if (section === 'contact') isContactModalVisible.value = true;
  else if (section === 'legal') isLegalModalVisible.value = true;
};

const saveSection = (section: string) => {
  propertyStore.setSectionCompleted(section, true);
  if (section === 'basic') isBasicModalVisible.value = false;
  else if (section === 'pricing') isPricingModalVisible.value = false;
  else if (section === 'features') isFeaturesModalVisible.value = false;
  else if (section === 'media') isMediaModalVisible.value = false;
  else if (section === 'contact') isContactModalVisible.value = false;
  else if (section === 'legal') isLegalModalVisible.value = false;
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
    const [section, field] = activePickerField.value.split('.');
    if (section && field && propertyStore.property[section]) {
        propertyStore.property[section][field] = selectedValue;
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
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: var(--background-color);
}

.page-title {
  font-size: 2.8rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 2.5rem;
  text-align: center;
}

.form-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.section-btn, .media-btn, .submit-btn {
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

.section-btn {
  background-color: var(--white);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.section-btn.completed {
  background-color: #d4edda; /* Light green */
  color: #155724; /* Dark green */
}

.section-btn.completed:before {
  content: '\2714'; /* Checkmark */
  color: #155724;
}


.section-btn:before {
 content: '\279C'; /* Unicode arrow character */
  color: var(--primary-blue);
  font-size: 1.2rem;
}

.section-btn:hover, .media-btn:hover, .submit-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px var(--shadow-color);
}

.submit-btn {
  display: block;
  width: 100%;
  text-align: center;
  background: linear-gradient(45deg, #007aff, #00c6ff);
  color: var(--white);
  font-size: 1.2rem;
}

.submit-btn:disabled {
  background: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.preview-btn {
  background: linear-gradient(45deg, #28a745, #218838);
}

.media-btn {
  background-color: var(--primary-blue-light);
  color: var(--primary-blue);
  text-align: center;
}

.media-upload-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-secondary);
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group input[type="email"],
.form-group input[type="tel"],
.form-group textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid var(--card-border);
  border-radius: 10px;
  background-color: #fcfdff;
  transition: all 0.2s ease-in-out;
  font-size: 1rem;
  color: var(--text-primary);
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px var(--shadow-color);
}

.select-input {
  cursor: pointer;
  background-color: #f9f9f9;
}

.amenities-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.amenity-label {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.amenity-label input[type="checkbox"] {
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox-custom {
  width: 24px;
  height: 24px;
  border: 2px solid var(--card-border);
  border-radius: 6px;
  display: inline-block;
  transition: all 0.2s;
  background-color: #fcfdff;
}

.amenity-label input[type="checkbox"]:checked + .checkbox-custom {
  background-color: var(--primary-blue);
  border-color: var(--primary-blue);
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>');
  background-position: center;
  background-repeat: no-repeat;
}


.preview-section h4 {
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
}

.preview-item {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid #eee;
}
</style>
