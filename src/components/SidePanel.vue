<template>
  <aside>
    <data-section @input="records = $event" />

    <template v-if="records && recordFields">
      <grouping-section />

      <layout-options-section />
    </template>
  </aside>
</template>

<script>
import { computed, defineComponent, provide, shallowRef } from '@vue/composition-api'
import GroupingGenerator from './GroupingGenerator.vue'
import DataSection from './sections/DataSection.vue'
import GroupingSection from './sections/GroupingSection.vue'
import LayoutOptionsSection from './sections/LayoutOptionsSection.vue'
import ViewOptions from './ViewOptions.vue'
export default defineComponent({
  components: { GroupingGenerator, ViewOptions, DataSection, GroupingSection, LayoutOptionsSection },
  setup() {
    const records = shallowRef()

    const recordFields = computed(() => {
      if (records.value?.length) {
        const _r = records.value[0]
        return Array.from(Object.keys(_r), k => {
          const vals = Array.from(records.value, r => Number.isFinite(+r[k]) ? +r[k] : r[k])
          const count = new Set(vals).size
          return [
            k,
            {
              count
            }
          ]
        }).sort((a, b) => a[1].count - b[1].count)
      }
    })

    provide('records', records)

    return {
      records,
      recordFields
    }
  }

})
</script>

<style lang="scss" scoped>
aside {
  > * {
    padding: .75rem;
  }
}
</style>
