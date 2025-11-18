import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { collection, getDocs, query, where, and } from 'firebase/firestore';
import { db } from '../firebase';
import PropertyCard from '../components/PropertyCard.vue';
const route = useRoute();
const results = ref([]);
const loading = ref(true);
const error = ref(null);
const subtitle = computed(() => {
    const { type, city } = route.query;
    if (city && type) {
        const typeText = type === 'buy' ? 'for sale' : 'for rent';
        return `Showing properties ${typeText} in ${city}`;
    }
    return 'Showing properties for your search';
});
const fetchResults = async () => {
    loading.value = true;
    error.value = null;
    try {
        const { type, city, state, pincode, budget } = route.query;
        const filters = [];
        if (type) {
            const saleOrRent = type === 'buy' ? 'For Sale' : 'For Rent';
            filters.push(where('basic.saleOrRent', '==', saleOrRent));
        }
        if (city && typeof city === 'string' && city.trim() !== '') {
            filters.push(where('basic.city', '==', city));
        }
        if (state && typeof state === 'string' && state.trim() !== '') {
            filters.push(where('basic.state', '==', state));
        }
        if (pincode && typeof pincode === 'string' && pincode.trim() !== '') {
            filters.push(where('basic.pincode', '==', pincode));
        }
        if (budget) {
            const numericBudget = Number(budget);
            if (!isNaN(numericBudget) && numericBudget > 0) {
                filters.push(where('pricing.price', '<=', numericBudget));
            }
        }
        let q;
        if (filters.length > 0) {
            q = query(collection(db, 'properties'), and(...filters));
        }
        else {
            q = query(collection(db, 'properties'));
        }
        const querySnapshot = await getDocs(q);
        results.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    catch (err) {
        console.error("Error fetching search results:", err);
        if (err.code === 'failed-precondition') {
            error.value = `This query requires a custom index. Please create the composite index in your Firebase Firestore console. Details: ${err.message}`;
        }
        else {
            error.value = 'An unexpected error occurred while fetching results.';
        }
    }
    finally {
        loading.value = false;
    }
};
onMounted(fetchResults);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['retry-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['results-grid']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "search-results-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "results-title" },
});
if (__VLS_ctx.subtitle) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "results-subtitle" },
    });
    (__VLS_ctx.subtitle);
}
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "loading-state" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "spinner" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
}
else if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "error-state" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "error-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "error-message" },
    });
    (__VLS_ctx.error);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.fetchResults) },
        ...{ class: "retry-btn" },
    });
}
else if (__VLS_ctx.results.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "results-grid" },
    });
    for (const [property] of __VLS_getVForSourceType((__VLS_ctx.results))) {
        /** @type {[typeof PropertyCard, ]} */ ;
        // @ts-ignore
        const __VLS_0 = __VLS_asFunctionalComponent(PropertyCard, new PropertyCard({
            key: (property.id),
            property: (property),
        }));
        const __VLS_1 = __VLS_0({
            key: (property.id),
            property: (property),
        }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "no-results-state" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: "https://firebasestorage.googleapis.com/v0/b/aapna-ashiana-c7414.appspot.com/o/defaults%2Fno-results.svg?alt=media&token=42217c46-9132-4a70-8c29-e331c90c766b",
        alt: "No results found",
        ...{ class: "no-results-image" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "no-results-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "no-results-text" },
    });
}
/** @type {__VLS_StyleScopedClasses['search-results-container']} */ ;
/** @type {__VLS_StyleScopedClasses['results-title']} */ ;
/** @type {__VLS_StyleScopedClasses['results-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-state']} */ ;
/** @type {__VLS_StyleScopedClasses['spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['error-state']} */ ;
/** @type {__VLS_StyleScopedClasses['error-title']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['retry-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['results-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['no-results-state']} */ ;
/** @type {__VLS_StyleScopedClasses['no-results-image']} */ ;
/** @type {__VLS_StyleScopedClasses['no-results-title']} */ ;
/** @type {__VLS_StyleScopedClasses['no-results-text']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            PropertyCard: PropertyCard,
            results: results,
            loading: loading,
            error: error,
            subtitle: subtitle,
            fetchResults: fetchResults,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
