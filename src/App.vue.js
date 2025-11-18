import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Sidebar from './components/Sidebar.vue';
import BottomNav from './components/BottomNav.vue';
import { useAuth } from './composables/useAuth';
const isSidebarOpen = ref(false);
const router = useRouter();
const transitionName = ref('slide-forward');
const { user, googleSignIn, signOut } = useAuth();
// Track navigation direction for animations
router.beforeEach((to, from) => {
    const toDepth = to.path.split('/').length;
    const fromDepth = from.path.split('/').length;
    // Determine if we're going forward or backward
    if (toDepth > fromDepth) {
        transitionName.value = 'slide-forward';
    }
    else if (toDepth < fromDepth) {
        transitionName.value = 'slide-back';
    }
    else {
        // Same depth, check route names for common patterns
        const forwardRoutes = ['PropertyDetails', 'AddProperty', 'PreviewProperty'];
        const backwardRoutes = ['Home', 'Properties'];
        if (forwardRoutes.includes(to.name) && !forwardRoutes.includes(from.name)) {
            transitionName.value = 'slide-forward';
        }
        else if (backwardRoutes.includes(to.name)) {
            transitionName.value = 'slide-back';
        }
        else {
            transitionName.value = 'fade';
        }
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['hamburger-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['hamburger-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['user-profile']} */ ;
/** @type {__VLS_StyleScopedClasses['user-profile']} */ ;
/** @type {__VLS_StyleScopedClasses['main-container']} */ ;
/** @type {__VLS_StyleScopedClasses['hamburger-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['header-title']} */ ;
/** @type {__VLS_StyleScopedClasses['app-header']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['user-profile']} */ ;
/** @type {__VLS_StyleScopedClasses['hamburger-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['overlay']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    id: "app-container",
});
/** @type {[typeof Sidebar, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(Sidebar, new Sidebar({
    ...{ 'onClose': {} },
    isOpen: (__VLS_ctx.isSidebarOpen),
}));
const __VLS_1 = __VLS_0({
    ...{ 'onClose': {} },
    isOpen: (__VLS_ctx.isSidebarOpen),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    onClose: (...[$event]) => {
        __VLS_ctx.isSidebarOpen = false;
    }
};
var __VLS_2;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "main-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "app-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.isSidebarOpen = !__VLS_ctx.isSidebarOpen;
        } },
    ...{ class: "hamburger-menu" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    xmlns: "http://www.w3.org/2000/svg",
    width: "28",
    height: "28",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "2",
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.line, __VLS_intrinsicElements.line)({
    x1: "3",
    y1: "12",
    x2: "21",
    y2: "12",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.line, __VLS_intrinsicElements.line)({
    x1: "3",
    y1: "6",
    x2: "21",
    y2: "6",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.line, __VLS_intrinsicElements.line)({
    x1: "3",
    y1: "18",
    x2: "21",
    y2: "18",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "header-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "user-profile" },
});
if (!__VLS_ctx.user) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.googleSignIn) },
    });
}
if (__VLS_ctx.user) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: (__VLS_ctx.user.photoUrl || ''),
        alt: "User Profile",
        ...{ class: "profile-pic" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.signOut) },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "main-content" },
});
const __VLS_7 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({}));
const __VLS_9 = __VLS_8({}, ...__VLS_functionalComponentArgsRest(__VLS_8));
{
    const { default: __VLS_thisSlot } = __VLS_10.slots;
    const [{ Component, route }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_11 = {}.Transition;
    /** @type {[typeof __VLS_components.Transition, typeof __VLS_components.Transition, ]} */ ;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
        name: (__VLS_ctx.transitionName),
        mode: "out-in",
    }));
    const __VLS_13 = __VLS_12({
        name: (__VLS_ctx.transitionName),
        mode: "out-in",
    }, ...__VLS_functionalComponentArgsRest(__VLS_12));
    __VLS_14.slots.default;
    const __VLS_15 = ((Component));
    // @ts-ignore
    const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
        key: (route.path),
    }));
    const __VLS_17 = __VLS_16({
        key: (route.path),
    }, ...__VLS_functionalComponentArgsRest(__VLS_16));
    var __VLS_14;
    __VLS_10.slots['' /* empty slot name completion */];
}
var __VLS_10;
/** @type {[typeof BottomNav, ]} */ ;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent(BottomNav, new BottomNav({}));
const __VLS_20 = __VLS_19({}, ...__VLS_functionalComponentArgsRest(__VLS_19));
if (__VLS_ctx.isSidebarOpen) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.isSidebarOpen))
                    return;
                __VLS_ctx.isSidebarOpen = false;
            } },
        ...{ class: "overlay" },
    });
}
/** @type {__VLS_StyleScopedClasses['main-container']} */ ;
/** @type {__VLS_StyleScopedClasses['app-header']} */ ;
/** @type {__VLS_StyleScopedClasses['hamburger-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['header-title']} */ ;
/** @type {__VLS_StyleScopedClasses['user-profile']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-pic']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['overlay']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Sidebar: Sidebar,
            BottomNav: BottomNav,
            isSidebarOpen: isSidebarOpen,
            transitionName: transitionName,
            user: user,
            googleSignIn: googleSignIn,
            signOut: signOut,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
