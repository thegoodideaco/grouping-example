<template>
  <div
    id="app"
    class="abs-fill">
    <!-- Sidebar -->
    <side-panel
      class="grid-panel bg-gray-900 text-white"
      @update:dataset="loaded = !!$event" />

    <!-- Content -->
    <main class="grid-content bg-gray-800 text-white">
      <group-viewer v-if="loaded" />
    </main>
  </div>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'
import GroupViewer from './components/GroupViewer.vue'
import SidePanel from './components/SidePanel.vue'

export default defineComponent({
  name:       'App',
  components: {
    SidePanel,
    GroupViewer
  },
  setup() {
    const loaded = ref(false)

    return { loaded }
  }
})
</script>

<style lang="scss" scoped>
#app {
  display: grid;
  grid-template:
    "panel content" 1fr
    / minmax(200px, 500px) 1fr;

}

.grid {
  &-panel {
    grid-area: panel;
  }

  &-content {
    grid-area: content;
  }
}
</style>
