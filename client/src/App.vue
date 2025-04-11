<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/logs">Logs</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
</script>

<style scoped>
nav {
  margin-bottom: 5px;
}
nav a {
  margin-right: 10px;
  text-decoration: none;
  color: blue;
}
</style>