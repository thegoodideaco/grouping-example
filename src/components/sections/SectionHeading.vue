<template>
  <div class="heading">
    <h2 class="heading__title">
      <slot name="title">
        {{ title }}
      </slot>
    </h2>
    <p class="heading__subtitle">
      <slot name="subtitle">
        {{ subTitle }}
      </slot>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type:    String,
      default: 'Choose a dataset, or load your own csv file.'
    },
    subTitle: {
      type:    String,
      default: 'Choose your data'
    }
  }
}
</script>

<style lang="scss" scoped>
.heading {
  margin-bottom: 1rem;
  line-height: normal;

  &__title {
    font-size: 1.3rem;
    line-height: 2;
  }

  &__subtitle {
    font-size: .6rem;
  }
}
</style>
