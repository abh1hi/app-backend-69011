import { ref } from 'vue';

const isLoaded = ref(false);
let loadingPromise: Promise<void> | null = null;

export function useGoogleMaps() {
  const load = (): Promise<void> => {
    if (isLoaded.value) {
      return Promise.resolve();
    }

    if (loadingPromise) {
      return loadingPromise;
    }

    loadingPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCSW-vvYqBZr3gu1oHLPRvKfMKAcQKCctA&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        isLoaded.value = true;
        console.log("Google Maps API script has been loaded dynamically.");
        resolve();
      };

      script.onerror = (error) => {
        console.error("Error loading Google Maps API script.", error);
        loadingPromise = null; // Allow retrying
        reject(error);
      };

      document.head.appendChild(script);
    });

    return loadingPromise;
  };

  return {
    load,
    isLoaded,
  };
}
