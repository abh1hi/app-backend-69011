
import { ref } from 'vue';
import { FirebaseAuthentication, type User } from '@capacitor-firebase/authentication';

export function useAuth() {
  const user = ref<User | null>(null);

  FirebaseAuthentication.getCurrentUser().then(result => {
    user.value = result.user;
  });

  const googleSignIn = async () => {
    try {
      const result = await FirebaseAuthentication.signInWithGoogle();
      console.log('Google Sign-In successful:', result);
      user.value = result.user;
    } catch (error) {
      console.error('Google Sign-In failed:', error);
    }
  };

  const signOut = async () => {
    try {
      await FirebaseAuthentication.signOut();
      user.value = null;
    } catch (error) {
      console.error('Sign Out failed:', error);
    }
  };

  return {
    user,
    googleSignIn,
    signOut,
  };
}
