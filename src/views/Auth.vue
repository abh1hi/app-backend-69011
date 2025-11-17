<template>
  <div class="auth-page">
    <div class="auth-container">
      <h2 class="auth-title">{{ isLogin ? 'Welcome Back' : 'Create Account' }}</h2>
      
      <div v-if="!otpSent">
        <p class="auth-subtitle">{{ isLogin ? 'Enter your phone number to sign in.' : 'Create an account with your name and phone number.' }}</p>
        <form @submit.prevent="sendOtp">
          <div class="input-group" v-if="!isLogin">
            <input type="text" v-model="name" placeholder="Full Name" required>
          </div>
          <div class="input-group">
            <input type="tel" v-model="phoneNumber" placeholder="Phone Number" required>
          </div>
          <div id="recaptcha-container"></div>
          <p v-if="error" class="error-message">{{ error }}</p>
          <button type="submit" class="auth-button">Send Code</button>
        </form>
      </div>

      <div v-else>
         <p class="auth-subtitle">We've sent a code to +91{{ phoneNumber }}.</p>
        <form @submit.prevent="verifyOtp">
          <div class="input-group">
            <input type="text" v-model="otp" placeholder="6-Digit Code" required>
          </div>
          <p v-if="error" class="error-message">{{ error }}</p>
          <button type="submit" class="auth-button">Verify Code</button>
        </form>
      </div>

      <p class="toggle-auth" @click="isLogin = !isLogin; error = ''">
        {{ isLogin ? 'Need an account? Sign Up' : 'Have an account? Login' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, updateProfile } from 'firebase/auth';
import { useRouter } from 'vue-router';

declare const grecaptcha: any;

const isLogin = ref(true);
const name = ref('');
const phoneNumber = ref('');
const otp = ref('');
const otpSent = ref(false);
const error = ref('');
const router = useRouter();
let recaptchaVerifier: RecaptchaVerifier | null = null;
let confirmationResult: any;

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
  } catch (err: any) {
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
  } catch (err: any) {
    error.value = `Error verifying code: ${err.message}`;
  }
};

</script>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(0, 122, 255, 0.05) 0%, rgba(255, 255, 255, 1) 100%);
  padding: 1.5rem;
}

.auth-container {
  width: 100%;
  max-width: 420px;
  padding: 2rem 1.5rem;
  text-align: center;
  background-color: var(--white);
  border-radius: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 122, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

@media (min-width: 640px) {
  .auth-container {
    padding: 3rem 2.5rem;
  }
}

.auth-title {
  font-size: 1.875rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  letter-spacing: -0.03em;
}

@media (min-width: 640px) {
  .auth-title {
    font-size: 2.25rem;
    margin-bottom: 1rem;
  }
}

.auth-subtitle {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
}

@media (min-width: 640px) {
  .auth-subtitle {
    font-size: 1rem;
    margin-bottom: 2.5rem;
  }
}

.input-group {
  margin-bottom: 1.25rem;
}

.input-group input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1.5px solid rgba(0, 122, 255, 0.15);
  background-color: rgba(0, 122, 255, 0.02);
  font-size: 16px;
  color: var(--text-primary);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  min-height: 44px;
  -webkit-appearance: none;
  appearance: none;
}

@media (min-width: 768px) {
  .input-group input {
    padding: 14px 16px;
    min-height: 48px;
    font-size: 1rem;
    border-radius: 14px;
  }
}

.input-group input:focus {
  outline: none;
  border-color: var(--primary-blue);
  background-color: var(--white);
  box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
}

.input-group input::placeholder {
  color: var(--text-secondary);
  opacity: 0.6;
}

.error-message {
  color: #ff3b30;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.75rem;
  background: rgba(255, 59, 48, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(255, 59, 48, 0.2);
}

.auth-button {
  width: 100%;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--primary-blue), #0051d5);
  color: var(--white);
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 122, 255, 0.3);
  letter-spacing: 0.02em;
  min-height: 52px;
}

.auth-button:active {
  transform: scale(0.98);
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
}

@media (min-width: 768px) {
  .auth-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 122, 255, 0.4);
  }
}

.toggle-auth {
  margin-top: 2rem;
  color: var(--primary-blue);
  cursor: pointer;
  font-size: 0.9375rem;
  font-weight: 600;
  padding: 0.75rem;
  border-radius: 12px;
  transition: all 0.2s;
  display: inline-block;
}

.toggle-auth:active {
  background: rgba(0, 122, 255, 0.1);
  transform: scale(0.98);
}

@media (min-width: 768px) {
  .toggle-auth:hover {
    background: rgba(0, 122, 255, 0.1);
  }
}

#recaptcha-container {
  margin: 1.5rem auto;
  display: flex;
  justify-content: center;
  border-radius: 12px;
  overflow: hidden;
}

</style>
