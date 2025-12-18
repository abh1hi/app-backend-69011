<template>
  <div class="contact-page container-refined animate-up">
    <!-- Header Section -->
    <section class="contact-header">
      <h1 class="page-title">Contact <span class="highlight-blue">Us</span></h1>
      <p class="page-subtitle">We're here to help you find your perfect home.</p>
    </section>

    <div class="contact-info-container">
      <!-- Info Cards -->
      <div class="contact-info-section">
        <div class="info-card glass-panel animate-up-delayed">
          <div class="icon-box">
            <span class="material-symbols-outlined">call</span>
          </div>
          <div class="info-text">
            <h3>Phone Number</h3>
            <p><a href="tel:+919982665455" class="contact-link">+91 99826 65455</a></p>
          </div>
        </div>

        <div class="info-card glass-panel animate-up-delayed-more">
          <div class="icon-box">
            <span class="material-symbols-outlined">mail</span>
          </div>
          <div class="info-text">
            <h3>Email Address</h3>
            <p><a href="mailto:apnaaashiyanaa05@gmail.com" class="contact-link">apnaaashiyanaa05@gmail.com</a></p>
          </div>
        </div>

        <div class="info-card glass-panel animate-up-delayed-extra">
          <div class="icon-box">
            <span class="material-symbols-outlined">location_on</span>
          </div>
          <div class="info-text">
            <h3>Our Office</h3>
            <p>Jaipur, Rajasthan, India</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// No logic needed for now as the form is removed
</script>

<style scoped>
.contact-page {
  padding: 8rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
}

.contact-header {
  text-align: center;
  margin-bottom: 5rem;
}

.highlight-blue {
  color: #007aff;
}

.page-title {
  font-size: 3.5rem;
  font-weight: 800;
  letter-spacing: -2px;
  line-height: 1.1;
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: 1.25rem;
  color: #666;
  font-weight: 400;
}

.contact-info-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.contact-info-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 600px;
  width: 100%;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  border-radius: 24px;
}

.icon-box {
  width: 56px;
  height: 56px;
  background: #f0f7ff;
  color: #007aff;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-box .material-symbols-outlined {
  font-size: 2rem;
}

.info-text h3 {
  font-size: 1rem;
  color: #888;
  font-weight: 500;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.info-text p {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.contact-link {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s;
}

.contact-link:hover {
  color: #007aff;
}

/* Animations */
.animate-up {
  animation: fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
.animate-up-delayed {
  animation: fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s both;
}
.animate-up-delayed-more {
  animation: fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s both;
}
.animate-up-delayed-extra {
  animation: fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s both;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 1024px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}

@media (max-width: 768px) {
  .page-title { font-size: 2.8rem; }
  .contact-form { padding: 2rem; }
  .form-grid { grid-template-columns: 1fr; }
}
</style>
