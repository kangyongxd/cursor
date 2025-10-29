<template>
  <div id="app" style="padding:24px;">
    <h3>iview Cascader 每项 tooltip 演示</h3>
    <CascaderWithTooltips />
  </div>
</template>

<script>
import CascaderWithTooltips from './components/CascaderWithTooltips.vue'
export default {
  name: 'App',
  components: { CascaderWithTooltips }
}
</script>