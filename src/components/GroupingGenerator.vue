<template>
  <div class="grouping-generator">
    <div class="flex items-center">
      <r-select
        class="flex-1 mr-5"
        :value="selectedKey"
        :items="localKeys"
        :filter="isSelected"
        @change="onSelect" />

      <button class="p-2 ml-auto">
        <span class="fa fa-fw fa-dice" /> Randomize
      </button>
      <button class="p-2">
        <span class="fa fa-fw fa-times" /> Reset
      </button>
    </div>

    <draggable
      v-model="sortedKeys"
      :options="sortOptions">
      <div
        v-for="(item, index) in sortedKeys"
        :key="index">
        <div class="flex items-center bg-white text-black my-2 text-xs rounded overflow-hidden cursor-move">
          <slot
            name="default"
            v-bind="{item, index}">
            <span class="p-2 px-4 bg-blue-400 text-white font-bold font-mono text-sm">
              {{ index+1 }}
            </span>
            <span class="p-2">
              {{ item }}
            </span>
          </slot>
          <button
            class="ml-auto px-4 py-2"
            @click="sortedKeys.splice(index, 1)">
            <span class="fa fa-fw fa-times" />
          </button>
        </div>
      </div>
    </draggable>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import RSelect from './inputs/RSelect.vue'
export default {
  components: {
    Draggable,
    RSelect
  },
  props: {

    /** @type {Vue.PropOptions<any[]>} */
    keys: {
      type:     Array,
      required: true
    }
  },
  data: () => ({
    localKeys:   null,
    selectedKey: null,
    sortedKeys:  []
  }),
  computed: {

    /** @type {() => Record<string, any>} */
    sortOptions() {
      return {
        animation: 100
      }
    },

    /** @type {() => any[]} */
    remainingKeys() {
      if (this.sortedKeys.length) {
        return this.localKeys.filter(k => this.sortedKeys.indexOf(String(k)) === -1)
      } else {
        return this.localKeys
      }
    }
  },
  beforeMount() {
    this.localKeys = JSON.parse(JSON.stringify(this.keys))
  },
  methods: {
    onSelect(key) {
      this.sortedKeys.push(key)
      this.selectedKey = null
    },

    isSelected(item, _index, _arr) {
      return !this.sortedKeys.includes(String(item))
    }
  }
}
</script>

<style>

</style>
