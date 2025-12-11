import { ref } from 'vue';
const __VLS_props = defineProps();
const emit = defineEmits();
const selectedRole = ref(null);
const selectRole = (role) => {
    selectedRole.value = role;
};
const confirmSelection = () => {
    if (selectedRole.value) {
        emit('select-role', selectedRole.value);
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['role-card']} */ ;
/** @type {__VLS_StyleScopedClasses['role-card']} */ ;
/** @type {__VLS_StyleScopedClasses['role-info']} */ ;
/** @type {__VLS_StyleScopedClasses['role-card']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['radio-indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['role-card']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['radio-indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['continue-btn']} */ ;
// CSS variable injection 
// CSS variable injection end 
if (__VLS_ctx.isVisible) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "modal-overlay" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "modal-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: "modal-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "modal-subtitle" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "role-cards" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.isVisible))
                    return;
                __VLS_ctx.selectRole('buyer');
            } },
        ...{ class: "role-card" },
        ...{ class: ({ active: __VLS_ctx.selectedRole === 'buyer' }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "role-icon" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "role-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "radio-indicator" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.isVisible))
                    return;
                __VLS_ctx.selectRole('dealer');
            } },
        ...{ class: "role-card" },
        ...{ class: ({ active: __VLS_ctx.selectedRole === 'dealer' }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "role-icon" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "role-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "radio-indicator" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.confirmSelection) },
        ...{ class: "continue-btn" },
        disabled: (!__VLS_ctx.selectedRole),
    });
}
/** @type {__VLS_StyleScopedClasses['modal-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-content']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-title']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['role-cards']} */ ;
/** @type {__VLS_StyleScopedClasses['role-card']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['role-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['role-info']} */ ;
/** @type {__VLS_StyleScopedClasses['radio-indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['role-card']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['role-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['role-info']} */ ;
/** @type {__VLS_StyleScopedClasses['radio-indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['continue-btn']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            selectedRole: selectedRole,
            selectRole: selectRole,
            confirmSelection: confirmSelection,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
