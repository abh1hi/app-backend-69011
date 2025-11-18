
# Project Blueprint

## Overview

This is a Vue.js single-page application (SPA) for a real estate platform called "Aapna Ashiana". It features a beautiful and modern user interface, a user profile system, a streamlined authentication process, and a comprehensive property listing feature. The application is fully responsive and designed for a great user experience on both mobile and web.

## Implemented Features

*   **Project Setup:** Initialized with Vue.js and Vite.
*   **Modern UI/UX:** A visually engaging interface with a professional color scheme, typography, and responsive layout.
*   **Home Page:**
    *   **99acres Inspired Design:** A clean, modern layout inspired by the popular real estate portal 99acres.com, adapted to our existing UI kit.
    *   **Hero Section:** A prominent hero section with a background image and a new tabbed search interface.
    *   **Dynamic Hero Section Slideshow:** The hero section now features a beautiful, automatic slideshow of property images that fade in and out.
    *   **Tabbed Search:** A detailed search bar allowing users to switch between "Buy" and "Rent" and search by city and budget.
    *   **Quick Actions:** A set of quick action buttons for easy access to key features, redesigned to a new layout.
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
*   **Edit Property Page:**
    *   **Modular Design:** The edit page is broken down into logical, collapsible sections using a new `EditSection.vue` component, making it much easier for users to navigate and find the information they need to update.
    *   **Reusable Components:** The page reuses the same form components from the "Add Property" flow (`BasicInfo.vue`, `PricingInfo.vue`, etc.), making future updates and maintenance much more efficient.
    *   **Full-Fledged Media Management:** Users can now delete existing photos and videos and upload new ones, a critical feature that was missing before.
    *   **Robust Data Handling:** The new `updatePropertyWithMedia` action in the property store ensures that all data and media changes are saved to the database in a single, atomic operation.
    *   **Disabled Location Fields:** The location, city, state, and pincode fields are now disabled in edit mode to prevent users from changing the property's location after it has been listed.
    *   **Number Input Fix:** Added a `min="0"` attribute to number inputs to prevent negative values and fix a bug where empty fields would default to 0.
    *   **Cancel Button:** A "Cancel" button has been added to the `EditProperty.vue` page, allowing users to discard their changes and navigate back to the previous page.
*   **Google Maps API Logging:**
    *   Added a `callback` function to the Google Maps API script in `index.html` to log a confirmation message to the console when the API is loaded.

## Current Task: Add Google Maps API Logging

### Plan

1.  **Add a callback function:** Create a new function `onGoogleMapsApiReady` in a `<script>` tag in the `<head>` of `index.html`.
2.  **Update the script URL:** Add the `callback` parameter to the Google Maps API script URL, pointing to the `onGoogleMapsApiReady` function.
3.  **Add `async` and `defer` attributes:** Ensure the script is loaded asynchronously and deferred until the page has finished parsing.
4.  **Update Blueprint:** Document the new feature in the `blueprint.md` file.
