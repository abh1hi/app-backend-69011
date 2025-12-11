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

    <div v-if="showRoleModal">
      <UserRoleModal 
        :isVisible="showRoleModal" 
        @select-role="handleRoleSelection"
      />
    </div>

    <div v-if="showUploadSheet">
      <IDUploadActionSheet 
        :isVisible="showUploadSheet"
        @upload-complete="handleDocumentUpload"
      />
    </div>

    <div id="recaptcha-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, updateProfile, signInWithCredential, PhoneAuthProvider, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';

import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { Capacitor, type PluginListenerHandle } from '@capacitor/core';
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
const selectedRole = ref<'buyer' | 'dealer' | null>(null);

const router = useRouter();
const userStore = useUserStore();

// Web Auth variables
let recaptchaVerifier: RecaptchaVerifier | null = null;
let confirmationResult: any | null = null;

const verificationId = ref<string | null>(null);
let phoneCodeSentListener: PluginListenerHandle | null = null;

onMounted(async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      phoneCodeSentListener = await FirebaseAuthentication.addListener('phoneCodeSent', (result: any) => {
        if (result && result.verificationId) {
          verificationId.value = result.verificationId;
          otpSent.value = true;
          isLoading.value = false;
          error.value = '';
        } else {
          error.value = 'Failed to get verification ID. Please try again.';
          isLoading.value = false;
        }
      });
    } catch(e) {
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
      }) as any;
      verificationId.value = result.verificationId;
    } else {
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
    
  } catch (err: any) {
    console.error('Auth Error:', err);
    error.value = err.message || 'Failed to send OTP. Please try again.';
  } finally {
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
      if (!verificationId.value) throw new Error('Verification ID missing');
      const credential = PhoneAuthProvider.credential(verificationId.value, otp.value);
      await signInWithCredential(auth, credential);
    } else {
      if (!confirmationResult) throw new Error('No confirmation result');
      await confirmationResult.confirm(otp.value);
    }
    
    // Check if new user
    if (!auth.currentUser) throw new Error('User not logged in after verification');
    
    if (!isLogin.value && name.value) {
      await updateProfile(auth.currentUser, { displayName: name.value });
       // New User Flow: Show Role Modal
      showRoleModal.value = true;
    } else {
      resetState();
      router.push('/dashboard');
    }

  } catch (err: any) {
    console.error('Auth Verification Error:', err);
    error.value = err.message || 'Invalid OTP. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

const handleRoleSelection = async (role: 'buyer' | 'dealer') => {
  selectedRole.value = role;
  showRoleModal.value = false;

  if (role === 'dealer') {
    showUploadSheet.value = true;
  } else {
    // Buyer Flow: Create Profile and Go
    await createProfileAndRedirect({ role: 'buyer' });
  }
};

const handleDocumentUpload = async (file: File) => {
  const auth = getAuth();
  if (!auth.currentUser) return;

  try {
    isLoading.value = true;
    const downloadURL = await userStore.uploadUserDocument(auth.currentUser.uid, file);
    await createProfileAndRedirect({ 
      role: 'dealer', 
      documents: { aadharCardUrl: downloadURL },
      isVerified: false // Dealers need verification?
    });
  } catch (e: any) {
    console.error('Upload failed', e);
    error.value = 'Document upload failed. Please try again.';
  } finally {
    isLoading.value = false;
    showUploadSheet.value = false;
  }
};

const createProfileAndRedirect = async (profileData: any) => {
  const auth = getAuth();
  if (!auth.currentUser) return;

  try {
    await userStore.createUserProfile(auth.currentUser.uid, profileData);
    resetState();
    router.push('/dashboard');
  } catch (e) {
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