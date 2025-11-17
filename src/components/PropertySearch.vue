<template>
  <div class="search-container">
    <div class="search-bar">
      <input type="text" placeholder="Search for a property..." class="search-input">
      <button class="search-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// No script logic needed for this component yet.
</script>

<style scoped>
.search-container {
  margin-top: 2rem;
}

.search-bar {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  border: 0.5px solid rgba(255, 255, 255, 0.8);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.search-bar:focus-within {
  box-shadow: 0 12px 40px rgba(0, 122, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}

.search-input {
  flex-grow: 1;
  border: none;
  padding: 16px 20px;
  font-size: 1rem;
  background-color: transparent;
  color: var(--text-primary);
  font-weight: 400;
  letter-spacing: -0.2px;
}

.search-input:focus {
  outline: none;
}

.search-input::placeholder {
  color: var(--text-secondary);
  opacity: 0.6;
  font-weight: 400;
}

.search-btn {
  background: var(--primary-blue);
  border: none;
  color: white;
  padding: 0 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  min-width: 56px;
}

.search-btn:active {
  transform: scale(0.95);
  background: #0051d5;
}

@media (min-width: 768px) {
  .search-btn:hover {
    background: #0051d5;
  }
}

.search-btn svg {
  width: 20px;
  height: 20px;
}

@media (max-width: 768px) {
  .search-bar {
    border-radius: 14px;
    max-width: 100%;
  }

  .search-input {
    padding: 14px 18px;
    font-size: 0.9375rem;
  }

  .search-btn {
    padding: 0 18px;
    min-width: 52px;
  }

  .search-btn svg {
    width: 20px;
    height: 20px;
  }
}
</style>
