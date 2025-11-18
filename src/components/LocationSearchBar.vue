<template>
  <div class="location-search-bar">
    <input
      ref="autocompleteInput"
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      placeholder="Search for a location..."
      class="search-input"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useGoogleMaps } from '../composables/useGoogleMaps';

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'place_changed']);

const autocompleteInput = ref<HTMLInputElement | null>(null);
let autocomplete: google.maps.places.Autocomplete | null = null;
const { load } = useGoogleMaps();

const placeChanged = () => {
  if (autocomplete) {
    const place = autocomplete.getPlace();
    if (place.geometry && place.geometry.location) {
      const location = {
        name: place.name,
        address: place.formatted_address,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      emit('place_changed', location);
    }
  }
};

onMounted(async () => {
  try {
    await load();
    if (autocompleteInput.value) {
      autocomplete = new google.maps.places.Autocomplete(autocompleteInput.value, {
        types: ['geocode'],
      });
      autocomplete.addListener('place_changed', placeChanged);
    }
  } catch (error) {
    console.error("Failed to load Google Maps script:", error);
  }
});

onBeforeUnmount(() => {
  if (autocomplete) {
    google.maps.event.clearInstanceListeners(autocomplete);
  }
});
</script>

<style scoped>
.location-search-bar {
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  font-size: 1rem;
  transition: box-shadow 0.2s;
}

.search-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.2);
  border-color: #007aff;
}
</style>
