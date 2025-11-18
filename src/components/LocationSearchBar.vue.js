import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useGoogleMaps } from '../composables/useGoogleMaps';
const __VLS_props = defineProps({
    modelValue: {
        type: String,
        required: true,
    },
});
const emit = defineEmits(['update:modelValue', 'place_changed']);
const autocompleteInput = ref(null);
let autocomplete = null;
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
    }
    catch (error) {
        console.error("Failed to load Google Maps script:", error);
    }
});
onBeforeUnmount(() => {
    if (autocomplete) {
        google.maps.event.clearInstanceListeners(autocomplete);
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "location-search-bar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    ...{ onInput: (...[$event]) => {
            __VLS_ctx.$emit('update:modelValue', $event.target.value);
        } },
    ref: "autocompleteInput",
    type: "text",
    value: (__VLS_ctx.modelValue),
    placeholder: "Search for a location...",
    ...{ class: "search-input" },
});
/** @type {typeof __VLS_ctx.autocompleteInput} */ ;
/** @type {__VLS_StyleScopedClasses['location-search-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            autocompleteInput: autocompleteInput,
        };
    },
    emits: {},
    props: {
        modelValue: {
            type: String,
            required: true,
        },
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    emits: {},
    props: {
        modelValue: {
            type: String,
            required: true,
        },
    },
});
; /* PartiallyEnd: #4569/main.vue */
