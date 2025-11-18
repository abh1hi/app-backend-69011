import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePropertyStore } from '../stores/property';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import EditSection from '../components/EditSection.vue';
import BasicInfo from '../components/BasicInfo.vue';
import PricingInfo from '../components/PricingInfo.vue';
import FeaturesInfo from '../components/FeaturesInfo.vue';
import ContactInfo from '../components/ContactInfo.vue';
import MediaInfo from '../components/MediaInfo.vue';
const route = useRoute();
const router = useRouter();
const propertyStore = usePropertyStore();
const propertyData = ref(null);
const updatedData = ref({});
const mediaChanges = ref({ newFiles: [], deletedUrls: [] });
const propertyId = route.params.id;
const isLoading = ref(true);
const isSaving = ref(false);
onMounted(async () => {
    const cachedProp = propertyStore.getCachedProperty(propertyId);
    if (cachedProp) {
        propertyData.value = JSON.parse(JSON.stringify(cachedProp));
        isLoading.value = false;
        return;
    }
    try {
        const docRef = doc(db, 'properties', propertyId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const fetchedData = { id: docSnap.id, ...docSnap.data() };
            propertyData.value = JSON.parse(JSON.stringify(fetchedData));
            propertyStore.cacheProperty(propertyData.value);
        }
        else {
            console.error('No such document!');
        }
    }
    catch (error) {
        console.error('Error fetching document:', error);
    }
    finally {
        isLoading.value = false;
    }
});
const handleUpdate = (section, data) => {
    if (!updatedData.value[section]) {
        updatedData.value[section] = {};
    }
    updatedData.value[section] = { ...updatedData.value[section], ...data };
};
const handleMediaUpdate = (changes) => {
    mediaChanges.value = changes;
};
const saveAllChanges = async () => {
    isSaving.value = true;
    try {
        await propertyStore.updatePropertyWithMedia(propertyId, updatedData.value, mediaChanges.value);
        alert('Property updated successfully!');
        router.push({ name: 'Dashboard' });
    }
    catch (error) {
        console.error('Failed to save changes:', error);
        alert('An error occurred while saving. Please try again.');
    }
    finally {
        isSaving.value = false;
    }
};
const cancel = () => {
    router.back();
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['save-all-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['cancel-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['cancel-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['save-all-btn']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "edit-property-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "page-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "header-actions" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.cancel) },
    ...{ class: "cancel-btn" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.saveAllChanges) },
    ...{ class: "save-all-btn" },
    disabled: (__VLS_ctx.isSaving),
});
if (__VLS_ctx.isSaving) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "spinner-icon" },
    });
}
(__VLS_ctx.isSaving ? 'Saving...' : 'Save All Changes');
if (__VLS_ctx.propertyData) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "form-container" },
    });
    /** @type {[typeof EditSection, typeof EditSection, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(EditSection, new EditSection({
        title: "Basic Information",
        startOpen: true,
    }));
    const __VLS_1 = __VLS_0({
        title: "Basic Information",
        startOpen: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    __VLS_2.slots.default;
    /** @type {[typeof BasicInfo, ]} */ ;
    // @ts-ignore
    const __VLS_3 = __VLS_asFunctionalComponent(BasicInfo, new BasicInfo({
        ...{ 'onUpdate': {} },
        initialData: (__VLS_ctx.propertyData.basic),
        isEditMode: (true),
    }));
    const __VLS_4 = __VLS_3({
        ...{ 'onUpdate': {} },
        initialData: (__VLS_ctx.propertyData.basic),
        isEditMode: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_3));
    let __VLS_6;
    let __VLS_7;
    let __VLS_8;
    const __VLS_9 = {
        onUpdate: (...[$event]) => {
            if (!(__VLS_ctx.propertyData))
                return;
            __VLS_ctx.handleUpdate('basic', $event);
        }
    };
    var __VLS_5;
    var __VLS_2;
    /** @type {[typeof EditSection, typeof EditSection, ]} */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(EditSection, new EditSection({
        title: "Pricing Details",
    }));
    const __VLS_11 = __VLS_10({
        title: "Pricing Details",
    }, ...__VLS_functionalComponentArgsRest(__VLS_10));
    __VLS_12.slots.default;
    /** @type {[typeof PricingInfo, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(PricingInfo, new PricingInfo({
        ...{ 'onUpdate': {} },
        initialData: (__VLS_ctx.propertyData.pricing),
    }));
    const __VLS_14 = __VLS_13({
        ...{ 'onUpdate': {} },
        initialData: (__VLS_ctx.propertyData.pricing),
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    let __VLS_16;
    let __VLS_17;
    let __VLS_18;
    const __VLS_19 = {
        onUpdate: (...[$event]) => {
            if (!(__VLS_ctx.propertyData))
                return;
            __VLS_ctx.handleUpdate('pricing', $event);
        }
    };
    var __VLS_15;
    var __VLS_12;
    /** @type {[typeof EditSection, typeof EditSection, ]} */ ;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(EditSection, new EditSection({
        title: "Features & Amenities",
    }));
    const __VLS_21 = __VLS_20({
        title: "Features & Amenities",
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    __VLS_22.slots.default;
    /** @type {[typeof FeaturesInfo, ]} */ ;
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent(FeaturesInfo, new FeaturesInfo({
        ...{ 'onUpdate': {} },
        initialData: (__VLS_ctx.propertyData.features),
    }));
    const __VLS_24 = __VLS_23({
        ...{ 'onUpdate': {} },
        initialData: (__VLS_ctx.propertyData.features),
    }, ...__VLS_functionalComponentArgsRest(__VLS_23));
    let __VLS_26;
    let __VLS_27;
    let __VLS_28;
    const __VLS_29 = {
        onUpdate: (...[$event]) => {
            if (!(__VLS_ctx.propertyData))
                return;
            __VLS_ctx.handleUpdate('features', $event);
        }
    };
    var __VLS_25;
    var __VLS_22;
    /** @type {[typeof EditSection, typeof EditSection, ]} */ ;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent(EditSection, new EditSection({
        title: "Contact Information",
    }));
    const __VLS_31 = __VLS_30({
        title: "Contact Information",
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    __VLS_32.slots.default;
    /** @type {[typeof ContactInfo, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(ContactInfo, new ContactInfo({
        ...{ 'onUpdate': {} },
        initialData: (__VLS_ctx.propertyData.contact),
    }));
    const __VLS_34 = __VLS_33({
        ...{ 'onUpdate': {} },
        initialData: (__VLS_ctx.propertyData.contact),
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    let __VLS_36;
    let __VLS_37;
    let __VLS_38;
    const __VLS_39 = {
        onUpdate: (...[$event]) => {
            if (!(__VLS_ctx.propertyData))
                return;
            __VLS_ctx.handleUpdate('contact', $event);
        }
    };
    var __VLS_35;
    var __VLS_32;
    /** @type {[typeof EditSection, typeof EditSection, ]} */ ;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent(EditSection, new EditSection({
        title: "Media (Photos & Videos)",
    }));
    const __VLS_41 = __VLS_40({
        title: "Media (Photos & Videos)",
    }, ...__VLS_functionalComponentArgsRest(__VLS_40));
    __VLS_42.slots.default;
    /** @type {[typeof MediaInfo, ]} */ ;
    // @ts-ignore
    const __VLS_43 = __VLS_asFunctionalComponent(MediaInfo, new MediaInfo({
        ...{ 'onUpdate': {} },
        initialMedia: (__VLS_ctx.propertyData.mediaUrls),
    }));
    const __VLS_44 = __VLS_43({
        ...{ 'onUpdate': {} },
        initialMedia: (__VLS_ctx.propertyData.mediaUrls),
    }, ...__VLS_functionalComponentArgsRest(__VLS_43));
    let __VLS_46;
    let __VLS_47;
    let __VLS_48;
    const __VLS_49 = {
        onUpdate: (__VLS_ctx.handleMediaUpdate)
    };
    var __VLS_45;
    var __VLS_42;
}
else if (__VLS_ctx.isLoading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "loading-state" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "spinner" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "error-state" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
}
/** @type {__VLS_StyleScopedClasses['edit-property-container']} */ ;
/** @type {__VLS_StyleScopedClasses['header']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['header-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['cancel-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['save-all-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['spinner-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['form-container']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-state']} */ ;
/** @type {__VLS_StyleScopedClasses['spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['error-state']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            EditSection: EditSection,
            BasicInfo: BasicInfo,
            PricingInfo: PricingInfo,
            FeaturesInfo: FeaturesInfo,
            ContactInfo: ContactInfo,
            MediaInfo: MediaInfo,
            propertyData: propertyData,
            isLoading: isLoading,
            isSaving: isSaving,
            handleUpdate: handleUpdate,
            handleMediaUpdate: handleMediaUpdate,
            saveAllChanges: saveAllChanges,
            cancel: cancel,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
