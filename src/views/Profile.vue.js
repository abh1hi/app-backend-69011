import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import { usePropertyStore } from '../stores/property';
import { useInfiniteScroll } from '../composables/useInfiniteScroll';
import PropertyCard from '../components/PropertyCard.vue';
import IDUploadActionSheet from '../components/IDUploadActionSheet.vue';
import { ref } from 'vue';
const userStore = useUserStore();
const propertyStore = usePropertyStore();
const router = useRouter();
const user = computed(() => userStore.user);
const userProfile = computed(() => userStore.profile);
const showUploadSheet = ref(false);
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
const handleUpgradeUpload = async (file) => {
    try {
        await userStore.upgradeToDealer(file);
        showUploadSheet.value = false;
        alert('Upgrade request submitted! You can now list properties.');
    }
    catch (e) {
        console.error('Upgrade failed', e);
        alert('Failed to upgrade. Please try again.');
    }
};
const initializeProfile = async () => {
    if (!user.value)
        return;
    try {
        await userStore.createUserProfile(user.value.uid, {
            role: 'buyer',
            isVerified: false
        });
        // Profile should automatically update in store, but we can fetch to be safe
        // userStore.fetchUserProfile(user.value.uid); // fetchUserProfile updates the reactive 'profile'
    }
    catch (e) {
        console.error('Failed to initialize profile', e);
        alert('Failed to create profile. Please try again.');
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
/** @type {__VLS_StyleScopedClasses['upgrade-text']} */ ;
/** @type {__VLS_StyleScopedClasses['role-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['role-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['status-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['status-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['doc-link']} */ ;
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
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "profile-info-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: "profile-name" },
    });
    (__VLS_ctx.user.displayName || 'User');
    if (__VLS_ctx.userProfile?.role) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "role-badge" },
            ...{ class: (__VLS_ctx.userProfile.role) },
        });
        (__VLS_ctx.userProfile.role.charAt(0).toUpperCase() + __VLS_ctx.userProfile.role.slice(1));
    }
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
if (__VLS_ctx.userProfile?.role === 'dealer') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info-card glass-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "status-badge" },
        ...{ class: (__VLS_ctx.userProfile.isVerified ? 'verified' : 'pending') },
    });
    (__VLS_ctx.userProfile.isVerified ? 'Verified' : 'Pending Verification');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "documents-list" },
    });
    if (__VLS_ctx.userProfile.documents?.aadharCardUrl) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "document-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "doc-icon" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "doc-info" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "doc-title" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
            href: (__VLS_ctx.userProfile.documents.aadharCardUrl),
            target: "_blank",
            ...{ class: "doc-link" },
        });
    }
}
if (__VLS_ctx.userProfile?.role === 'buyer') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "upgrade-card glass-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "upgrade-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "upgrade-icon" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "upgrade-text" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.userProfile?.role === 'buyer'))
                    return;
                __VLS_ctx.showUploadSheet = true;
            } },
        ...{ class: "upgrade-button" },
    });
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
if (!__VLS_ctx.userProfile && __VLS_ctx.user) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info-card glass-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.initializeProfile) },
        ...{ class: "upgrade-button" },
    });
}
/** @type {[typeof IDUploadActionSheet, ]} */ ;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent(IDUploadActionSheet, new IDUploadActionSheet({
    ...{ 'onUploadComplete': {} },
    isVisible: (__VLS_ctx.showUploadSheet),
}));
const __VLS_9 = __VLS_8({
    ...{ 'onUploadComplete': {} },
    isVisible: (__VLS_ctx.showUploadSheet),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_11;
let __VLS_12;
let __VLS_13;
const __VLS_14 = {
    onUploadComplete: (__VLS_ctx.handleUpgradeUpload)
};
var __VLS_10;
/** @type {__VLS_StyleScopedClasses['dashboard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-card']} */ ;
/** @type {__VLS_StyleScopedClasses['glass-card']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-header']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-info-row']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-name']} */ ;
/** @type {__VLS_StyleScopedClasses['role-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-phone']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-button']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-sign-out-alt']} */ ;
/** @type {__VLS_StyleScopedClasses['info-card']} */ ;
/** @type {__VLS_StyleScopedClasses['glass-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['status-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['documents-list']} */ ;
/** @type {__VLS_StyleScopedClasses['document-item']} */ ;
/** @type {__VLS_StyleScopedClasses['doc-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['doc-info']} */ ;
/** @type {__VLS_StyleScopedClasses['doc-title']} */ ;
/** @type {__VLS_StyleScopedClasses['doc-link']} */ ;
/** @type {__VLS_StyleScopedClasses['upgrade-card']} */ ;
/** @type {__VLS_StyleScopedClasses['glass-card']} */ ;
/** @type {__VLS_StyleScopedClasses['upgrade-content']} */ ;
/** @type {__VLS_StyleScopedClasses['upgrade-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['upgrade-text']} */ ;
/** @type {__VLS_StyleScopedClasses['upgrade-button']} */ ;
/** @type {__VLS_StyleScopedClasses['properties-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['properties-list']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['no-properties']} */ ;
/** @type {__VLS_StyleScopedClasses['error-state']} */ ;
/** @type {__VLS_StyleScopedClasses['load-more-container']} */ ;
/** @type {__VLS_StyleScopedClasses['load-more-button']} */ ;
/** @type {__VLS_StyleScopedClasses['info-card']} */ ;
/** @type {__VLS_StyleScopedClasses['glass-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['upgrade-button']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            PropertyCard: PropertyCard,
            IDUploadActionSheet: IDUploadActionSheet,
            user: user,
            userProfile: userProfile,
            showUploadSheet: showUploadSheet,
            documents: documents,
            loading: loading,
            error: error,
            hasMore: hasMore,
            handleLogout: handleLogout,
            loadMore: loadMore,
            handleEdit: handleEdit,
            handleDelete: handleDelete,
            handleUpgradeUpload: handleUpgradeUpload,
            initializeProfile: initializeProfile,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
