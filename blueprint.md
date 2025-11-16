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

## Current Task: "Load More" Button

### Plan

1.  **`src/composables/useInfiniteScroll.ts`:**
    *   **Problem:** The infinite scroll was causing a loop and repeatedly loading the same data.
    *   **Solution:**
        *   Removed the scroll event listener.
        *   Exposed the `hasMore` flag and the `loadMoreDocuments` function.
2.  **`src/views/Profile.vue`:**
    *   **Problem:** The profile page was using an infinite scroll to load properties.
    *   **Solution:**
        *   Replaced the infinite scroll with a "Load More" button.
        *   The button is only visible when there are more properties to load.
        *   Clicking the button calls the `loadMoreDocuments` function.
3.  **`src/components/FeaturedProperties.vue`:**
    *   **Problem:** The featured properties list was not paginated.
    *   **Solution:**
        *   Refactored the component to use the `useInfiniteScroll` composable.
        *   Added a "Load More" button to fetch additional properties.
4.  **`src/views/MyProperties.vue`:**
    *   **Problem:** The component was fetching all of a user's properties at once, which is inefficient.
    *   **Solution:**
        *   Refactored the component to use the `useInfiniteScroll` composable.
        *   Added a "Load More" button to paginate the user's properties.
5.  **`src/views/Properties.vue`:**
    *   **Problem:** The "Available Properties" page was using an infinite scroll but was missing the "Load More" button.
    *   **Solution:**
        *   Added a "Load More" button to the component.
        *   The button is only visible when there are more properties to load.
        *   Clicking the button calls the `loadMoreDocuments` function.
