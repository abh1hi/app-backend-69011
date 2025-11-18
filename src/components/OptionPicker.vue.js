import { defineProps, defineEmits } from 'vue';
const __VLS_props = defineProps({
    isVisible: Boolean,
    title: String,
    options: Array
});
const emit = defineEmits(['close', 'select']);
const close = () => {
    emit('close');
};
const selectOption = (option) => {
    emit('select', option);
    close();
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['picker-container']} */ ;
/** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['picker-body']} */ ;
/** @type {__VLS_StyleScopedClasses['picker-option']} */ ;
/** @type {__VLS_StyleScopedClasses['picker-option']} */ ;
/** @type {__VLS_StyleScopedClasses['picker-option']} */ ;
// CSS variable injection 
// CSS variable injection end 
if (__VLS_ctx.isVisible) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (__VLS_ctx.close) },
        ...{ class: "picker-overlay" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "picker-container" },
        ...{ class: ({ 'is-visible': __VLS_ctx.isVisible }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "picker-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "picker-title" },
    });
    (__VLS_ctx.title);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.close) },
        ...{ class: "close-btn" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "picker-body" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({});
    for (const [option] of __VLS_getVForSourceType((__VLS_ctx.options))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.isVisible))
                        return;
                    __VLS_ctx.selectOption(option);
                } },
            key: (option),
            ...{ class: "picker-option" },
        });
        (option);
    }
}
/** @type {__VLS_StyleScopedClasses['picker-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['picker-container']} */ ;
/** @type {__VLS_StyleScopedClasses['is-visible']} */ ;
/** @type {__VLS_StyleScopedClasses['picker-header']} */ ;
/** @type {__VLS_StyleScopedClasses['picker-title']} */ ;
/** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['picker-body']} */ ;
/** @type {__VLS_StyleScopedClasses['picker-option']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            close: close,
            selectOption: selectOption,
        };
    },
    emits: {},
    props: {
        isVisible: Boolean,
        title: String,
        options: Array
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    emits: {},
    props: {
        isVisible: Boolean,
        title: String,
        options: Array
    },
});
; /* PartiallyEnd: #4569/main.vue */
