
# Project Blueprint

## Overview

This is a Vue.js single-page application (SPA) for a real estate platform called "Aapna Ashiana". It features a beautiful and modern user interface, a user profile system, a streamlined authentication process, and a comprehensive property listing feature. The application is fully responsive and designed for a great user experience on both mobile and web.

## Implemented Features

*   **Project Setup:** Initialized with Vue.js and Vite.
*   **Modern UI/UX:** A visually engaging interface with a professional color scheme, typography, and responsive layout.
*   **Home Page:**
    *   **99acres Inspired Design:** A clean, modern layout inspired by the popular real estate portal 99acres.com, adapted to our existing UI kit.
    *   **Hero Section:** A prominent hero section with a background image and a new tabbed search interface.
    *   **Tabbed Search:** A detailed search bar allowing users to switch between "Buy" and "Rent" and search by city and budget.
    *   **Quick Actions:** A set of quick action buttons for easy access to key features, redesigned to match the new layout.
    *   **Featured Properties:** A grid of featured properties fetched from Cloud Firestore.
    *   **Mobile-First Design:** The home page is optimized for a native-like experience on mobile devices, with a compact layout, responsive components, and polished styles.
*   **Search Results Page:**
    *   A dedicated page to display properties matching the user's search criteria.
    *   A clean, user-friendly layout for browsing search results.
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
*   **Advanced Property Filtering:**
    *   **Modal UI:** The filter options are presented in a `FormModal` for a consistent and clean user experience.
*   **Authentication:**
    *   **Firebase Phone Authentication:** Users can sign up or log in using their phone number and a one-time password (OTP) sent via SMS.
*   **Routing:** Client-side routing with `vue-router`, including protected routes.
*   **State Management:**
    *   **Pinia:** The official state management library for Vue.js, used to manage application state.
*   **Responsive Navigation:**
    *   A collapsible sidebar for desktop users.
    *   A bottom navigation bar for mobile users.
*   **Guided Property Submission Flow:**
    *   A multi-step modal-based form for creating new property listings.
*   **Firebase Integration:**
    *   **Firebase SDK v9:** The latest modular Firebase SDK is used for improved performance.
    *   **Firebase Storage:** Media files (photos and videos) are uploaded to Firebase Storage.
    *   **Cloud Firestore:** Property data is saved to Cloud Firestore.

## Current Task: Change currency to INR

### Plan

1.  **Update `blueprint.md`**: Add the new search results page to the project blueprint.
2.  **Create `src/views/SearchResults.vue`**: Create a new component to display search results.
3.  **Update `src/router/index.ts`**: Add a new route for the search results page.
4.  **Update `src/components/HomeSearch.vue`**: Add logic to navigate to the search results page on search.
