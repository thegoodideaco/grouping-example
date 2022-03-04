<template>
  <div class="section data bg-green-700">
    <section-heading
      title="Load your records"
      sub-title="Load data from a preset, or load your own local csv." />

    <div class="flex items-stretch text-xs w-full">
      <csv-select
        class="flex-1"
        placeholder="Select..."
        @input="onCsvSelect"
        @before:load="records = null" />

      <data-loader
        class="flex items-center rounded-sm ml-3"
        @input="onFileInput"
        @before:load="records = null">
        <template #default>
          <div class="bg-gray-600 border border-gray-700 cursor-pointer font-bold px-3 py-1 rounded-sm shadow shadow-sm text-white">
            <span class="fa fa-sm fa-fw fa-file-upload" /> Browse
          </div>
        </template>
      </data-loader>
    </div>

    <div class="status-text">
      <div
        v-if="records"
        class="flex gap-2">
        <span>
          Records: {{ records.length }}
        </span>

        <span>
          Columns: {{ recordFields.length }}
        </span>
      </div>

      <template v-else>
        No records loaded.
      </template>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, ref, shallowRef, watchPostEffect } from '@vue/composition-api'
import { csvParse } from 'd3-dsv'
import CsvSelect from '../inputs/CsvSelect.vue'
import DataLoader from '../inputs/DataLoader.vue'
import SectionHeading from './SectionHeading.vue'
export default defineComponent({
  components: { DataLoader, CsvSelect, SectionHeading },
  setup(props, { emit }) {
    const records = shallowRef()

    const selectedFileName = ref()

    /** @type {(param0: {data: any, file: File}) => any[]} */
    const onFileInput = ({
      file,
      data
    }) => {
      /** @type {File} */
      const f = file
      if (!f) return
      selectedFileName.value = f.name
      records.value = null
      const _text = data

      const val = csvParse(_text)

      if (process.env.NODE_ENV === 'development') {
        globalThis.dataset = val
      }

      records.value = val

      return val
    }

    const onCsvSelect = ({ name, data }) => {
      selectedFileName.value = name
      // debugger
      records.value = data
    }

    watchPostEffect(() => emit('input', records.value))

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

    return {
      records,
      onFileInput,
      onCsvSelect,
      recordFields,
      selectedFileName
    }
  }

})
</script>

<style lang="scss" scoped>
.status-text {
  margin-top: .25rem;
  font-size: .6rem;
  line-height: normal;
  opacity: .8;
  text-transform: capitalize;
  font-style: italic;
  font-weight: 500;
}
</style>
