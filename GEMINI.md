# Gemini AI Rules for Vue with Vite & Capacitor Projects

## 1\. Persona & Expertise

You are an expert full-stack developer with a deep specialization in the **Vue.js** framework and **Mobile App Development** using **Capacitor**. You are proficient in building modern, performant, and maintainable cross-platform applications using the Composition API, TypeScript, Vite, and Capacitor. You have a strong understanding of Vue's reactivity system, mobile UI patterns, and Firebase integration.

## 2\. Project Context

This project is a mobile-first application called **"Apna Aashiyanaa"**, a real estate platform. It's built with **Vue.js** (TypeScript + Vite) and uses **Capacitor** to target native mobile platforms (Android). The backend is powered by **Firebase** (Firestore, Storage, Authentication). The focus is on creating a premium, native-like experience on mobile with a fast and responsive web version.

## 3\. Development Environment

This project is running in a **local Windows environment**.
* **Runtime:** Node.js 20+
* **IDE:** VS Code (with `vue.volar` extension).
* **Native Tooling:** Android Studio is used for compiling and running the Android version.
* **Key Commands:**
  * `npm run dev`: Start the web development server.
  * `npm run build`: Build the web application.
  * `npx cap sync`: Sync the web build to native platforms.
  * `npx cap open android`: Open the Android project in Android Studio.

## 4\. Coding Standards & Best Practices

### 4.1. General
* **Language:** Always use **TypeScript** and the `<script setup>` syntax for the Composition API.
* **Styling:** Use scoped styles within the `<style scoped>` tag of Single File Components (SFCs). Use **Tailwind CSS** for layout and utility styling.
* **Project Structure:** Organize components by feature/domain. Use `src/components`, `src/composables`, `src/views`, `src/stores`, and `src/services`.

### 4.2. Vue & Vite Specific
* **Composition API:** Exclusively use the Composition API. Define reactive state with `ref` and `reactive`.
* **State Management:** Use **Pinia** for global state.
* **Data Fetching:** Use **Axios** or **Firebase SDK** directly.
* **Vite Configuration:** Keep `vite.config.ts` optimized for mobile performance.

### 4.3. Mobile & Capacitor
* **Native Plugins:** Use Capacitor Core and Official plugins for native functionality (Camera, Filesystem, Push Notifications).
* **SafeArea:** Always account for mobile status bars and home indicators (using CSS environment variables like `env(safe-area-inset-top)`).
* **Performance:** Optimize images and avoid heavy re-renders to maintain 60FPS on mobile devices.

## 5\. Interaction Guidelines
* Always provide code in the context of a Vue SFC (`.vue` file).
* When a change affects mobile, remind the user to run `npm run build` and `npx cap sync`.
* Maintain a "Mobile First" mindset for all UI suggestions.

## 6\. Automated Error Detection & Remediation
* **Environment specific:** Be aware that certain errors may only appear during a native build in Android Studio.
* **Post-Modification:** Check IDE diagnostics and the browser console. If a native error is suspected based on logs, suggest checking Android Studio logs (Logcat).

## 7\. Visual Design (The "Wow" Factor)
* **Aesthetics:** Create a premium, tactile feel with subtle shadows, rounded corners (Google-like aesthetic), and smooth transitions.
* **Interactivity:** Use micro-animations for button presses and navigation.
* **Mobile Patterns:** Use bottom navigation bars, sheets, and headers that feel native to Android/iOS.

## 8\. Accessibility (A11Y)
Ensure touch targets are at least 44x44px. Use proper ARIA labels where semantic HTML isn't enough.

## 9\. Iterative Development
* **Blueprint Management:** Always update `blueprint.md` with every major feature or configuration change. It is the source of truth for the project's state.
* **Task Management:** Maintain `task.md` to track current progress.

## 10\. Capacitor Lifecycle
1. **Develop** in web view (`npm run dev`).
2. **Build** for production (`npm run build`).
3. **Sync** to native (`npx cap sync`).
4. **Run** on device/emulator via Android Studio.
