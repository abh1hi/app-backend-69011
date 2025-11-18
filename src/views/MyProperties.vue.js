import { ref, onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useInfiniteScroll } from '../composables/useInfiniteScroll';
import PropertyCard from '../components/PropertyCard.vue';
const user = ref(null);
const auth = getAuth();
const ownerId = ref(null);
const { documents, loading, error, hasMore, loadMoreDocuments } = useInfiniteScroll('properties', { ownerId });
onMounted(() => {
    onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
            user.value = currentUser;
            ownerId.value = currentUser.uid;
        }
        else {
            user.value = null;
            ownerId.value = null;
        }
    });
});
const loadMore = () => {
    loadMoreDocuments();
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['my-properties-container']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['properties-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['properties-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-state']} */ ;
/** @type {__VLS_StyleScopedClasses['error-state']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
/** @type {__VLS_StyleScopedClasses['add-property-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['add-property-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['load-more-button']} */ ;
/** @type {__VLS_StyleScopedClasses['load-more-button']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "my-properties-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "section-title" },
});
if (__VLS_ctx.loading && __VLS_ctx.documents.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "loading-state" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "spinner" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
}
if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "error-state" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.error);
}
if (!__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "properties-grid" },
    });
    for (const [property] of __VLS_getVForSourceType((__VLS_ctx.documents))) {
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
if (!__VLS_ctx.loading && __VLS_ctx.documents.length === 0 && !__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty-state" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    const __VLS_3 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_4 = __VLS_asFunctionalComponent(__VLS_3, new __VLS_3({
        to: "/add-property",
        ...{ class: "add-property-btn" },
    }));
    const __VLS_5 = __VLS_4({
        to: "/add-property",
        ...{ class: "add-property-btn" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_4));
    __VLS_6.slots.default;
    var __VLS_6;
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
/** @type {__VLS_StyleScopedClasses['my-properties-container']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-state']} */ ;
/** @type {__VLS_StyleScopedClasses['spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['error-state']} */ ;
/** @type {__VLS_StyleScopedClasses['properties-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
/** @type {__VLS_StyleScopedClasses['add-property-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['load-more-container']} */ ;
/** @type {__VLS_StyleScopedClasses['load-more-button']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            PropertyCard: PropertyCard,
            documents: documents,
            loading: loading,
            error: error,
            hasMore: hasMore,
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
