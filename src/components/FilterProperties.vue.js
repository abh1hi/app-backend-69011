import { ref, onMounted, watch } from 'vue';
import FormModal from './FormModal.vue';
import { usePropertyStore } from '../stores/property';
const __VLS_props = defineProps();
const emit = defineEmits(['apply-filters', 'close']);
const propertyStore = usePropertyStore();
const saleOrRent = ref('sale');
const price = ref(0);
const selectedState = ref('');
const highestPrice = ref(50000000);
const bedrooms = ref(0);
const bathrooms = ref(0);
const highestSqft = ref(10000);
const lowestSqft = ref(0);
const minSqft = ref(0);
const maxSqft = ref(10000);
const propertyType = ref('');
const availableAmenities = ref(['Parking', 'Pool', 'Gym', 'Security', 'Balcony', 'Pet Friendly']);
const selectedAmenities = ref([]);
onMounted(async () => {
    propertyStore.fetchAvailableStates();
    highestPrice.value = await propertyStore.fetchHighestPrice();
    price.value = highestPrice.value;
    highestSqft.value = await propertyStore.fetchHighestSqft();
    lowestSqft.value = await propertyStore.fetchLowestSqft();
    minSqft.value = lowestSqft.value;
    maxSqft.value = highestSqft.value;
});
watch(minSqft, (newMin) => {
    if (newMin > maxSqft.value) {
        maxSqft.value = newMin;
    }
});
watch(maxSqft, (newMax) => {
    if (newMax < minSqft.value) {
        minSqft.value = newMax;
    }
});
const applyFilters = () => {
    const saleOrRentValue = saleOrRent.value === 'sale' ? 'For Sale' : 'For Rent';
    emit('apply-filters', {
        saleOrRent: saleOrRentValue,
        priceRange: [0, price.value],
        state: selectedState.value,
        bedrooms: bedrooms.value,
        bathrooms: bathrooms.value,
        sqftRange: [minSqft.value, maxSqft.value],
        propertyType: propertyType.value,
        amenities: selectedAmenities.value
    });
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['filter-options']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-options']} */ ;
/** @type {__VLS_StyleScopedClasses['price-range']} */ ;
/** @type {__VLS_StyleScopedClasses['price-range']} */ ;
/** @type {__VLS_StyleScopedClasses['min-slider']} */ ;
/** @type {__VLS_StyleScopedClasses['max-slider']} */ ;
/** @type {__VLS_StyleScopedClasses['number-input']} */ ;
/** @type {__VLS_StyleScopedClasses['number-input']} */ ;
/** @type {__VLS_StyleScopedClasses['amenity-label']} */ ;
// CSS variable injection 
// CSS variable injection end 
/** @type {[typeof FormModal, typeof FormModal, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(FormModal, new FormModal({
    ...{ 'onSave': {} },
    ...{ 'onClose': {} },
    isVisible: (__VLS_ctx.isVisible),
    title: "Filter Properties",
}));
const __VLS_1 = __VLS_0({
    ...{ 'onSave': {} },
    ...{ 'onClose': {} },
    isVisible: (__VLS_ctx.isVisible),
    title: "Filter Properties",
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    onSave: (__VLS_ctx.applyFilters)
};
const __VLS_7 = {
    onClose: (...[$event]) => {
        __VLS_ctx.$emit('close');
    }
};
var __VLS_8 = {};
__VLS_2.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "filter-properties" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "filter-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "filter-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "filter-options" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.saleOrRent = 'sale';
        } },
    ...{ class: ({ active: __VLS_ctx.saleOrRent === 'sale' }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.saleOrRent = 'rent';
        } },
    ...{ class: ({ active: __VLS_ctx.saleOrRent === 'rent' }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "filter-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "filter-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "price-range" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.price.toLocaleString());
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: "range",
    min: "0",
    max: (__VLS_ctx.highestPrice),
    step: "10000",
});
(__VLS_ctx.price);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "filter-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "filter-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
    value: (__VLS_ctx.selectedState),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
for (const [state] of __VLS_getVForSourceType((__VLS_ctx.propertyStore.availableStates))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (state),
        value: (state),
    });
    (state);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "filter-group-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "filter-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "filter-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "number-input" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.bedrooms > 0 && __VLS_ctx.bedrooms--;
        } },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.bedrooms);
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.bedrooms++;
        } },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "filter-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "filter-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "number-input" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.bathrooms > 0 && __VLS_ctx.bathrooms--;
        } },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.bathrooms);
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.bathrooms++;
        } },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "filter-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "filter-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "range-slider" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "range-values" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.minSqft.toLocaleString());
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.maxSqft.toLocaleString());
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "slider-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: "range",
    min: (__VLS_ctx.lowestSqft),
    max: (__VLS_ctx.highestSqft),
    step: "100",
    ...{ class: "min-slider" },
});
(__VLS_ctx.minSqft);
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: "range",
    min: (__VLS_ctx.lowestSqft),
    max: (__VLS_ctx.highestSqft),
    step: "100",
    ...{ class: "max-slider" },
});
(__VLS_ctx.maxSqft);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "filter-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "filter-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
    value: (__VLS_ctx.propertyType),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "filter-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "filter-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "amenities-grid" },
});
for (const [amenity] of __VLS_getVForSourceType((__VLS_ctx.availableAmenities))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        key: (amenity),
        ...{ class: "amenity-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
        type: "checkbox",
        value: (amenity),
    });
    (__VLS_ctx.selectedAmenities);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (amenity);
}
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['filter-properties']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-label']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-options']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-label']} */ ;
/** @type {__VLS_StyleScopedClasses['price-range']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-label']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group-row']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-label']} */ ;
/** @type {__VLS_StyleScopedClasses['number-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-label']} */ ;
/** @type {__VLS_StyleScopedClasses['number-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-label']} */ ;
/** @type {__VLS_StyleScopedClasses['range-slider']} */ ;
/** @type {__VLS_StyleScopedClasses['range-values']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-container']} */ ;
/** @type {__VLS_StyleScopedClasses['min-slider']} */ ;
/** @type {__VLS_StyleScopedClasses['max-slider']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-label']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-label']} */ ;
/** @type {__VLS_StyleScopedClasses['amenities-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['amenity-label']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            FormModal: FormModal,
            propertyStore: propertyStore,
            saleOrRent: saleOrRent,
            price: price,
            selectedState: selectedState,
            highestPrice: highestPrice,
            bedrooms: bedrooms,
            bathrooms: bathrooms,
            highestSqft: highestSqft,
            lowestSqft: lowestSqft,
            minSqft: minSqft,
            maxSqft: maxSqft,
            propertyType: propertyType,
            availableAmenities: availableAmenities,
            selectedAmenities: selectedAmenities,
            applyFilters: applyFilters,
        };
    },
    emits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    emits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
