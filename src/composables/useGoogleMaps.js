import { ref } from 'vue';
const isLoaded = ref(false);
export function useGoogleMaps() {
    const load = () => {
        if (isLoaded.value) {
            return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
            const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
            if (!apiKey || apiKey === 'YOUR_API_KEY') {
                console.error('Google Maps API key is not set. Please set it in your .env file.');
                return reject(new Error('Google Maps API key is not set.'));
            }
            const callbackName = 'googleMapsApiLoadedCallback';
            window[callbackName] = () => {
                isLoaded.value = true;
                delete window[callbackName];
                resolve();
            };
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=${callbackName}`;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
            script.onerror = () => {
                console.error('Failed to load Google Maps script.');
                delete window[callbackName];
                reject(new Error('Failed to load Google Maps script.'));
            };
        });
    };
    return {
        load,
        isLoaded,
    };
}
