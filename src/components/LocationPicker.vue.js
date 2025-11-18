import { ref, onMounted } from 'vue';
const emit = defineEmits(['location-selected']);
const searchInput = ref(null);
const mapContainer = ref(null);
let map = null;
let marker = null;
/**
 * Parses the address components from a Google Place or Geocoder result.
 * @param place The result object from Google Maps API.
 * @returns An object containing city, state, and pincode.
 */
function parseAddressComponents(place) {
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
                }
                else {
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
        map.addListener('click', (e) => {
            if (e.latLng) {
                if (marker) {
                    marker.setPosition(e.latLng);
                }
                else {
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
    }
    else {
        console.error('Google Maps API not loaded.');
    }
});
function emitLocation(location, address, placeId, city, state, pincode) {
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
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['search-container']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "search-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: "text",
    ref: "searchInput",
    placeholder: "Search for a location",
});
/** @type {typeof __VLS_ctx.searchInput} */ ;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ref: "mapContainer",
    ...{ class: "map-container" },
});
/** @type {typeof __VLS_ctx.mapContainer} */ ;
/** @type {__VLS_StyleScopedClasses['search-container']} */ ;
/** @type {__VLS_StyleScopedClasses['map-container']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            searchInput: searchInput,
            mapContainer: mapContainer,
        };
    },
    emits: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    emits: {},
});
; /* PartiallyEnd: #4569/main.vue */
