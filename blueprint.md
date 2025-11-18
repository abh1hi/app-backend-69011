# Project Blueprint

## Overview

This project is a real estate application built with Vue.js, Vite, and Firebase. It allows users to browse property listings, view property details, and manage their own properties. The application is designed to be a single-page application (SPA) with a responsive user interface.

## Implemented Features

### Core

*   **Project Setup:** Initialized with Vue.js and Vite.
*   **Firebase Integration:** The application is connected to a Firebase project, utilizing Firestore for the database, Firebase Storage for images, and Firebase Authentication for user management.
*   **Vue.js Framework:** The front end is built using Vue.js with the Composition API and `<script setup>` syntax.
*   **Vite Tooling:** The project uses Vite for fast development and optimized builds.
*   **TypeScript:** The codebase is written in TypeScript for improved type safety and code quality.

### UI/UX & Design

*   **Modern UI/UX:** A visually engaging interface with a professional color scheme, typography, and responsive layout.
*   **Mobile-First Design:** The application is optimized for a native-like experience on mobile devices, with a compact layout, responsive components, and polished styles.
*   **Responsive Navigation:**
    *   A collapsible sidebar for desktop users.
    *   A bottom navigation bar for mobile users.

### Home Page

*   **99acres Inspired Design:** A clean, modern layout inspired by the popular real estate portal 99acres.com, adapted to our existing UI kit.
*   **Hero Section:** A prominent hero section with a background image and a new tabbed search interface.
*   **Dynamic Hero Section Slideshow:** The hero section now features a beautiful, automatic slideshow of property images that fade in and out.
*   **Tabbed Search:** A detailed search bar allowing users to switch between "Buy" and "Rent" and search by city and budget.
*   **Quick Actions:** A set of quick action buttons for easy access to key features, redesigned to a new layout.
*   **Featured Properties:** A grid of featured properties fetched from Cloud Firestore.

### Property & Search

*   **Search Results Page:**
    *   A dedicated page to display properties matching the user's search criteria.
    *   A clean, user-friendly layout for browsing search results.
*   **Property Detail Page:**
    *   **Dynamic Routing:** A reusable page to display the details of any property using a URL like `/property/:id`.
    *   **Image Gallery:** An interactive image gallery with a main image and thumbnails.
    *   **Detailed Information:** Displays the property's title, location, price, size, bedrooms, bathrooms, description, and amenities.
    *   **Contact Card:** A card with the agent's contact information and a "Request Info" button.
    *   **Mobile-Optimized UI:** The page is fully responsive and optimized for a great user experience on mobile devices.
*   **Advanced Property Filtering:**
    *   **Modal UI:** The filter options are presented in a `FormModal` for a consistent and clean user experience.

### User & Authentication

*   **My Properties Page:** A dedicated page for users to view and manage their own property listings.
*   **Dashboard (`Profile.vue`):**
    *   **User Profile Section:** Displays the user's full name and phone number.
    *   **Listed Properties:** A list of all properties the user has listed, displayed in a clean, easy-to-read list format.
    *   **Sign Out Button:** A clear and accessible sign-out button.
*   **Authentication:**
    *   **Firebase Phone Authentication:** Users can sign up or log in using their phone number and a one-time password (OTP) sent via SMS.
    *   **reCAPTCHA:** The application uses reCAPTCHA to protect against spam and abuse.

### Property Management

*   **Guided Property Submission Flow:**
    *   A multi-step modal-based form for creating new property listings.
*   **Edit Property Page:**
    *   **Modular Design:** The edit page is broken down into logical, collapsible sections using a new `EditSection.vue` component, making it much easier for users to navigate and find the information they need to update.
    *   **Reusable Components:** The page reuses the same form components from the "Add Property" flow (`BasicInfo.vue`, `PricingInfo.vue`, etc.), making future updates and maintenance much more efficient.
    *   **Full-Fledged Media Management:** Users can now delete existing photos and videos and upload new ones, a critical feature that was missing before.
    *   **Robust Data Handling:** The new `updatePropertyWithMedia` action in the property store ensures that all data and media changes are saved to the database in a single, atomic operation.
    *   **Disabled Location Fields:** The location, city, state, and pincode fields are now disabled in edit mode to prevent users from changing the property's location after it has been listed.
    *   **Number Input Fix:** Added a `min="0"` attribute to number inputs to prevent negative values and fix a bug where empty fields would default to 0.
    *   **Cancel Button:** A "Cancel" button has been added to the `EditProperty.vue` page, allowing users to discard their changes and navigate back to the previous page.

### Technical

*   **Routing:** Client-side routing with `vue-router`, including protected routes.
*   **State Management:**
    *   **Pinia:** The official state management library for Vue.js, used to manage application state.
*   **Firebase Integration:**
    *   **Firebase SDK v9:** The latest modular Firebase SDK is used for improved performance.
    *   **Firebase Storage:** Media files (photos and videos) are uploaded to Firebase Storage.
    *   **Cloud Firestore:** Property data is saved to Cloud Firestore.
*   **Google Maps API Loading:**
    *   **Best Practices:** The Google Maps API is now loaded using a `useGoogleMaps.ts` composable that follows best practices, including a callback function to ensure the API is fully initialized before use.
    *   **Environment Variables:** The API key is securely stored in a `.env` file and loaded using `import.meta.env.VITE_GOOGLE_MAPS_API_KEY`.

## Current Task: Fix reCAPTCHA Error

### Plan

1.  **Diagnose the Error:** The browser console shows a 401 Unauthorized error related to reCAPTCHA. This typically indicates that the application's domain is not authorized in the Firebase project settings.
2.  **Update `firebase-config.ts`:** Modify the Firebase configuration to dynamically set the `authDomain` based on the environment. For local development (when the hostname is `localhost`), the `authDomain` will be set to `localhost`. For all other environments, it will use the default `authDomain` from the Firebase project.

### Steps Taken

1.  **Read `firebase.json`:** Examined the `firebase.json` file to understand the project's Firebase configuration.
2.  **List Web Apps:** Listed the web apps in the Firebase project to identify the correct app ID.
3.  **Get App Configuration:** Retrieved the SDK configuration for the web app to verify the `authDomain`.
4.  **Update `firebase-config.ts`:** Created a new `firebase-config.ts` file with conditional logic to set the `authDomain` to `localhost` during local development.
5.  **Create `blueprint.md`:** Created this document to outline the project's features and the steps taken to resolve the reCAPTCHA issue.
