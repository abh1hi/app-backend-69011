import { ref } from 'vue';
const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    startOpen: {
        type: Boolean,
        default: false,
    },
});
const isOpen = ref(props.startOpen);
const toggle = () => {
    isOpen.value = !isOpen.value;
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "edit-section-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (__VLS_ctx.toggle) },
    ...{ class: "card-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "section-title" },
});
(__VLS_ctx.title);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "toggle-icon" },
});
(__VLS_ctx.isOpen ? '−' : '+');
if (__VLS_ctx.isOpen) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card-content" },
    });
    var __VLS_0 = {};
}
/** @type {__VLS_StyleScopedClasses['edit-section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['card-content']} */ ;
// @ts-ignore
var __VLS_1 = __VLS_0;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            isOpen: isOpen,
            toggle: toggle,
        };
    },
    props: {
        title: {
            type: String,
            required: true,
        },
        startOpen: {
            type: Boolean,
            default: false,
        },
    },
});
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    props: {
        title: {
            type: String,
            required: true,
        },
        startOpen: {
            type: Boolean,
            default: false,
        },
    },
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
