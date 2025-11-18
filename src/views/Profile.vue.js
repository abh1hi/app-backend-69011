import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import { usePropertyStore } from '../stores/property';
import { useInfiniteScroll } from '../composables/useInfiniteScroll';
import PropertyCard from '../components/PropertyCard.vue';
const userStore = useUserStore();
const propertyStore = usePropertyStore();
const router = useRouter();
const user = computed(() => userStore.user);
const ownerId = computed(() => user.value?.uid || null);
// Get all the reactive properties from the composable
const { documents, loading, error, hasMore, loadMoreDocuments } = useInfiniteScroll('properties', { ownerId });
const handleLogout = async () => {
    await userStore.logout();
    router.push('/'); // Redirect to home after logout
};
const loadMore = () => {
    loadMoreDocuments();
};
const handleEdit = (propertyId) => {
    router.push({ name: 'EditProperty', params: { id: propertyId } });
};
const handleDelete = async (propertyId) => {
    if (confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
        try {
            // This action will be created in the property store
            await propertyStore.deleteProperty(propertyId);
            // Refresh the list after deletion
            documents.value = documents.value.filter(p => p.id !== propertyId);
            alert('Property deleted successfully.');
        }
        catch (err) {
            console.error("Error deleting property:", err);
            alert('Failed to delete property.');
        }
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['dashboard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-card']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-name']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-button']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-button']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-button']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['properties-list']} */ ;
/** @type {__VLS_StyleScopedClasses['properties-list']} */ ;
/** @type {__VLS_StyleScopedClasses['load-more-button']} */ ;
/** @type {__VLS_StyleScopedClasses['load-more-button']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dashboard-page" },
});
if (__VLS_ctx.user) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "profile-card glass-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "profile-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: "profile-name" },
    });
    (__VLS_ctx.user.displayName || 'User');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "profile-phone" },
    });
    (__VLS_ctx.user.phoneNumber || 'No phone number');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.handleLogout) },
        ...{ class: "logout-button" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
        ...{ class: "fas fa-sign-out-alt" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "properties-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "section-title" },
});
if (__VLS_ctx.documents.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "properties-list" },
    });
    for (const [property] of __VLS_getVForSourceType((__VLS_ctx.documents))) {
        /** @type {[typeof PropertyCard, ]} */ ;
        // @ts-ignore
        const __VLS_0 = __VLS_asFunctionalComponent(PropertyCard, new PropertyCard({
            ...{ 'onEdit': {} },
            ...{ 'onDelete': {} },
            key: (property.id),
            property: (property),
            showOwnerActions: (true),
        }));
        const __VLS_1 = __VLS_0({
            ...{ 'onEdit': {} },
            ...{ 'onDelete': {} },
            key: (property.id),
            property: (property),
            showOwnerActions: (true),
        }, ...__VLS_functionalComponentArgsRest(__VLS_0));
        let __VLS_3;
        let __VLS_4;
        let __VLS_5;
        const __VLS_6 = {
            onEdit: (__VLS_ctx.handleEdit)
        };
        const __VLS_7 = {
            onDelete: (__VLS_ctx.handleDelete)
        };
        var __VLS_2;
    }
}
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "loading-indicator" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "spinner" },
    });
}
if (!__VLS_ctx.loading && __VLS_ctx.documents.length === 0 && !__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "no-properties" },
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
if (__VLS_ctx.hasMore && !__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "load-more-container" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.loadMore) },
        ...{ class: "load-more-button" },
    });
}
/** @type {__VLS_StyleScopedClasses['dashboard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-card']} */ ;
/** @type {__VLS_StyleScopedClasses['glass-card']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-header']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-name']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-phone']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-button']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-sign-out-alt']} */ ;
/** @type {__VLS_StyleScopedClasses['properties-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['properties-list']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['no-properties']} */ ;
/** @type {__VLS_StyleScopedClasses['error-state']} */ ;
/** @type {__VLS_StyleScopedClasses['load-more-container']} */ ;
/** @type {__VLS_StyleScopedClasses['load-more-button']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            PropertyCard: PropertyCard,
            user: user,
            documents: documents,
            loading: loading,
            error: error,
            hasMore: hasMore,
            handleLogout: handleLogout,
            loadMore: loadMore,
            handleEdit: handleEdit,
            handleDelete: handleDelete,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
