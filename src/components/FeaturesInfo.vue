<template>
  <div class="form-section features-info">
    <div class="form-grid">
      <div class="form-group">
        <label for="furnishing">Furnishing</label>
        <select id="furnishing" v-model="featuresData.furnishing" @change="emitUpdate">
          <option>Fully-furnished</option>
          <option>Semi-furnished</option>
          <option>Unfurnished</option>
        </select>
      </div>
      <div class="form-group">
        <label for="parking">Parking</label>
        <select id="parking" v-model="featuresData.parking" @change="emitUpdate">
          <option>Available</option>
          <option>Not available</option>
        </select>
      </div>
       <div class="form-group">
        <label for="security">Security</label>
        <select id="security" v-model="featuresData.security" @change="emitUpdate">
          <option>24/7 Security</option>
          <option>CCTV</option>
          <option>None</option>
        </select>
      </div>
    </div>
      <div class="form-group amenities-group">
        <label>Amenities</label>
        <div class="amenities-checkboxes">
          <div v-for="amenity in allAmenities" :key="amenity" class="checkbox-item">
            <input type="checkbox" :id="amenity" :value="amenity" v-model="featuresData.amenities" @change="emitUpdate">
            <label :for="amenity">{{ amenity }}</label>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({ amenities: [] })
  }
});

const emit = defineEmits(['update']);

const allAmenities = [
  'Swimming Pool', 'Gym', 'Park', 'Lift', 'Clubhouse', 'Power Backup', 'Security'
];

const featuresData = ref({ ...props.initialData });

watch(() => props.initialData, (newData) => {
  featuresData.value = { ...newData };
  if (!featuresData.value.amenities) {
    featuresData.value.amenities = [];
  }
}, { deep: true, immediate: true });

const emitUpdate = () => {
  emit('update', featuresData.value);
};
</script>

<style scoped>
.form-section {
  padding-top: 1.5rem;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
   margin-bottom: 1.25rem;
}

@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.form-group select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #ffffff;
  font-size: 1rem;
  color: var(--text-primary);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group select:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.2);
}

.amenities-group label {
  margin-bottom: 1rem;
}

.amenities-checkboxes {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .amenities-checkboxes {
    grid-template-columns: repeat(3, 1fr);
  }
}

.checkbox-item {
  display: flex;
  align-items: center;
}

.checkbox-item input {
  margin-right: 0.5rem;
}
</style>
