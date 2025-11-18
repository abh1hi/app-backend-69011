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
            <input type="tel" v-model="phoneNumber" placeholder="Phone Number (e.g., 9876543210)" required>
          </div>
          <!-- reCAPTCHA container is no longer needed for native auth -->
          <p v-if="error" class="error-message">{{ error }}</p>
          <button type="submit" class="auth-button" :disabled="isLoading">
            <span v-if="!isLoading">Send Code</span>
            <span v-else>Sending...</span>
          </button>
        </form>
      </div>

      <div v-else>
         <p class="auth-subtitle">We've sent a code to +91{{ phoneNumber }}.</p>
        <form @submit.prevent="verifyOtp">
          <div class="input-group">
            <input type="text" v-model="otp" placeholder="6-Digit Code" required>
          </div>
          <p v-if="error" class="error-message">{{ error }}</p>
          <button type="submit" class="auth-button" :disabled="isLoading">
            <span v-if="!isLoading">Verify Code</span>
            <span v-else>Verifying...</span>
          </button>
        </form>
      </div>

      <p class="toggle-auth" @click="toggleAuthMode">
        {{ isLogin ? 'Need an account? Sign Up' : 'Have an account? Login' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, updateProfile } from 'firebase/auth';
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

// This will store the verification ID from the native Firebase SDK
const verificationId = ref<string | null>(null);

const sendOtp = async () => {
  error.value = '';
  isLoading.value = true;
  if (!phoneNumber.value) {
    error.value = 'Please enter a valid phone number.';
    isLoading.value = false;
    return;
  }

  // Ensure this is running on a native platform
  if (!Capacitor.isNativePlatform()) {
    error.value = 'Phone authentication is only available on the native app.';
    isLoading.value = false;
    return;
  }

  const formattedPhoneNumber = `+91${phoneNumber.value}`;

  try {
    const result = await FirebaseAuthentication.signInWithPhoneNumber({
      phoneNumber: formattedPhoneNumber,
    });
    verificationId.value = result.verificationId;
    otpSent.value = true;
    error.value = ''; // Clear previous errors
  } catch (err: any) {
    console.error('Capacitor Firebase Auth Error:', err);
    error.value = `Error sending code: ${err.message || 'An unknown error occurred.'}`;
  } finally {
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
    // Use the verificationId and otp to create a credential
    const result = await FirebaseAuthentication.signInWithCredential({
      verificationId: verificationId.value,
      verificationCode: otp.value,
    });

    const user = result.user;
    if (!user) {
      throw new Error("Authentication failed, no user returned.");
    }
    
    // If signing up, update the user's profile with their name
    if (!isLogin.value && name.value) {
      const auth = getAuth();
      if(auth.currentUser){
         await updateProfile(auth.currentUser, { displayName: name.value });
      }
    }

    // Reset state and navigate
    resetState();
    router.push('/dashboard');

  } catch (err: any) {
    console.error('Capacitor Firebase Auth Error:', err);
    error.value = `Error verifying code: ${err.message || 'Invalid code or session.'}`;
  } finally {
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
}

const toggleAuthMode = () => {
  isLogin.value = !isLogin.value;
  resetState();
}
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
  min-height: 44px;
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
  min-height: 52px;
}

.auth-button:disabled {
  background: #e0e0e0;
  color: #9e9e9e;
  cursor: not-allowed;
  box-shadow: none;
}

.auth-button:active {
  transform: scale(0.98);
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
}

@media (min-width: 768px) {
  .auth-button:hover:not(:disabled) {
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
</style>