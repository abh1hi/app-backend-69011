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
  min-height: 80vh;
  background-color: var(--background-color-soft);
}

.auth-container {
  width: 100%;
  max-width: 420px;
  padding: 3rem 2.5rem;
  text-align: center;
  background-color: var(--white);
  border-radius: 24px;
  box-shadow: 0 15px 50px rgba(0,0,0,0.1);
}

.auth-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 0.8rem;
}

.auth-subtitle {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 2.5rem;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group input {
  width: 100%;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid var(--card-border-light);
  background-color: var(--background-color-soft);
  font-size: 1rem;
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.input-group input:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.15);
}

.error-message {
  color: #ff3b30;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.auth-button {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(45deg, var(--primary-blue), #00c6ff);
  color: var(--white);
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(0, 122, 255, 0.2);
}

.auth-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 122, 255, 0.3);
}

.toggle-auth {
  margin-top: 2rem;
  color: var(--primary-blue);
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
}

#recaptcha-container {
  margin: 1.5rem auto;
  display: flex;
  justify-content: center;
}

</style>
