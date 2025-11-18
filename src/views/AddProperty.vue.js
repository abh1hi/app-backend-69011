import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { usePropertyStore } from '../stores/property';
import OptionPicker from '../components/OptionPicker.vue';
import FormModal from '../components/FormModal.vue';
import LocationPicker from '../components/LocationPicker.vue';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
const router = useRouter();
const propertyStore = usePropertyStore();
const allAmenities = ['Gym', 'Pool', 'Garden', 'Lift'];
const fileInput = ref(null);
const mediaType = ref('photo');
const isBasicModalVisible = ref(false);
const isPricingModalVisible = ref(false);
const isFeaturesModalVisible = ref(false);
const isMediaModalVisible = ref(false);
const isContactModalVisible = ref(false);
const isLegalModalVisible = ref(false);
const isPickerVisible = ref(false);
const pickerTitle = ref('');
const pickerOptions = ref([]);
const activePickerField = ref(null);
const selectedLocation = ref(null);
const duplicateError = ref('');
const isCheckingDuplicates = ref(false);
const basicErrors = reactive({
    propertyType: '',
    saleOrRent: '',
    title: '',
    description: '',
    location: '',
    state: '',
    city: '',
    pincode: '',
    size: '',
    bedrooms: '',
    bathrooms: '',
    floor: '',
    age: ''
});
const allSectionsCompleted = computed(() => {
    return Object.values(propertyStore.completedSections).every(Boolean);
});
const openSection = (section) => {
    if (section === 'basic') {
        propertyStore.fetchAvailableStates();
        isBasicModalVisible.value = true;
    }
    else if (section === 'pricing')
        isPricingModalVisible.value = true;
    else if (section === 'features')
        isFeaturesModalVisible.value = true;
    else if (section === 'media')
        isMediaModalVisible.value = true;
    else if (section === 'contact')
        isContactModalVisible.value = true;
    else if (section === 'legal')
        isLegalModalVisible.value = true;
};
const validateBasicSection = () => {
    const basic = propertyStore.property.basic;
    let isValid = true;
    Object.keys(basicErrors).forEach(key => {
        basicErrors[key] = '';
    });
    if (!basic.propertyType) {
        basicErrors.propertyType = 'Property type is required.';
        isValid = false;
    }
    if (!basic.saleOrRent) {
        basicErrors.saleOrRent = 'Please specify if the property is for sale or rent.';
        isValid = false;
    }
    if (!basic.title) {
        basicErrors.title = 'Listing title is required.';
        isValid = false;
    }
    if (!basic.description) {
        basicErrors.description = 'Detailed description is required.';
        isValid = false;
    }
    if (!selectedLocation.value?.placeId) {
        basicErrors.location = 'Please select a valid location from the map search.';
        isValid = false;
    }
    if (duplicateError.value) {
        basicErrors.location = duplicateError.value; // Show duplicate error
        isValid = false;
    }
    if (!basic.state) {
        basicErrors.state = 'State is required.';
        isValid = false;
    }
    if (!basic.city) {
        basicErrors.city = 'City is required.';
        isValid = false;
    }
    if (!basic.pincode) {
        basicErrors.pincode = 'Pincode is required.';
        isValid = false;
    }
    if (!basic.size || basic.size <= 0) {
        basicErrors.size = 'Valid property size is required.';
        isValid = false;
    }
    if (!basic.bedrooms || basic.bedrooms <= 0) {
        basicErrors.bedrooms = 'Valid number of bedrooms is required.';
        isValid = false;
    }
    if (!basic.bathrooms || basic.bathrooms <= 0) {
        basicErrors.bathrooms = 'Valid number of bathrooms is required.';
        isValid = false;
    }
    if (!basic.floor) {
        basicErrors.floor = 'Floor level is required.';
        isValid = false;
    }
    if (!basic.age) {
        basicErrors.age = 'Age of property is required.';
        isValid = false;
    }
    return isValid;
};
const saveSection = (section) => {
    if (section === 'basic') {
        if (validateBasicSection()) {
            propertyStore.setSectionCompleted(section, true);
            isBasicModalVisible.value = false;
        }
    }
    else {
        propertyStore.setSectionCompleted(section, true);
        if (section === 'pricing')
            isPricingModalVisible.value = false;
        else if (section === 'features')
            isFeaturesModalVisible.value = false;
        else if (section === 'media')
            isMediaModalVisible.value = false;
        else if (section === 'contact')
            isContactModalVisible.value = false;
        else if (section === 'legal')
            isLegalModalVisible.value = false;
    }
};
const openPicker = (title, options, field) => {
    pickerTitle.value = title;
    pickerOptions.value = options;
    activePickerField.value = field;
    isPickerVisible.value = true;
};
const addMedia = (type) => {
    mediaType.value = type;
    openPicker(`Add ${type}`, [`Take ${type}`, `Choose from Library`], 'media');
};
const handlePickerSelect = (selectedValue) => {
    if (activePickerField.value === 'media') {
        if (fileInput.value) {
            fileInput.value.accept = mediaType.value === 'photo' ? 'image/*' : 'video/*';
            fileInput.value.click();
        }
    }
    else if (activePickerField.value) {
        const [section, field] = activePickerField.value.split('.');
        if (section && field && propertyStore.property[section]) {
            propertyStore.property[section][field] = selectedValue;
        }
    }
};
const handleFileChange = (event) => {
    const target = event.target;
    const file = target.files?.[0];
    if (!file)
        return;
    propertyStore.addMediaFile(mediaType.value, file);
};
const previewProperty = () => {
    console.log('--- 3. Previewing Property ---');
    if (selectedLocation.value?.placeId) {
        const finalPlaceId = selectedLocation.value.placeId;
        console.log('Storing this placeId in the data store:', finalPlaceId);
        propertyStore.setPropertyId(finalPlaceId);
    }
    else {
        console.warn('Warning: Cannot set property ID in store because no location with a placeId is selected.');
    }
    router.push({ name: 'PreviewProperty' });
};
const handleLocationSelected = async (location) => {
    selectedLocation.value = location;
    // Update the store with the new, detailed location info
    propertyStore.updateProperty('basic', {
        location: location.address,
        state: location.state,
        city: location.city,
        pincode: location.pincode
    });
    duplicateError.value = ''; // Clear previous error
    await checkForDuplicate();
};
const checkForDuplicate = async () => {
    if (!selectedLocation.value?.placeId) {
        return;
    }
    isCheckingDuplicates.value = true;
    duplicateError.value = '';
    const placeIdForCheck = selectedLocation.value.placeId;
    try {
        const docRef = doc(db, "properties", placeIdForCheck);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            duplicateError.value = 'Error: This property address already exists in your listings.';
        }
        else {
            // It's all good, no duplicate found
        }
    }
    catch (error) {
        console.error("Error during duplicate check in Firestore:", error);
        duplicateError.value = 'An error occurred while checking the address.';
    }
    finally {
        isCheckingDuplicates.value = false;
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['add-property-container']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['form-sections']} */ ;
/** @type {__VLS_StyleScopedClasses['form-sections']} */ ;
/** @type {__VLS_StyleScopedClasses['section-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['section-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['section-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['section-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['section-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['completed']} */ ;
/** @type {__VLS_StyleScopedClasses['section-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['completed']} */ ;
/** @type {__VLS_StyleScopedClasses['section-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['completed']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['media-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['media-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['media-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['select-input']} */ ;
/** @type {__VLS_StyleScopedClasses['amenities-group']} */ ;
/** @type {__VLS_StyleScopedClasses['amenity-label']} */ ;
/** @type {__VLS_StyleScopedClasses['amenity-label']} */ ;
/** @type {__VLS_StyleScopedClasses['amenity-label']} */ ;
/** @type {__VLS_StyleScopedClasses['amenity-label']} */ ;
/** @type {__VLS_StyleScopedClasses['checkbox-custom']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-section']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-item']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "add-property-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "page-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-sections" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.openSection('basic');
        } },
    ...{ class: "section-btn" },
    ...{ class: ({ completed: __VLS_ctx.propertyStore.completedSections.basic }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.openSection('pricing');
        } },
    ...{ class: "section-btn" },
    ...{ class: ({ completed: __VLS_ctx.propertyStore.completedSections.pricing }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.openSection('features');
        } },
    ...{ class: "section-btn" },
    ...{ class: ({ completed: __VLS_ctx.propertyStore.completedSections.features }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.openSection('media');
        } },
    ...{ class: "section-btn" },
    ...{ class: ({ completed: __VLS_ctx.propertyStore.completedSections.media }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.openSection('contact');
        } },
    ...{ class: "section-btn" },
    ...{ class: ({ completed: __VLS_ctx.propertyStore.completedSections.contact }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.openSection('legal');
        } },
    ...{ class: "section-btn" },
    ...{ class: ({ completed: __VLS_ctx.propertyStore.completedSections.legal }) },
});
if (!__VLS_ctx.allSectionsCompleted) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ class: "submit-btn" },
        disabled: true,
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.previewProperty) },
        ...{ class: "submit-btn preview-btn" },
    });
}
/** @type {[typeof FormModal, typeof FormModal, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(FormModal, new FormModal({
    ...{ 'onClose': {} },
    ...{ 'onSave': {} },
    isVisible: (__VLS_ctx.isBasicModalVisible),
    title: "Property Basic Information",
}));
const __VLS_1 = __VLS_0({
    ...{ 'onClose': {} },
    ...{ 'onSave': {} },
    isVisible: (__VLS_ctx.isBasicModalVisible),
    title: "Property Basic Information",
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    onClose: (...[$event]) => {
        __VLS_ctx.isBasicModalVisible = false;
    }
};
const __VLS_7 = {
    onSave: (...[$event]) => {
        __VLS_ctx.saveSection('basic');
    }
};
__VLS_2.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.openPicker('Property Type', ['Apartment', 'House', 'Commercial'], 'basic.propertyType');
        } },
    type: "text",
    value: (__VLS_ctx.propertyStore.property.basic.propertyType),
    readonly: true,
    ...{ class: "select-input" },
});
if (__VLS_ctx.basicErrors.propertyType) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "error-message" },
    });
    (__VLS_ctx.basicErrors.propertyType);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.openPicker('Sale or Rent', ['For Sale', 'For Rent'], 'basic.saleOrRent');
        } },
    type: "text",
    value: (__VLS_ctx.propertyStore.property.basic.saleOrRent),
    readonly: true,
    ...{ class: "select-input" },
});
if (__VLS_ctx.basicErrors.saleOrRent) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "error-message" },
    });
    (__VLS_ctx.basicErrors.saleOrRent);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
    type: "text",
    value: (__VLS_ctx.propertyStore.property.basic.title),
});
if (__VLS_ctx.basicErrors.title) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "error-message" },
    });
    (__VLS_ctx.basicErrors.title);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)({
    value: (__VLS_ctx.propertyStore.property.basic.description),
});
if (__VLS_ctx.basicErrors.description) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "error-message" },
    });
    (__VLS_ctx.basicErrors.description);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
/** @type {[typeof LocationPicker, ]} */ ;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent(LocationPicker, new LocationPicker({
    ...{ 'onLocationSelected': {} },
}));
const __VLS_9 = __VLS_8({
    ...{ 'onLocationSelected': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_11;
let __VLS_12;
let __VLS_13;
const __VLS_14 = {
    onLocationSelected: (__VLS_ctx.handleLocationSelected)
};
var __VLS_10;
if (__VLS_ctx.basicErrors.location) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "error-message" },
    });
    (__VLS_ctx.basicErrors.location);
}
if (__VLS_ctx.isCheckingDuplicates) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "checking-message" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
    type: "text",
    value: (__VLS_ctx.propertyStore.property.basic.state),
    readonly: true,
    ...{ class: "select-input-display" },
});
if (__VLS_ctx.basicErrors.state) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "error-message" },
    });
    (__VLS_ctx.basicErrors.state);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
    type: "text",
    value: (__VLS_ctx.propertyStore.property.basic.city),
    readonly: true,
    ...{ class: "select-input-display" },
});
if (__VLS_ctx.basicErrors.city) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "error-message" },
    });
    (__VLS_ctx.basicErrors.city);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
    type: "text",
    value: (__VLS_ctx.propertyStore.property.basic.pincode),
    readonly: true,
    ...{ class: "select-input-display" },
});
if (__VLS_ctx.basicErrors.pincode) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "error-message" },
    });
    (__VLS_ctx.basicErrors.pincode);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
    type: "number",
});
(__VLS_ctx.propertyStore.property.basic.size);
if (__VLS_ctx.basicErrors.size) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "error-message" },
    });
    (__VLS_ctx.basicErrors.size);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
    type: "number",
});
(__VLS_ctx.propertyStore.property.basic.bedrooms);
if (__VLS_ctx.basicErrors.bedrooms) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "error-message" },
    });
    (__VLS_ctx.basicErrors.bedrooms);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
    type: "number",
});
(__VLS_ctx.propertyStore.property.basic.bathrooms);
if (__VLS_ctx.basicErrors.bathrooms) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "error-message" },
    });
    (__VLS_ctx.basicErrors.bathrooms);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
    type: "text",
    value: (__VLS_ctx.propertyStore.property.basic.floor),
});
if (__VLS_ctx.basicErrors.floor) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "error-message" },
    });
    (__VLS_ctx.basicErrors.floor);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
    type: "text",
    value: (__VLS_ctx.propertyStore.property.basic.age),
});
if (__VLS_ctx.basicErrors.age) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "error-message" },
    });
    (__VLS_ctx.basicErrors.age);
}
var __VLS_2;
/** @type {[typeof FormModal, typeof FormModal, ]} */ ;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent(FormModal, new FormModal({
    ...{ 'onClose': {} },
    ...{ 'onSave': {} },
    isVisible: (__VLS_ctx.isPricingModalVisible),
    title: "Pricing and Financial Details",
}));
const __VLS_16 = __VLS_15({
    ...{ 'onClose': {} },
    ...{ 'onSave': {} },
    isVisible: (__VLS_ctx.isPricingModalVisible),
    title: "Pricing and Financial Details",
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
let __VLS_18;
let __VLS_19;
let __VLS_20;
const __VLS_21 = {
    onClose: (...[$event]) => {
        __VLS_ctx.isPricingModalVisible = false;
    }
};
const __VLS_22 = {
    onSave: (...[$event]) => {
        __VLS_ctx.saveSection('pricing');
    }
};
__VLS_17.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
    type: "number",
});
(__VLS_ctx.propertyStore.property.pricing.price);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
    type: "text",
    value: (__VLS_ctx.propertyStore.property.pricing.maintenance),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
    type: "text",
    value: (__VLS_ctx.propertyStore.property.pricing.deposit),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
    type: "text",
    value: (__VLS_ctx.propertyStore.property.pricing.paymentTerms),
});
var __VLS_17;
/** @type {[typeof FormModal, typeof FormModal, ]} */ ;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent(FormModal, new FormModal({
    ...{ 'onClose': {} },
    ...{ 'onSave': {} },
    isVisible: (__VLS_ctx.isFeaturesModalVisible),
    title: "Property Features and Amenities",
}));
const __VLS_24 = __VLS_23({
    ...{ 'onClose': {} },
    ...{ 'onSave': {} },
    isVisible: (__VLS_ctx.isFeaturesModalVisible),
    title: "Property Features and Amenities",
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
let __VLS_26;
let __VLS_27;
let __VLS_28;
const __VLS_29 = {
    onClose: (...[$event]) => {
        __VLS_ctx.isFeaturesModalVisible = false;
    }
};
const __VLS_30 = {
    onSave: (...[$event]) => {
        __VLS_ctx.saveSection('features');
    }
};
__VLS_25.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.openPicker('Furnishing Status', ['Furnished', 'Semi-Furnished', 'Unfurnished'], 'features.furnishing');
        } },
    type: "text",
    value: (__VLS_ctx.propertyStore.property.features.furnishing),
    readonly: true,
    ...{ class: "select-input" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
    type: "text",
    value: (__VLS_ctx.propertyStore.property.features.parking),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
    type: "text",
    value: (__VLS_ctx.propertyStore.property.features.security),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "amenities-group" },
});
for (const [amenity] of __VLS_getVForSourceType((__VLS_ctx.allAmenities))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        key: (amenity),
        ...{ class: "amenity-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
        type: "checkbox",
        value: (amenity),
    });
    (__VLS_ctx.propertyStore.property.features.amenities);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "checkbox-custom" },
    });
    (amenity);
}
var __VLS_25;
/** @type {[typeof FormModal, typeof FormModal, ]} */ ;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent(FormModal, new FormModal({
    ...{ 'onClose': {} },
    ...{ 'onSave': {} },
    isVisible: (__VLS_ctx.isMediaModalVisible),
    title: "Visual Media",
}));
const __VLS_32 = __VLS_31({
    ...{ 'onClose': {} },
    ...{ 'onSave': {} },
    isVisible: (__VLS_ctx.isMediaModalVisible),
    title: "Visual Media",
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
let __VLS_34;
let __VLS_35;
let __VLS_36;
const __VLS_37 = {
    onClose: (...[$event]) => {
        __VLS_ctx.isMediaModalVisible = false;
    }
};
const __VLS_38 = {
    onSave: (...[$event]) => {
        __VLS_ctx.saveSection('media');
    }
};
__VLS_33.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "media-upload-buttons" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.addMedia('photo');
        } },
    ...{ class: "media-btn" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.addMedia('video');
        } },
    ...{ class: "media-btn" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "previews" },
});
if (__VLS_ctx.propertyStore.property.media.photos.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "preview-section" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "preview-grid" },
    });
    for (const [photo, index] of __VLS_getVForSourceType((__VLS_ctx.propertyStore.property.media.photos))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
            key: (index),
            src: (photo.previewUrl),
            ...{ class: "preview-item" },
        });
    }
}
if (__VLS_ctx.propertyStore.property.media.videos.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "preview-section" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "preview-grid" },
    });
    for (const [video, index] of __VLS_getVForSourceType((__VLS_ctx.propertyStore.property.media.videos))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.video, __VLS_intrinsicElements.video)({
            key: (index),
            src: (video.previewUrl),
            ...{ class: "preview-item" },
            controls: true,
        });
    }
}
var __VLS_33;
/** @type {[typeof FormModal, typeof FormModal, ]} */ ;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent(FormModal, new FormModal({
    ...{ 'onClose': {} },
    ...{ 'onSave': {} },
    isVisible: (__VLS_ctx.isContactModalVisible),
    title: "Contact and Owner Information",
}));
const __VLS_40 = __VLS_39({
    ...{ 'onClose': {} },
    ...{ 'onSave': {} },
    isVisible: (__VLS_ctx.isContactModalVisible),
    title: "Contact and Owner Information",
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
let __VLS_42;
let __VLS_43;
let __VLS_44;
const __VLS_45 = {
    onClose: (...[$event]) => {
        __VLS_ctx.isContactModalVisible = false;
    }
};
const __VLS_46 = {
    onSave: (...[$event]) => {
        __VLS_ctx.saveSection('contact');
    }
};
__VLS_41.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
    type: "text",
    value: (__VLS_ctx.propertyStore.property.contact.name),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
    type: "email",
});
(__VLS_ctx.propertyStore.property.contact.email);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
    type: "tel",
});
(__VLS_ctx.propertyStore.property.contact.phone);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.openPicker('Preferred Contact Method', ['Email', 'Phone', 'Either'], 'contact.contactMethod');
        } },
    type: "text",
    value: (__VLS_ctx.propertyStore.property.contact.contactMethod),
    readonly: true,
    ...{ class: "select-input" },
});
var __VLS_41;
/** @type {[typeof FormModal, typeof FormModal, ]} */ ;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent(FormModal, new FormModal({
    ...{ 'onClose': {} },
    ...{ 'onSave': {} },
    isVisible: (__VLS_ctx.isLegalModalVisible),
    title: "Legal and Documentation Details",
}));
const __VLS_48 = __VLS_47({
    ...{ 'onClose': {} },
    ...{ 'onSave': {} },
    isVisible: (__VLS_ctx.isLegalModalVisible),
    title: "Legal and Documentation Details",
}, ...__VLS_functionalComponentArgsRest(__VLS_47));
let __VLS_50;
let __VLS_51;
let __VLS_52;
const __VLS_53 = {
    onClose: (...[$event]) => {
        __VLS_ctx.isLegalModalVisible = false;
    }
};
const __VLS_54 = {
    onSave: (...[$event]) => {
        __VLS_ctx.saveSection('legal');
    }
};
__VLS_49.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
    type: "text",
    value: (__VLS_ctx.propertyStore.property.legal.ownershipDocs),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
    type: "text",
    value: (__VLS_ctx.propertyStore.property.legal.registration),
});
var __VLS_49;
/** @type {[typeof OptionPicker, ]} */ ;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent(OptionPicker, new OptionPicker({
    ...{ 'onClose': {} },
    ...{ 'onSelect': {} },
    isVisible: (__VLS_ctx.isPickerVisible),
    title: (__VLS_ctx.pickerTitle),
    options: (__VLS_ctx.pickerOptions),
}));
const __VLS_56 = __VLS_55({
    ...{ 'onClose': {} },
    ...{ 'onSelect': {} },
    isVisible: (__VLS_ctx.isPickerVisible),
    title: (__VLS_ctx.pickerTitle),
    options: (__VLS_ctx.pickerOptions),
}, ...__VLS_functionalComponentArgsRest(__VLS_55));
let __VLS_58;
let __VLS_59;
let __VLS_60;
const __VLS_61 = {
    onClose: (...[$event]) => {
        __VLS_ctx.isPickerVisible = false;
    }
};
const __VLS_62 = {
    onSelect: (__VLS_ctx.handlePickerSelect)
};
var __VLS_57;
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
    ...{ onChange: (__VLS_ctx.handleFileChange) },
    type: "file",
    ref: "fileInput",
    hidden: true,
});
/** @type {typeof __VLS_ctx.fileInput} */ ;
/** @type {__VLS_StyleScopedClasses['add-property-container']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['form-sections']} */ ;
/** @type {__VLS_StyleScopedClasses['section-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['completed']} */ ;
/** @type {__VLS_StyleScopedClasses['section-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['completed']} */ ;
/** @type {__VLS_StyleScopedClasses['section-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['completed']} */ ;
/** @type {__VLS_StyleScopedClasses['section-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['completed']} */ ;
/** @type {__VLS_StyleScopedClasses['section-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['completed']} */ ;
/** @type {__VLS_StyleScopedClasses['section-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['completed']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['select-input']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['select-input']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['checking-message']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['select-input-display']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['select-input-display']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['select-input-display']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['select-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['amenities-group']} */ ;
/** @type {__VLS_StyleScopedClasses['amenity-label']} */ ;
/** @type {__VLS_StyleScopedClasses['checkbox-custom']} */ ;
/** @type {__VLS_StyleScopedClasses['media-upload-buttons']} */ ;
/** @type {__VLS_StyleScopedClasses['media-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['media-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['previews']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-section']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-item']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-section']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-item']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['select-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            OptionPicker: OptionPicker,
            FormModal: FormModal,
            LocationPicker: LocationPicker,
            propertyStore: propertyStore,
            allAmenities: allAmenities,
            fileInput: fileInput,
            isBasicModalVisible: isBasicModalVisible,
            isPricingModalVisible: isPricingModalVisible,
            isFeaturesModalVisible: isFeaturesModalVisible,
            isMediaModalVisible: isMediaModalVisible,
            isContactModalVisible: isContactModalVisible,
            isLegalModalVisible: isLegalModalVisible,
            isPickerVisible: isPickerVisible,
            pickerTitle: pickerTitle,
            pickerOptions: pickerOptions,
            isCheckingDuplicates: isCheckingDuplicates,
            basicErrors: basicErrors,
            allSectionsCompleted: allSectionsCompleted,
            openSection: openSection,
            saveSection: saveSection,
            openPicker: openPicker,
            addMedia: addMedia,
            handlePickerSelect: handlePickerSelect,
            handleFileChange: handleFileChange,
            previewProperty: previewProperty,
            handleLocationSelected: handleLocationSelected,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
