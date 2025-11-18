import { ref, onMounted, onUnmounted } from 'vue';
import HomeSearch from '../components/HomeSearch.vue';
import QuickActions from '../components/QuickActions.vue';
import FeaturedProperties from '../components/FeaturedProperties.vue';
const images = ref([
    'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2592&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2670&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605146769289-440113cc3d00?q=80&w=2670&auto=format&fit=crop',
]);
const currentImageIndex = ref(0);
let intervalId = null;
onMounted(() => {
    intervalId = setInterval(() => {
        currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length;
    }, 5000); // Change image every 5 seconds
});
onUnmounted(() => {
    clearInterval(intervalId);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['hero-title']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-section']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-title']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-subtitle']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "home-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hero-section" },
});
const __VLS_0 = {}.TransitionGroup;
/** @type {[typeof __VLS_components.TransitionGroup, typeof __VLS_components.transitionGroup, typeof __VLS_components.TransitionGroup, typeof __VLS_components.transitionGroup, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    name: "fade",
    tag: "div",
    ...{ class: "hero-background" },
}));
const __VLS_2 = __VLS_1({
    name: "fade",
    tag: "div",
    ...{ class: "hero-background" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
for (const [image, index] of __VLS_getVForSourceType((__VLS_ctx.images))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (index),
        ...{ class: "hero-image" },
        ...{ style: ({ backgroundImage: `url(${image})` }) },
    });
    __VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (index === __VLS_ctx.currentImageIndex) }, null, null);
}
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hero-overlay" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hero-content" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "hero-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "hero-subtitle" },
});
/** @type {[typeof HomeSearch, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(HomeSearch, new HomeSearch({}));
const __VLS_5 = __VLS_4({}, ...__VLS_functionalComponentArgsRest(__VLS_4));
/** @type {[typeof QuickActions, ]} */ ;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(QuickActions, new QuickActions({}));
const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
/** @type {[typeof FeaturedProperties, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(FeaturedProperties, new FeaturedProperties({}));
const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
/** @type {__VLS_StyleScopedClasses['home-container']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-section']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-background']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-image']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-content']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-title']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-subtitle']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            HomeSearch: HomeSearch,
            QuickActions: QuickActions,
            FeaturedProperties: FeaturedProperties,
            images: images,
            currentImageIndex: currentImageIndex,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
