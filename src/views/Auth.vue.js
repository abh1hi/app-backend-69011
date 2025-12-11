import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, updateProfile, signInWithCredential, PhoneAuthProvider, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { Capacitor } from '@capacitor/core';
import UserRoleModal from '../components/UserRoleModal.vue';
import IDUploadActionSheet from '../components/IDUploadActionSheet.vue';
import { useUserStore } from '../stores/user';
const isLogin = ref(true);
const name = ref('');
const phoneNumber = ref('');
const otp = ref('');
const otpSent = ref(false);
const error = ref('');
const isLoading = ref(false);
const showRoleModal = ref(false);
const showUploadSheet = ref(false);
const selectedRole = ref(null);
const router = useRouter();
const userStore = useUserStore();
// Web Auth variables
let recaptchaVerifier = null;
let confirmationResult = null;
const verificationId = ref(null);
let phoneCodeSentListener = null;
onMounted(async () => {
    if (Capacitor.isNativePlatform()) {
        try {
            phoneCodeSentListener = await FirebaseAuthentication.addListener('phoneCodeSent', (result) => {
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
        }
        catch (e) {
            console.error('Failed to add listener', e);
        }
    }
});
onUnmounted(() => {
    if (phoneCodeSentListener) {
        phoneCodeSentListener.remove();
    }
});
const sendOtp = async () => {
    if (!phoneNumber.value || phoneNumber.value.length < 10) {
        error.value = 'Please enter a valid phone number';
        return;
    }
    error.value = '';
    isLoading.value = true;
    try {
        const formattedPhone = phoneNumber.value.startsWith('+') ? phoneNumber.value : `+91${phoneNumber.value}`;
        const auth = getAuth(); // Ensure auth is initialized
        if (Capacitor.isNativePlatform()) {
            // Native Flow
            const result = await FirebaseAuthentication.signInWithPhoneNumber({
                phoneNumber: formattedPhone,
            });
            verificationId.value = result.verificationId;
        }
        else {
            // Web Flow
            if (!recaptchaVerifier) {
                recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                    'size': 'invisible',
                    'callback': () => {
                        // reCAPTCHA solved, allow signInWithPhoneNumber.
                    }
                });
            }
            confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
        }
        otpSent.value = true;
    }
    catch (err) {
        console.error('Auth Error:', err);
        error.value = err.message || 'Failed to send OTP. Please try again.';
    }
    finally {
        isLoading.value = false;
    }
};
const verifyOtp = async () => {
    if (!otp.value || otp.value.length < 6) {
        error.value = 'Please enter a valid 6-digit OTP';
        return;
    }
    error.value = '';
    isLoading.value = true;
    try {
        const auth = getAuth();
        if (Capacitor.isNativePlatform()) {
            if (!verificationId.value)
                throw new Error('Verification ID missing');
            const credential = PhoneAuthProvider.credential(verificationId.value, otp.value);
            await signInWithCredential(auth, credential);
        }
        else {
            if (!confirmationResult)
                throw new Error('No confirmation result');
            await confirmationResult.confirm(otp.value);
        }
        // Check if new user
        if (!auth.currentUser)
            throw new Error('User not logged in after verification');
        if (!isLogin.value && name.value) {
            await updateProfile(auth.currentUser, { displayName: name.value });
            // New User Flow: Show Role Modal
            showRoleModal.value = true;
        }
        else {
            resetState();
            router.push('/dashboard');
        }
    }
    catch (err) {
        console.error('Auth Verification Error:', err);
        error.value = err.message || 'Invalid OTP. Please try again.';
    }
    finally {
        isLoading.value = false;
    }
};
const handleRoleSelection = async (role) => {
    selectedRole.value = role;
    showRoleModal.value = false;
    if (role === 'dealer') {
        showUploadSheet.value = true;
    }
    else {
        // Buyer Flow: Create Profile and Go
        await createProfileAndRedirect({ role: 'buyer' });
    }
};
const handleDocumentUpload = async (file) => {
    const auth = getAuth();
    if (!auth.currentUser)
        return;
    try {
        isLoading.value = true;
        const downloadURL = await userStore.uploadUserDocument(auth.currentUser.uid, file);
        await createProfileAndRedirect({
            role: 'dealer',
            documents: { aadharCardUrl: downloadURL },
            isVerified: false // Dealers need verification?
        });
    }
    catch (e) {
        console.error('Upload failed', e);
        error.value = 'Document upload failed. Please try again.';
    }
    finally {
        isLoading.value = false;
        showUploadSheet.value = false;
    }
};
const createProfileAndRedirect = async (profileData) => {
    const auth = getAuth();
    if (!auth.currentUser)
        return;
    try {
        await userStore.createUserProfile(auth.currentUser.uid, profileData);
        resetState();
        router.push('/dashboard');
    }
    catch (e) {
        console.error('Profile creation failed', e);
        error.value = 'Failed to create profile.';
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
    showRoleModal.value = false;
    showUploadSheet.value = false;
    selectedRole.value = null;
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
if (__VLS_ctx.showRoleModal) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    /** @type {[typeof UserRoleModal, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(UserRoleModal, new UserRoleModal({
        ...{ 'onSelectRole': {} },
        isVisible: (__VLS_ctx.showRoleModal),
    }));
    const __VLS_1 = __VLS_0({
        ...{ 'onSelectRole': {} },
        isVisible: (__VLS_ctx.showRoleModal),
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    let __VLS_3;
    let __VLS_4;
    let __VLS_5;
    const __VLS_6 = {
        onSelectRole: (__VLS_ctx.handleRoleSelection)
    };
    var __VLS_2;
}
if (__VLS_ctx.showUploadSheet) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    /** @type {[typeof IDUploadActionSheet, ]} */ ;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(IDUploadActionSheet, new IDUploadActionSheet({
        ...{ 'onUploadComplete': {} },
        isVisible: (__VLS_ctx.showUploadSheet),
    }));
    const __VLS_8 = __VLS_7({
        ...{ 'onUploadComplete': {} },
        isVisible: (__VLS_ctx.showUploadSheet),
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    let __VLS_10;
    let __VLS_11;
    let __VLS_12;
    const __VLS_13 = {
        onUploadComplete: (__VLS_ctx.handleDocumentUpload)
    };
    var __VLS_9;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    id: "recaptcha-container",
});
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
            UserRoleModal: UserRoleModal,
            IDUploadActionSheet: IDUploadActionSheet,
            isLogin: isLogin,
            name: name,
            phoneNumber: phoneNumber,
            otp: otp,
            otpSent: otpSent,
            error: error,
            isLoading: isLoading,
            showRoleModal: showRoleModal,
            showUploadSheet: showUploadSheet,
            sendOtp: sendOtp,
            verifyOtp: verifyOtp,
            handleRoleSelection: handleRoleSelection,
            handleDocumentUpload: handleDocumentUpload,
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
