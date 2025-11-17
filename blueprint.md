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
    *   **Ui Inspiration:** The UI is inpisre by IOS 14 Cocoa Touch and Android 16 Material UI. It is a blend of both.
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
    *   **Centralized User State:** A new `user` store (`src/stores/user.ts`) has been created to manage the user's authentication state. This provides a single source of truth for the user's data and eliminates redundant API calls.
    *   **Optimized Data Fetching & Caching:**
        *   **List Caching:** The `property` store (`src/stores/property.ts`) caches lists of properties (e.g., for "My Properties", "Featured Properties"). The `useInfiniteScroll` composable leverages this cache to avoid refetching lists of data.
        *   **Individual Property Caching:** The store also caches individual property details. When a user visits a property page, the data is fetched once and then served from the cache on subsequent visits, making navigation back to the same property instantaneous.
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
*   **Smoother Android Navigation:** Optimized the Android back button behavior by removing an unnecessary `setTimeout` delay in `src/main.ts`. This makes the navigation feel more responsive and native.

## Current Task: Optimize Android Back Button Navigation

### Plan

1.  **Optimize Back Button Logic:** Removed the `setTimeout` and simplified the logic in `src/main.ts` for a more responsive back button.
2.  **Update Blueprint:** Documented the navigation improvement in the `blueprint.md` file.
