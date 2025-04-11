<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-link" active-class="active-link">
          <i class="pi pi-home"></i> Home
        </router-link>
        <router-link to="/logs" class="nav-link" active-class="active-link">
          <i class="pi pi-list"></i> Logs
        </router-link>
      </div>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background: linear-gradient(135deg, #2c3e50, #4a6491);
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: #ecf0f1;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.active-link {
  background-color: #3498db;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.main-content {
  flex: 1;
  padding: 2rem 1.5rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

/* Responsive design */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
    gap: 0.5rem;
  }
  
  .nav-link {
    font-size: 1rem;
    padding: 0.5rem;
  }
}

@media (max-width: 480px) {
  .nav-container {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .nav-link {
    justify-content: center;
  }
  
  .main-content {
    padding: 1rem;
  }
}
</style>