import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getAuth, onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { useRouter } from 'vue-router';

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);
  const loading = ref(true);
  const auth = getAuth();
  const router = useRouter();

  let unsubscribe: (() => void) | null = null;

  const listenForAuthStateChanges = () => {
    if (unsubscribe) return;

    unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      user.value = currentUser;
      loading.value = false;
      if (!currentUser) {
        router.push('/login');
      }
    });
  };

  const stopListeningForAuthStateChanges = () => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return {
    user,
    loading,
    listenForAuthStateChanges,
    stopListeningForAuthStateChanges,
    logout,
  };
});
