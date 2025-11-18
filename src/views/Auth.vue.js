import { ref, onMounted } from 'vue';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, updateProfile } from 'firebase/auth';
import { useRouter } from 'vue-router';
const isLogin = ref(true);
const name = ref('');
const phoneNumber = ref('');
const otp = ref('');
const otpSent = ref(false);
const error = ref('');
const router = useRouter();
let recaptchaVerifier = null;
let confirmationResult;
onMounted(() => {
    const auth = getAuth();
    // Render the reCAPTCHA widget
    recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'normal', // Make the reCAPTCHA visible
        'callback': () => {
            // reCAPTCHA solved, you can enable the submit button if you want
        },
        'expired-callback': () => {
            // Response expired. Ask user to solve reCAPTCHA again.
            error.value = "reCAPTCHA expired. Please solve it again.";
        }
    });
    recaptchaVerifier.render(); // Explicitly render the widget
});
const sendOtp = async () => {
    error.value = '';
    if (!phoneNumber.value) {
        error.value = 'Please enter a valid phone number.';
        return;
    }
    // Assume Indian country code if not provided
    const formattedPhoneNumber = `+91${phoneNumber.value}`;
    const auth = getAuth();
    if (!recaptchaVerifier) {
        error.value = "reCAPTCHA not initialized.";
        return;
    }
    try {
        confirmationResult = await signInWithPhoneNumber(auth, formattedPhoneNumber, recaptchaVerifier);
        otpSent.value = true;
    }
    catch (err) {
        error.value = `Error sending code: ${err.message}`;
        // Reset reCAPTCHA if an error occurs to allow the user to try again
        recaptchaVerifier.render().then((widgetId) => {
            grecaptcha.reset(widgetId);
        });
    }
};
const verifyOtp = async () => {
    error.value = '';
    if (!otp.value || otp.value.length !== 6) {
        error.value = 'Please enter the 6-digit code.';
        return;
    }
    try {
        const credential = await confirmationResult.confirm(otp.value);
        const user = credential.user;
        if (!isLogin.value && name.value) {
            await updateProfile(user, { displayName: name.value });
        }
        router.push('/dashboard');
    }
    catch (err) {
        error.value = `Error verifying code: ${err.message}`;
    }
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
        placeholder: "Phone Number",
        required: true,
    });
    (__VLS_ctx.phoneNumber);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        id: "recaptcha-container",
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
    });
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
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.isLogin = !__VLS_ctx.isLogin;
            __VLS_ctx.error = '';
        } },
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
            sendOtp: sendOtp,
            verifyOtp: verifyOtp,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
