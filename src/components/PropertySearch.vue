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
  background-color: var(--white);
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  border: 1px solid var(--card-border-light);
}

.search-input {
  flex-grow: 1;
  border: none;
  padding: 1.1rem 1.3rem;
  font-size: 1rem;
  background-color: transparent;
  color: var(--text-primary);
}

.search-input:focus {
  outline: none;
}

.search-input::placeholder {
  color: var(--text-secondary);
}

.search-btn {
  background: linear-gradient(45deg, var(--primary-blue), #00c6ff);
  border: none;
  color: white;
  padding: 0 1.6rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.search-btn:hover {
  background: linear-gradient(45deg, #0072e6, #00b5f5);
}

.search-btn svg {
  width: 24px;
  height: 24px;
}

@media (max-width: 768px) {
  .search-bar {
    border-radius: 12px;
  }

  .search-input {
    padding: 1rem 1.1rem;
    font-size: 0.95rem;
  }

  .search-btn {
    padding: 0 1.4rem;
  }

  .search-btn svg {
    width: 22px;
    height: 22px;
  }
}
</style>
