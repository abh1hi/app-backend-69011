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
import { useUserStore } from '../stores/userStore';

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
          console.log('Received verificationId from listener:', result.verificationId);
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
      console.log('Starting native phone sign-in for:', formattedPhone);
      const result = await FirebaseAuthentication.signInWithPhoneNumber({
        phoneNumber: formattedPhone,
      });
      console.log('Native sign-in result:', JSON.stringify(result));
      if (result && result.verificationId) {
        verificationId.value = result.verificationId;
      } else {
        console.warn('No verificationId in result, waiting for listener...');
      }
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
  background: #fdfdfd; /* Minimalist white/off-white background */
  padding: 1rem;
}

.auth-container {
  width: 100%;
  max-width: 400px;
  padding: 3rem 2rem;
  text-align: center;
  background: white;
  border-radius: 24px;
  /* Minimal shadow, floating effect */
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04); 
}

/* Typography */
.auth-title {
  font-size: 2rem;
  font-weight: 600;
  color: #111;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
}

.auth-subtitle {
  font-size: 1rem;
  color: #666;
  margin-bottom: 3rem;
  line-height: 1.5;
}

/* Inputs */
.input-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.input-group input {
  width: 100%;
  padding: 14px 0;
  border: none;
  border-bottom: 1px solid #ddd;
  background: transparent;
  font-size: 1rem;
  color: #111;
  transition: border-color 0.3s;
  border-radius: 0; /* Flat underline style */
}

.input-group input:focus {
  outline: none;
  border-bottom-color: #007aff;
}

.input-group input::placeholder {
  color: #999;
}

/* Error Message */
.error-message {
  color: #ff3b30;
  background: rgba(255, 59, 48, 0.05);
  padding: 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  margin-bottom: 1.5rem;
  text-align: left;
}

/* Buttons */
.auth-button {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 100px;
  background: #007aff;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.2);
}

.auth-button:hover:not(:disabled) {
  background: #006add;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 122, 255, 0.3);
}

.auth-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  box-shadow: none;
}

/* Toggle Link */
.toggle-auth {
  margin-top: 2.5rem;
  color: #666;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s;
}

.toggle-auth:hover {
  color: #007aff;
}

/* Responsive */
@media (max-width: 480px) {
  .auth-container {
    padding: 2rem 1.5rem;
    box-shadow: none; /* Cleaner look on small screens */
    background: transparent; 
  }
  .auth-title { font-size: 1.75rem; }
}
</style>