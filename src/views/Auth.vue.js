import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, updateProfile, signInWithCredential, PhoneAuthProvider } from 'firebase/auth';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { Capacitor } from '@capacitor/core';
const isLogin = ref(true);
const name = ref('');
const phoneNumber = ref('');
const otp = ref('');
const otpSent = ref(false);
const error = ref('');
const isLoading = ref(false);
const router = useRouter();
const verificationId = ref(null);
const listeners = [];
onMounted(async () => {
    if (Capacitor.isNativePlatform()) {
        try {
            const phoneCodeSentListener = await FirebaseAuthentication.addListener('phoneCodeSent', (result) => {
                if (result && result.verificationId) {
                    verificationId.value = result.verificationId;
                    otpSent.value = true;
                    isLoading.value = false;
                    error.value = '';
                }
                else {
                    error.value = 'Failed to get verification ID. Please try again.';
                    isLoading.value = false;
                }
            });
            listeners.push(phoneCodeSentListener);
        }
        catch (e) {
            console.error('Failed to add listener', e);
        }
    }
});
onUnmounted(() => {
    listeners.forEach(listener => listener.remove());
});
const sendOtp = async () => {
    error.value = '';
    isLoading.value = true;
    if (!phoneNumber.value) {
        error.value = 'Please enter a valid phone number.';
        isLoading.value = false;
        return;
    }
    if (!Capacitor.isNativePlatform()) {
        error.value = 'Phone authentication is only available on the native app.';
        isLoading.value = false;
        return;
    }
    const formattedPhoneNumber = `+91${phoneNumber.value}`;
    try {
        await FirebaseAuthentication.signInWithPhoneNumber({ phoneNumber: formattedPhoneNumber });
    }
    catch (err) {
        console.error('Capacitor Firebase Auth Error (signInWithPhoneNumber):', err);
        error.value = `Error sending code: ${err.message || 'Failed to initiate sign-in.'}`;
        isLoading.value = false;
    }
};
const verifyOtp = async () => {
    error.value = '';
    isLoading.value = true;
    if (!otp.value || otp.value.length !== 6) {
        error.value = 'Please enter the 6-digit code.';
        isLoading.value = false;
        return;
    }
    if (!verificationId.value) {
        error.value = 'Could not verify OTP. Please try sending the code again.';
        isLoading.value = false;
        return;
    }
    try {
        const auth = getAuth();
        const credential = PhoneAuthProvider.credential(verificationId.value, otp.value);
        const result = await signInWithCredential(auth, credential);
        const user = result.user;
        if (!user) {
            throw new Error("Authentication failed, no user returned.");
        }
        if (!isLogin.value && name.value && auth.currentUser) {
            await updateProfile(auth.currentUser, { displayName: name.value });
        }
        resetState();
        router.push('/dashboard');
    }
    catch (err) {
        console.error('Capacitor Firebase Auth Error (verifyOtp):', err);
        error.value = `Error verifying code: ${err.message || 'Invalid code or session.'}`;
    }
    finally {
        isLoading.value = false;
    }
};
const resetState = () => {
    name.value = '';
    phoneNumber.value = '';
    otp.value = '';
    otpSent.value = false;
    error.value = '';
    isLoading.value = false;
    verificationId.value = null;
};
const toggleAuthMode = () => {
    isLogin.value = !isLogin.value;
    resetState();
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['auth-container']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-title']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-button']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-button']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-button']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-auth']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-auth']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "auth-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "auth-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "auth-title" },
});
(__VLS_ctx.isLogin ? 'Welcome Back' : 'Create Account');
if (!__VLS_ctx.otpSent) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "auth-subtitle" },
    });
    (__VLS_ctx.isLogin ? 'Enter your phone number to sign in.' : 'Create an account with your name and phone number.');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
        ...{ onSubmit: (__VLS_ctx.sendOtp) },
    });
    if (!__VLS_ctx.isLogin) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "input-group" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
            type: "text",
            value: (__VLS_ctx.name),
            placeholder: "Full Name",
            required: true,
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "input-group" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
        type: "tel",
        placeholder: "Phone Number (e.g., 9876543210)",
        required: true,
    });
    (__VLS_ctx.phoneNumber);
    if (__VLS_ctx.error) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "error-message" },
        });
        (__VLS_ctx.error);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        type: "submit",
        ...{ class: "auth-button" },
        disabled: (__VLS_ctx.isLoading),
    });
    if (!__VLS_ctx.isLoading) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "auth-subtitle" },
    });
    (__VLS_ctx.phoneNumber);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
        ...{ onSubmit: (__VLS_ctx.verifyOtp) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "input-group" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
        type: "text",
        value: (__VLS_ctx.otp),
        placeholder: "6-Digit Code",
        required: true,
    });
    if (__VLS_ctx.error) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "error-message" },
        });
        (__VLS_ctx.error);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        type: "submit",
        ...{ class: "auth-button" },
        disabled: (__VLS_ctx.isLoading),
    });
    if (!__VLS_ctx.isLoading) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ onClick: (__VLS_ctx.toggleAuthMode) },
    ...{ class: "toggle-auth" },
});
(__VLS_ctx.isLogin ? 'Need an account? Sign Up' : 'Have an account? Login');
/** @type {__VLS_StyleScopedClasses['auth-page']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-container']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-title']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-button']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-button']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-auth']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            isLogin: isLogin,
            name: name,
            phoneNumber: phoneNumber,
            otp: otp,
            otpSent: otpSent,
            error: error,
            isLoading: isLoading,
            sendOtp: sendOtp,
            verifyOtp: verifyOtp,
            toggleAuthMode: toggleAuthMode,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
