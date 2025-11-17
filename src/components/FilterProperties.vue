
<template>
  <FormModal 
    :is-visible="isVisible" 
    title="Filter Properties" 
    @save="applyFilters" 
    @close="$emit('close')"
  >
    <div class="filter-properties">
      <!-- Property Type -->
      <div class="filter-group">
        <label class="filter-label">Property Type</label>
        <div class="filter-options">
          <button
            :class="{ active: saleOrRent === 'sale' }"
            @click="saleOrRent = 'sale'"
          >
            For Sale
          </button>
          <button
            :class="{ active: saleOrRent === 'rent' }"
            @click="saleOrRent = 'rent'"
          >
            For Rent
          </button>
        </div>
      </div>

      <!-- Price -->
      <div class="filter-group">
        <label class="filter-label">Price</label>
        <div class="price-range">
          <span>${{ price.toLocaleString() }}</span>
          <input
            type="range"
            min="0"
            :max="highestPrice"
            step="10000"
            v-model.number="price"
          />
        </div>
      </div>

      <!-- State -->
      <div class="filter-group">
        <label class="filter-label">State</label>
        <select v-model="selectedState">
          <option value="">All States</option>
          <option v-for="state in propertyStore.availableStates" :key="state" :value="state">
            {{ state }}
          </option>
        </select>
      </div>

      <!-- Bedrooms and Bathrooms -->
      <div class="filter-group-row">
        <div class="filter-group">
          <label class="filter-label">Bedrooms</label>
          <div class="number-input">
            <button @click="bedrooms > 0 && bedrooms--">-</button>
            <span>{{ bedrooms }}+</span>
            <button @click="bedrooms++">+</button>
          </div>
        </div>
        <div class="filter-group">
          <label class="filter-label">Bathrooms</label>
          <div class="number-input">
            <button @click="bathrooms > 0 && bathrooms--">-</button>
            <span>{{ bathrooms }}+</span>
            <button @click="bathrooms++">+</button>
          </div>
        </div>
      </div>

      <!-- Square Footage -->
      <div class="filter-group">
        <label class="filter-label">Square Footage</label>
        <div class="range-slider">
          <div class="range-values">
            <span>{{ minSqft.toLocaleString() }} sqft</span>
            <span>{{ maxSqft.toLocaleString() }} sqft</span>
          </div>
          <div class="slider-container">
            <input
              type="range"
              :min="lowestSqft"
              :max="highestSqft"
              step="100"
              v-model.number="minSqft"
              class="min-slider"
            />
            <input
              type="range"
              :min="lowestSqft"
              :max="highestSqft"
              step="100"
              v-model.number="maxSqft"
              class="max-slider"
            />
          </div>
        </div>
      </div>

      <!-- Property Type -->
      <div class="filter-group">
        <label class="filter-label">Type</label>
        <select v-model="propertyType">
          <option value="">Any</option>
          <option>House</option>
          <option>Apartment</option>
          <option>Condo</option>
          <option>Townhouse</option>
          <option>Land</option>
        </select>
      </div>

      <!-- Amenities -->
      <div class="filter-group">
        <label class="filter-label">Amenities</label>
        <div class="amenities-grid">
          <label v-for="amenity in availableAmenities" :key="amenity" class="amenity-label">
            <input type="checkbox" :value="amenity" v-model="selectedAmenities">
            <span>{{ amenity }}</span>
          </label>
        </div>
      </div>

    </div>
  </FormModal>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import FormModal from './FormModal.vue';
import { usePropertyStore } from '../stores/property';

defineProps<{ isVisible: boolean }>();
const emit = defineEmits(['apply-filters', 'close']);

const propertyStore = usePropertyStore();

const saleOrRent = ref('sale');
const price = ref(0);
const selectedState = ref('');
const highestPrice = ref(50000000);
const bedrooms = ref(0);
const bathrooms = ref(0);
const highestSqft = ref(10000);
const lowestSqft = ref(0);
const minSqft = ref(0);
const maxSqft = ref(10000);
const propertyType = ref('');
const availableAmenities = ref(['Parking', 'Pool', 'Gym', 'Security', 'Balcony', 'Pet Friendly']);
const selectedAmenities = ref<string[]>([]);

onMounted(async () => {
  propertyStore.fetchAvailableStates();
  highestPrice.value = await propertyStore.fetchHighestPrice();
  price.value = highestPrice.value;
  highestSqft.value = await propertyStore.fetchHighestSqft();
  lowestSqft.value = await propertyStore.fetchLowestSqft();
  minSqft.value = lowestSqft.value;
  maxSqft.value = highestSqft.value;
});

watch(minSqft, (newMin) => {
  if (newMin > maxSqft.value) {
    maxSqft.value = newMin;
  }
});

watch(maxSqft, (newMax) => {
  if (newMax < minSqft.value) {
    minSqft.value = newMax;
  }
});

const applyFilters = () => {
  const saleOrRentValue = saleOrRent.value === 'sale' ? 'For Sale' : 'For Rent';
  
  emit('apply-filters', {
    saleOrRent: saleOrRentValue,
    priceRange: [0, price.value],
    state: selectedState.value,
    bedrooms: bedrooms.value,
    bathrooms: bathrooms.value,
    sqftRange: [minSqft.value, maxSqft.value],
    propertyType: propertyType.value,
    amenities: selectedAmenities.value
  });
};
</script>

<style scoped>
.filter-properties {
  padding: 1rem 0;
  max-height: 70vh;
  overflow-y: auto;
}

.filter-group {
  margin-bottom: 1.5rem;
}

.filter-label {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
}

.filter-options {
  display: flex;
  gap: 0.5rem;
}

.filter-options button {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: #f9fafb;
  color: var(--text-secondary);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-options button.active {
  background-color: var(--primary-blue);
  color: #fff;
  border-color: var(--primary-blue);
}

.price-range {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.price-range span {
  font-weight: 500;
  color: var(--text-secondary);
}

.price-range input[type="range"] {
  flex: 1;
}

.range-slider {
  position: relative;
}

.slider-container {
  position: relative;
  height: 20px;
}

.min-slider,
.max-slider {
  position: absolute;
  width: 100%;
  pointer-events: none;
  -webkit-appearance: none;
  background: transparent;
}

.min-slider::-webkit-slider-thumb {
  pointer-events: auto;
  -webkit-appearance: none;
  height: 20px;
  width: 20px;
  background: var(--primary-blue);
  border-radius: 50%;
  cursor: pointer;
}

.max-slider::-webkit-slider-thumb {
  pointer-events: auto;
  -webkit-appearance: none;
  height: 20px;
  width: 20px;
  background: var(--primary-blue);
  border-radius: 50%;
  cursor: pointer;
}

.range-values {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-secondary);
}

select, .sqft-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: #f9fafb;
  font-size: 1rem;
}

.filter-group-row {
  display: flex;
  gap: 1rem;
}

.number-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f9fafb;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  padding: 0.25rem;
}

.number-input button {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  width: 36px;
  height: 36px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
}

.number-input span {
  min-width: 40px;
  text-align: center;
  font-weight: 500;
}

.amenities-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.amenity-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f9fafb;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.amenity-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  accent-color: var(--primary-blue);
}
</style>
