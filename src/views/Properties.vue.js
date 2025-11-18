import { ref, onMounted } from 'vue';
import PropertyCard from '../components/PropertyCard.vue';
import FilterProperties from '../components/FilterProperties.vue';
import { usePropertyStore } from '../stores/property';
import { and, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
const store = usePropertyStore();
const isFilterModalVisible = ref(false);
const filtersApplied = ref(false);
const currentFilters = ref(null);
const documents = ref([]);
const loading = ref(false);
const error = ref(null);
const hasMore = ref(true);
const lastDoc = ref(null);
const locationInput = ref(null);
const selectedPlace = ref(null);
onMounted(() => {
    if (locationInput.value) {
        const autocomplete = new google.maps.places.Autocomplete(locationInput.value, {
            types: ['(cities)'],
            componentRestrictions: { country: "in" }
        });
        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            const city = place.address_components?.find(c => c.types.includes('locality'))?.long_name;
            const state = place.address_components?.find(c => c.types.includes('administrative_area_level_1'))?.long_name;
            const pincode = place.address_components?.find(c => c.types.includes('postal_code'))?.long_name;
            selectedPlace.value = {
                city,
                state,
                pincode
            };
            loadProperties(currentFilters.value);
        });
    }
    loadProperties(currentFilters.value);
});
const loadProperties = async (filters) => {
    loading.value = true;
    error.value = null;
    try {
        const queryConstraints = [];
        if (selectedPlace.value) {
            if (selectedPlace.value.city) {
                queryConstraints.push(where('basic.city', '==', selectedPlace.value.city));
            }
            if (selectedPlace.value.state) {
                queryConstraints.push(where('basic.state', '==', selectedPlace.value.state));
            }
            if (selectedPlace.value.pincode) {
                queryConstraints.push(where('basic.pincode', '==', selectedPlace.value.pincode));
            }
        }
        if (filters) {
            if (filters.saleOrRent) {
                queryConstraints.push(where('basic.saleOrRent', '==', filters.saleOrRent));
            }
            if (filters.propertyType) {
                queryConstraints.push(where('basic.propertyType', '==', filters.propertyType));
            }
            if (filters.priceRange && filters.priceRange[1] < store.highestPrice) {
                queryConstraints.push(where('pricing.price', '>=', filters.priceRange[0]));
                queryConstraints.push(where('pricing.price', '<=', filters.priceRange[1]));
            }
        }
        let q;
        if (queryConstraints.length > 0) {
            q = query(collection(db, 'properties'), and(...queryConstraints));
        }
        else {
            q = query(collection(db, 'properties'));
        }
        const querySnapshot = await getDocs(q);
        documents.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        lastDoc.value = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
        hasMore.value = querySnapshot.docs.length > 0;
    }
    catch (e) {
        error.value = 'Failed to load properties.';
        console.error(e);
    }
    finally {
        loading.value = false;
    }
};
const applyFilters = (filters) => {
    currentFilters.value = filters;
    filtersApplied.value = true;
    isFilterModalVisible.value = false;
    loadProperties(filters);
};
const removeFilters = () => {
    currentFilters.value = null;
    filtersApplied.value = false;
    selectedPlace.value = null;
    if (locationInput.value)
        locationInput.value.value = "";
    loadProperties(null);
};
const loadMore = async () => {
    // Load more is complex with the current filtering, so for now we will just re-load the properties
    // In a real application, you would want to implement proper pagination with cursors
    loadProperties(currentFilters.value);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['remove-filter-button']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['header-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['properties-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['properties-grid']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "properties-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "page-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "search-input-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "2",
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
    ...{ class: "search-icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
    d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.circle, __VLS_intrinsicElements.circle)({
    cx: "12",
    cy: "10",
    r: "3",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
    ref: "locationInput",
    type: "text",
    placeholder: "Enter a city",
    ...{ class: "search-input" },
});
/** @type {typeof __VLS_ctx.locationInput} */ ;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "header-actions" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.isFilterModalVisible = true;
        } },
    ...{ class: "filter-button" },
});
if (__VLS_ctx.filtersApplied) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.removeFilters) },
        ...{ class: "remove-filter-button" },
    });
}
/** @type {[typeof FilterProperties, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(FilterProperties, new FilterProperties({
    ...{ 'onClose': {} },
    ...{ 'onApplyFilters': {} },
    isVisible: (__VLS_ctx.isFilterModalVisible),
}));
const __VLS_1 = __VLS_0({
    ...{ 'onClose': {} },
    ...{ 'onApplyFilters': {} },
    isVisible: (__VLS_ctx.isFilterModalVisible),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    onClose: (...[$event]) => {
        __VLS_ctx.isFilterModalVisible = false;
    }
};
const __VLS_7 = {
    onApplyFilters: (__VLS_ctx.applyFilters)
};
var __VLS_2;
if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "error-state" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.error);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "properties-grid" },
});
for (const [property] of __VLS_getVForSourceType((__VLS_ctx.documents))) {
    /** @type {[typeof PropertyCard, ]} */ ;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(PropertyCard, new PropertyCard({
        key: (property.id),
        property: (property),
    }));
    const __VLS_9 = __VLS_8({
        key: (property.id),
        property: (property),
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
}
if (__VLS_ctx.loading && __VLS_ctx.documents.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "loading-indicator" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "spinner" },
    });
}
if (!__VLS_ctx.loading && __VLS_ctx.documents.length === 0 && !__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty-state" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
}
if (__VLS_ctx.hasMore && !__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "load-more-container" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.loadMore) },
        ...{ class: "load-more-button" },
    });
}
/** @type {__VLS_StyleScopedClasses['properties-page']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['search-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['header-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-button']} */ ;
/** @type {__VLS_StyleScopedClasses['remove-filter-button']} */ ;
/** @type {__VLS_StyleScopedClasses['error-state']} */ ;
/** @type {__VLS_StyleScopedClasses['properties-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
/** @type {__VLS_StyleScopedClasses['load-more-container']} */ ;
/** @type {__VLS_StyleScopedClasses['load-more-button']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            PropertyCard: PropertyCard,
            FilterProperties: FilterProperties,
            isFilterModalVisible: isFilterModalVisible,
            filtersApplied: filtersApplied,
            documents: documents,
            loading: loading,
            error: error,
            hasMore: hasMore,
            locationInput: locationInput,
            applyFilters: applyFilters,
            removeFilters: removeFilters,
            loadMore: loadMore,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
