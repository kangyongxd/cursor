<template>
  <div id="app" style="padding:24px;">
    <router-link to="/demo1">Demo1</router-link> |
    <router-link to="/demo2">Demo2</router-link>
    <br />
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>