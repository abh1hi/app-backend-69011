<template>
  <div class="home-search-card">
    <!-- Tabs -->
    <div class="search-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.value"
        :class="['tab-item', { active: activeTab === tab.value }]"
        @click="handleTabClick(tab.value)"
      >
        {{ tab.label }}
        <span v-if="tab.badge" class="badge" :class="tab.badgeColor">{{ tab.badge }}</span>
      </button>
    </div>

    <!-- Search Bar -->
    <div class="search-bar">
      <div class="category-dropdown">
        <select v-model="category" class="category-select">
          <option value="all">All Residential</option>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
          <option value="plot">Plot</option>
          <option value="commercial">Commercial</option>
          <option value="boys-pg">Boys PG</option>
          <option value="girls-pg">Girls PG</option>
          <option value="hostel">Hostel</option>
        </select>
        <svg class="dropdown-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <div class="search-divider"></div>

      <div class="search-input-wrapper">
        <svg class="search-icon-left" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
          <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <input 
          ref="searchInput"
          v-model="searchQuery" 
          type="text" 
          placeholder="Search 'Farm house in Punjab below 1 cr'" 
          class="search-input"
        />
        <div class="search-actions">
          <button class="icon-btn" @click="useLocation" :disabled="isLoadingLocation" title="Use my location">
            <svg v-if="!isLoadingLocation" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
            </svg>
            <svg v-else class="spinning" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="60" stroke-dashoffset="30" stroke-linecap="round"/>
            </svg>
          </button>
          <button class="icon-btn" @click="startVoiceSearch" title="Voice search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" fill="currentColor"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>

      <button @click="performSearch" class="search-btn">
        Search
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const tabs = [
  { label: 'Buy', value: 'buy' },
  { label: 'Rent', value: 'rent' },
  { label: 'New Launch', value: 'new-launch', badge: '•', badgeColor: 'red' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Plots/Land', value: 'plots' },
  { label: 'Projects', value: 'projects' },
  { label: 'Post Property', value: 'post', badge: 'FREE', badgeColor: 'green' }
];

const activeTab = ref('buy');
const category = ref('all');
const searchQuery = ref('');
const searchInput = ref<HTMLInputElement | null>(null);

// Store Google Places data
const selectedPlace = ref<{
  city?: string;
  state?: string;
  pincode?: string;
} | null>(null);

// Loading state for location detection
const isLoadingLocation = ref(false);

const useLocationFromIP = async () => {
  try {
    // Using ipapi.co for IP-based geolocation (free, no API key required)
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    if (data.city && data.region) {
      selectedPlace.value = {
        city: data.city,
        state: data.region,
        pincode: data.postal
      };
      
      // Update search input
      if (searchInput.value) {
        searchInput.value.value = `${data.city}, ${data.region}`;
        searchQuery.value = searchInput.value.value;
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error('IP geolocation error:', error);
    return false;
  }
};

const useLocation = async () => {
  isLoadingLocation.value = true;
  
  // Try GPS-based geolocation first
  if ('geolocation' in navigator) {
    try {
      await new Promise<void>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            
            // Check if Google Maps is available
            if (typeof google === 'undefined' || !google.maps) {
              console.warn('Google Maps not loaded, falling back to IP location');
              reject(new Error('Google Maps not available'));
              return;
            }
            
            // Use Google Geocoding API to reverse geocode
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode(
              { location: { lat: latitude, lng: longitude } },
              (results, status) => {
                if (status === 'OK' && results && results[0]) {
                  const addressComponents = results[0].address_components;
                  const city = addressComponents?.find(c => c.types.includes('locality'))?.long_name;
                  const state = addressComponents?.find(c => c.types.includes('administrative_area_level_1'))?.long_name;
                  const pincode = addressComponents?.find(c => c.types.includes('postal_code'))?.long_name;
                  
                  selectedPlace.value = { city, state, pincode };
                  // Update search input with formatted address
                  if (searchInput.value && city) {
                    searchInput.value.value = `${city}, ${state}`;
                    searchQuery.value = searchInput.value.value;
                  }
                  isLoadingLocation.value = false;
                  resolve();
                } else {
                  console.warn('Geocoding failed, falling back to IP location');
                  reject(new Error('Geocoding failed'));
                }
              }
            );
          },
          (error) => {
            console.warn('GPS geolocation denied or failed, trying IP-based location:', error.message);
            reject(error);
          },
          {
            timeout: 10000, // 10 second timeout
            enableHighAccuracy: false
          }
        );
      });
    } catch (gpsError) {
      // GPS failed, try IP-based fallback
      console.log('Falling back to IP-based geolocation');
      await useLocationFromIP();
    }
  } else {
    // Geolocation not supported, use IP-based
    console.log('Geolocation not supported, using IP-based location');
    await useLocationFromIP();
  }
  
  isLoadingLocation.value = false;
};

const startVoiceSearch = () => {
  // Check if browser supports speech recognition
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    console.log('Speech recognition not supported');
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-IN'; // Indian English
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    searchQuery.value = transcript;
    if (searchInput.value) {
      searchInput.value.value = transcript;
    }
  };

  recognition.onerror = (event: any) => {
    console.error('Speech recognition error:', event.error);
  };

  recognition.start();
};

const handleTabClick = (tabValue: string) => {
  if (tabValue === 'post') {
    // Navigate to add-property page
    router.push('/add-property');
  } else {
    // Set active tab for other tabs
    activeTab.value = tabValue;
  }
};

const performSearch = () => {
  const query: any = {
    type: activeTab.value === 'buy' || activeTab.value === 'rent' ? activeTab.value : 'buy',
  };
  
  // Add category filter if not 'all'
  if (category.value && category.value !== 'all') {
    query.category = category.value;
  }
  
  // Add location data from Google Places
  if (selectedPlace.value) {
    if (selectedPlace.value.city) query.city = selectedPlace.value.city;
    if (selectedPlace.value.state) query.state = selectedPlace.value.state;
    if (selectedPlace.value.pincode) query.pincode = selectedPlace.value.pincode;
  }
  
  // Add free text search query
  if (searchQuery.value) {
    query.q = searchQuery.value;
  }
  
  router.push({ path: '/search', query });
};

onMounted(() => {
  // Initialize Google Places Autocomplete
  if (searchInput.value && typeof google !== 'undefined' && google.maps && google.maps.places) {
    try {
      const autocomplete = new google.maps.places.Autocomplete(searchInput.value, {
        types: ['(cities)'],
        componentRestrictions: { country: 'in' }
      });

    // Listen for place selection
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      
      if (place.address_components) {
        const city = place.address_components.find(c => c.types.includes('locality'))?.long_name;
        const state = place.address_components.find(c => c.types.includes('administrative_area_level_1'))?.long_name;
        const pincode = place.address_components.find(c => c.types.includes('postal_code'))?.long_name;

        selectedPlace.value = { city, state, pincode };
        
        // Update display value
        searchQuery.value = place.formatted_address || '';
      }
    });
    } catch (e) {
      console.warn('Google Maps Autocomplete init failed', e);
    }
  }
});
</script>

<style scoped>
.home-search-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

/* Tabs */
.search-tabs {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0 20px;
  border-bottom: 1px solid #e5e7eb;
  background: #fafafa;
}

.tab-item {
  position: relative;
  background: none;
  border: none;
  padding: 16px 20px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.tab-item:hover {
  color: #111827;
}

.tab-item.active {
  color: #111827;
  font-weight: 600;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 3px;
  background: #3b82f6;
  border-radius: 3px 3px 0 0;
}

.badge {
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 700;
}

.badge.red {
  color: #dc2626;
  font-size: 1.2rem;
  padding: 0;
}

.badge.green {
  background: #10b981;
  color: white;
}

/* Search Bar */
.search-bar {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 12px 16px;
  background: white;
}

.category-dropdown {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  min-width: 160px;
}

.category-select {
  appearance: none;
  background: none;
  border: none;
  font-size: 0.95rem;
  font-weight: 600;
  color: #111827;
  cursor: pointer;
  outline: none;
  padding: 8px 32px 8px 12px;
  width: 100%;
  border-radius: 8px;
  transition: all 0.2s;
  font-family: 'Outfit', sans-serif;
}

.category-dropdown:hover .category-select {
    background: rgba(0, 122, 255, 0.05);
}

.dropdown-icon {
  position: absolute;
  right: 12px;
  pointer-events: none;
  color: #007aff;
  transition: transform 0.2s ease;
}

.category-dropdown:focus-within .dropdown-icon {
    transform: rotate(180deg);
}

.search-divider {
  width: 1px;
  height: 32px;
  background: #e5e7eb;
}

.search-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  min-width: 0;
  overflow: hidden;
}

.search-icon-left {
  color: #9ca3af;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.95rem;
  color: #111827;
  min-width: 0;
  width: 100%;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-btn {
  background: none;
  border: none;
  padding: 6px;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: #f3f4f6;
  color: #111827;
}

.icon-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon-btn:disabled:hover {
  background: none;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.search-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.search-btn:hover {
  background: #2563eb;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .search-tabs {
    overflow-x: auto;
    padding: 0 12px;
    -webkit-overflow-scrolling: touch;
  }
  
  .tab-item {
    padding: 12px 16px;
    font-size: 0.875rem;
  }
  
  .search-bar {
    flex-direction: column;
    gap: 12px;
    padding: 16px;
  }
  
  .category-dropdown,
  .search-input-wrapper {
    width: 100%;
  }
  
  .search-divider {
    display: none;
  }
  
  .search-btn {
    width: 100%;
  }
}
</style>
