<template>
  <div>
    <div class="search-container">
      <input type="text" ref="searchInput" placeholder="Search for a location" />
    </div>
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const emit = defineEmits(['location-selected']);

const searchInput = ref<HTMLInputElement | null>(null);
const mapContainer = ref<HTMLElement | null>(null);
let map: google.maps.Map | null = null;
let marker: google.maps.Marker | null = null;

/**
 * Parses the address components from a Google Place or Geocoder result.
 * @param place The result object from Google Maps API.
 * @returns An object containing city, state, and pincode.
 */
function parseAddressComponents(place: google.maps.places.PlaceResult | google.maps.GeocoderResult) {
  const components = place.address_components;
  let city = '';
  let state = '';
  let pincode = '';

  if (components) {
    for (const component of components) {
      const types = component.types;
      if (types.includes('locality')) {
        city = component.long_name;
      }
      if (types.includes('administrative_area_level_1')) {
        state = component.long_name;
      }
      if (types.includes('postal_code')) {
        pincode = component.long_name;
      }
    }
  }

  // Fallback for city if 'locality' isn't available
  if (!city && components) {
     for (const component of components) {
      if (component.types.includes('administrative_area_level_2')) {
        city = component.long_name;
        break;
      }
    }
  }

  return { city, state, pincode };
}


onMounted(() => {
  if (window.google && window.google.maps && mapContainer.value && searchInput.value) {
    // Initialize the map
    map = new google.maps.Map(mapContainer.value, {
      center: { lat: 28.6139, lng: 77.2090 }, // Default to Delhi
      zoom: 12,
    });

    // Initialize the autocomplete search box
    const autocomplete = new google.maps.places.Autocomplete(searchInput.value);
    autocomplete.setFields(['place_id', 'formatted_address', 'geometry', 'address_components']);
    autocomplete.bindTo('bounds', map);

    // Listener for when a place is selected
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        if (map) {
          map.setCenter(place.geometry.location);
          map.setZoom(15);
        }
        if (marker) {
          marker.setPosition(place.geometry.location);
        } else {
          marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            draggable: true,
          });
        }
        
        const { city, state, pincode } = parseAddressComponents(place);
        emitLocation(place.geometry.location, place.formatted_address, place.place_id, city, state, pincode);
      }
    });

    // Listener for clicks on the map
    map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        if (marker) {
          marker.setPosition(e.latLng);
        } else {
          marker = new google.maps.Marker({
            map: map,
            position: e.latLng,
            draggable: true,
          });
        }
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: e.latLng }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const placeResult = results[0];
            const { city, state, pincode } = parseAddressComponents(placeResult);
            if (e.latLng) {
              emitLocation(e.latLng, placeResult.formatted_address, placeResult.place_id, city, state, pincode);
            }
          }
        });
      }
    });

  } else {
    console.error('Google Maps API not loaded.');
  }
});

function emitLocation(location: google.maps.LatLng, address: string | undefined, placeId: string | undefined, city: string, state: string, pincode: string) {
  if (address && placeId) {
    emit('location-selected', {
      latitude: location.lat(),
      longitude: location.lng(),
      address: address,
      placeId: placeId,
      city: city,
      state: state,
      pincode: pincode,
    });
  }
}
</script>

<style scoped>
.search-container {
  margin-bottom: 1rem;
}

.search-container input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border-radius: 12px;
  border: 1px solid #ccc;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.map-container {
  width: 100%;
  height: 350px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #eee;
}
</style>
