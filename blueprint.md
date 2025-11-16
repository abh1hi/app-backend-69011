# Project Blueprint

## Overview

This is a Vue.js single-page application (SPA) for a real estate platform called "Aapna Ashiana". It features a beautiful and modern user interface, a user profile system, a streamlined authentication process, and a comprehensive property listing feature. The application is fully responsive and designed for a great user experience on both mobile and web.

## Implemented Features

*   **Project Setup:** Initialized with Vue.js and Vite.
*   **Modern UI/UX:** A visually engaging interface with a professional color scheme, typography, and responsive layout.
*   **Home Page:**
    *   **Modern Aesthetics:** A clean, visually balanced layout with modern components and polished styles.
    *   **Hero Section:** A prominent hero section with a search bar and a tagline.
    *   **Quick Actions:** A set of quick action buttons for easy access to key features.
    *   **Featured Properties:** A grid of featured properties fetched from Cloud Firestore.
    *   **Mobile-First Design:** The home page is optimized for a native-like experience on mobile devices, with a compact layout, responsive components, and polished styles.
*   **My Properties Page:** A dedicated page for users to view and manage their own property listings.
*   **Dashboard (`Profile.vue`):**
    *   **User Profile Section:** Displays the user's full name and phone number.
    *   **Listed Properties:** A list of all properties the user has listed, displayed in a clean, easy-to-read list format.
    *   **Sign Out Button:** A clear and accessible sign-out button.
*   **Property Detail Page:**
    *   **Dynamic Routing:** A reusable page to display the details of any property using a URL like `/property/:id`.
    *   **Image Gallery:** An interactive image gallery with a main image and thumbnails.
    *   **Detailed Information:** Displays the property's title, location, price, size, bedrooms, bathrooms, description, and amenities.
    *   **Contact Card:** A card with the agent's contact information and a "Request Info" button.
    *   **Mobile-Optimized UI:** The page is fully responsive and optimized for a great user experience on mobile devices.
*   **Authentication:**
    *   **Firebase Phone Authentication:** Users can sign up or log in using their phone number and a one-time password (OTP) sent via SMS.
*   **Routing:** Client-side routing with `vue-router`, including protected routes.
*   **State Management:**
    *   **Pinia:** The official state management library for Vue.js, used to manage the state of the property being created.
*   **Responsive Navigation:**
    *   A collapsible sidebar for desktop users.
    *   A bottom navigation bar for mobile users.
*   **Guided Property Submission Flow:**
    *   A multi-step form for creating new property listings, with each section in its own modal.
    *   Section completion tracking with visual feedback (buttons turn green).
    *   A conditional "Preview" button that appears only after all sections are completed.
    *   A dedicated preview page for reviewing all details and media before final submission.
*   **Firebase Integration:**
    *   **Firebase SDK v9:** The latest modular Firebase SDK is used for improved performance and code maintainability.
    *   **Firebase Storage:** Media files (photos and videos) are uploaded to Firebase Storage.
    *   **Cloud Firestore:** Property data, including media URLs and the owner's ID, is saved to Cloud Firestore.
*   **Reusable Components:**
    *   **`PropertySearch.vue`:** A search bar component for the hero section.
    *   **`QuickActions.vue`:** A component for the quick action buttons.
    *   **`FeaturedProperties.vue`:** A component to display a grid of featured properties.
    *   **`PropertyCard.vue`:** A component to display a single property listing in a modern, card-based layout.
    *   **`OptionPicker.vue`:** A mobile-friendly, iOS-style option picker.
    *   **`FormModal.vue`:** A reusable modal component with a "Save" button for a better user experience.

## Current Task: Bug Fixes (Completed)

### Plan

1.  **`src/composables/useInfiniteScroll.ts`:**
    *   The `queryConstraints` parameter in the `useInfiniteScroll.ts` composable was not being properly referenced, which was causing a build error. I have corrected this by properly referencing the parameter.
2.  **`src/views/AddProperty.vue`:**
    *   The `MediaItem` interface was declared but never used. I have removed the unused interface.
    *   The `submitProperty` function was declared but never used. I have removed the unused function.
3.  **`src/views/Auth.vue`:**
    *   `grecaptcha` was not defined. I have declared it as a global variable.
4.  **`src/views/PreviewProperty.vue`:**
    *   `previewUrl` and `file` did not exist on type `never`. I have added the `MediaItem` interface to the component and cast the `propertyData` as `any` before deleting the `media` property.
5.  **`src/views/Profile.vue`:**
    *   `Ref` from `vue` was declared but its value was never read. I have removed the unused import.
6.  **`src/views/PropertyDetails.vue`:**
    *   A string or undefined was not assignable to a string. I have added a null check to the `newVal.mediaUrls.photos[0]` to ensure that the value is not undefined.
7.  **`src/stores/property.ts`:**
    *   The type of `this` was not correctly inferred in the `updateProperty` action. I have explicitly typed `this` to fix this.
