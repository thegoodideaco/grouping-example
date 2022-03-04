<template>
  <div class="inline-flex relative">
    <select
      ref="select"
      :value="localValue"
      class="flex-1"
      @change="onSelect">
      <option
        :value="null"
        hidden
        disabled
        :selected="!!localValue">
        <slot name="placeholder">
          Select...
        </slot>
      </option>

      <option
        v-for="(item, index) in items"
        :key="index"
        :value="item"
        :hidden="filter ? !filter(item, index, items) : false"
        :selected="localValue === item">
        <slot
          name="default"
          v-bind="{value: item, index}">
          {{ item }}
        </slot>
      </option>
    </select>

    <div class="arrow-container absolute h-full flex-none">
      <span class="fa fa-xs fa-fw fa-chevron-down" />
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  model: {
    prop:  'value',
    event: 'change'
  },
  props: {
    items: {
      type:     Array,
      required: true
    },
    value:  String,
    filter: Function
  },
  setup(props, { emit }) {
    const localValue = computed({
      get() {
        return props.value
      },
      set(value) {
        emit('change', value)
      }
    })

    const selectEl = ref('select')

    return {
      localValue,
      selectEl
    }
  },
  watch: {
    localValue() {
      this.$forceUpdate()
    }
  },
  methods: {
    onSelect(_ev) {
      this.$emit('change', this.$refs.select.value)
      this.$refs.select.value = ''
      this.$refs.select.blur()
    }
  }
})
</script>

<style lang="scss" scoped>
select {
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  color: #111;
  background-color: #eee;
  cursor: pointer;
  font-size: 0.75rem;

  appearance: none;
  padding-right: 48px;

  &:hover,
  &:active,
  &:focus {
    background-color: #fff;
  }

  option {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.arrow-container {
  right: 0;
  color: #111;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;

  :focus-within > &,
  :active > & {
    color: green;
    transform: rotate(180deg);
  }
}
</style>
