<template>
  <div class="section layout">
    <section-heading
      title="Hierarchy Settings">
      <template #subtitle>
        <span>Configure visual settings for the hierarchy <em>visualizer</em>.</span>
      </template>
    </section-heading>

    <div class="summarize-on section flex gap-2">
      <!-- Summarize on -->
      <fieldset>
        <label class="inline-grid">
          Summarize on
          <r-select
            v-model="summarizeOn"
            :items="recordFields">
            <template #default="{value, index}">
              <span v-if="index > 0">
                {{ value[0] }} ({{ value[1] }})
              </span>
              <span v-else>
                {{ value[0] }}
              </span>
            </template>
          </r-select>
        </label>
      </fieldset>

      <!-- Order -->
      <fieldset>
        <label class="inline-grid">
          Order
          <r-select
            v-model="sortOrder"
            :items="['Ascending', 'Descending']">
            <template #default="{value, index}">
              <span>
                {{ value }}
              </span>
            </template>
          </r-select>
        </label>
      </fieldset>

      <!-- Layout -->
      <fieldset>
        <label class="inline-grid">
          Layout Type
          <r-select
            v-model="layoutType"
            :items="['Treemap', 'Circle Pack']">
            <template #default="{value}">
              <span>
                {{ value }}
              </span>
            </template>
          </r-select>
        </label>
      </fieldset>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, inject, ref, shallowRef } from '@vue/composition-api'
import RSelect from '../inputs/RSelect.vue'
import SectionHeading from './SectionHeading.vue'
export default defineComponent({
  components: { SectionHeading, RSelect },
  setup() {
    const records = inject('records', shallowRef([
      { name: 'bob' },
      { name: 'jon' },
      { name: 'dan' }
    ]))

    const recordFields = computed(() => {
      if (records.value?.length) {
        const _r = records.value[0]
        const _vals = Array.from(Object.keys(_r), k => {
          const vals = Array.from(records.value, r => Number.isFinite(+r[k]) ? +r[k] : r[k])
          const count = new Set(vals).size
          return [
            k,
            count
          ]
        }).sort((a, b) => a[1] - b[1])

        _vals.unshift([
          '<RECORD_COUNT>',
          null
        ])

        return _vals
      }
    })

    const summarizeOn = ref()

    return {
      recordFields,
      summarizeOn,
      sortOrder:  'Ascending',
      layoutType: 'Treemap'
    }
  }
})
</script>

<style>
</style>
