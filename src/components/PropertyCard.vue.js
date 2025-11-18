import { useRouter } from 'vue-router';
const props = defineProps({
    property: {
        type: Object,
        required: true
    },
    showOwnerActions: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits(['edit', 'delete']);
const router = useRouter();
const viewDetails = () => {
    if (!props.showOwnerActions) {
        router.push({ name: 'PropertyDetails', params: { id: props.property.id } });
    }
};
const onEdit = () => {
    emit('edit', props.property.id);
};
const onDelete = () => {
    emit('delete', props.property.id);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['property-card']} */ ;
/** @type {__VLS_StyleScopedClasses['property-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-image']} */ ;
/** @type {__VLS_StyleScopedClasses['property-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-image']} */ ;
/** @type {__VLS_StyleScopedClasses['details-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['delete-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['details-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['delete-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['details-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['delete-btn']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (__VLS_ctx.viewDetails) },
    ...{ class: "property-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-image" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    src: (__VLS_ctx.property.mediaUrls?.photos?.[0] || 'https://placehold.co/600x400/png'),
    alt: "Property Image",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "image-overlay" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "property-type-badge" },
});
(__VLS_ctx.property.basic?.propertyType);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-content" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "property-title" },
});
(__VLS_ctx.property.basic?.title);
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "property-location" },
});
(__VLS_ctx.property.basic?.location);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "property-specs" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "spec-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "spec-icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.property.basic?.bedrooms || 'N/A');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "spec-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "spec-icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.property.basic?.bathrooms || 'N/A');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "spec-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "spec-icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.property.basic?.size || 'N/A');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-footer" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "property-price" },
});
(__VLS_ctx.property.pricing?.price ? __VLS_ctx.property.pricing.price.toLocaleString() : 'N/A');
if (__VLS_ctx.showOwnerActions) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "owner-actions" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.onEdit) },
        ...{ class: "edit-btn" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.onDelete) },
        ...{ class: "delete-btn" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ class: "details-btn" },
    });
}
/** @type {__VLS_StyleScopedClasses['property-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-image']} */ ;
/** @type {__VLS_StyleScopedClasses['image-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['property-type-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['card-content']} */ ;
/** @type {__VLS_StyleScopedClasses['property-title']} */ ;
/** @type {__VLS_StyleScopedClasses['property-location']} */ ;
/** @type {__VLS_StyleScopedClasses['property-specs']} */ ;
/** @type {__VLS_StyleScopedClasses['spec-item']} */ ;
/** @type {__VLS_StyleScopedClasses['spec-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['spec-item']} */ ;
/** @type {__VLS_StyleScopedClasses['spec-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['spec-item']} */ ;
/** @type {__VLS_StyleScopedClasses['spec-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['card-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['property-price']} */ ;
/** @type {__VLS_StyleScopedClasses['owner-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['delete-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['details-btn']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            viewDetails: viewDetails,
            onEdit: onEdit,
            onDelete: onDelete,
        };
    },
    emits: {},
    props: {
        property: {
            type: Object,
            required: true
        },
        showOwnerActions: {
            type: Boolean,
            default: false
        }
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    emits: {},
    props: {
        property: {
            type: Object,
            required: true
        },
        showOwnerActions: {
            type: Boolean,
            default: false
        }
    },
});
; /* PartiallyEnd: #4569/main.vue */
