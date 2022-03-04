<template>
  <div class="flex relative">
    <select
      id="csv_select"
      v-model="localValue"
      :label="localValue"
      :placeholder="placeholder"
      class="flex-1"
      name="csv_select">
      <option
        v-for="(path, index) in paths"
        :key="path"
        :value="path">
        <span class="p-5">
          <slot
            :name="path === localValue ? 'label' : 'default'"
            v-bind="{value: path, index, arr: paths}">
            {{ path }}
          </slot>
        </span>
      </option>
    </select>

    <div class="arrow-container absolute h-full">
      <span class="fa fa-xs fa-fw fa-chevron-down" />
    </div>
  </div>
</template>

<script>
import { CSV_PATHS } from '@/main'
import { computed, defineComponent, readonly, ref, watchPostEffect } from '@vue/composition-api'
import { csv } from 'd3-fetch'

export default defineComponent({
  model: {
    event: 'input',
    prop:  'localValue'
  },
  props: {
    value: {
      type: String
    },
    placeholder: String
  },
  setup(_, { emit }) {
    const paths = readonly(CSV_PATHS)

    const localValue = ref(_.value)

    watchPostEffect(async () => {
      emit('before:load')
      if (localValue.value) {
        const data = await csv(localValue.value)
        emit('input', {
          name: localValue.value,
          data
        })
      }
    })

    return {
      paths,
      localValue
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
