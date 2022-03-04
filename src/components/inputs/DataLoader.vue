
<template>
  <div
    class="data-loader"
    label="Data">
    <input
      id="upload"
      ref="upload"
      class="hidden"
      name="dataset"
      type="file"
      v-bind="options"
      @change="onFileChange"
      @upload="onUpload">

    <div
      class="inline-block"
      tabindex="0"
      @click="upload"
      @focus="onFocus"
      @keyup.space.enter="upload">
      <!--
      @slot
      -->
      <slot name="default">
        <span class="cursor-pointer">Browse</span>
      </slot>
    </div>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

/**
 * The file loader component provides a simple wrapper that loads file data.
 *
 * ## Features
 *
 * This is some feature
 */
export default defineComponent({
  props: {
    filter: {
      type:    String,
      default: '.tsv,.csv'
    }
  },

  setup() {
    return {
      loaded:    false,
      uploading: false
    }
  },

  computed: {

    /** @type {() => any} */
    options() {
      return {
        accept: this.filter
      }
    }
  },

  methods: {

    async onFileChange(ev) {
      if (this.loaded) return
      this.uploading = false
      /** @type {File} */
      const rawFile = ev.target.files[0]
      if (!rawFile) {
        this.$emit('error', 'Invalid File')
        return
      }

      this.$emit('before:load')

      const reader = new FileReader()
      reader.onload = async (ev) => {
        this.uploading = false

        /**
         * data: any,
         * file: [File](https://developer.mozilla.org/en-US/docs/Web/API/File)
         */
        this.$emit('input', {
          file: rawFile,
          data: ev.target.result
        })

        this.$refs.upload.value = null

        this.loaded = true

        await this.$nextTick()

        document.activeElement.blur()
      }

      reader.onabort = () => {
        this.uploading = false
        this.loaded = false

        /**
         * When user cancels an upload
         * @event cancel
         */
        this.$emit('cancel')
      }

      reader.readAsText(rawFile)
    },

    upload() {
      this.loaded = false
      this.uploading = true

      this.$refs.upload.click()
    },

    onUpload() {
      this.uploading = true
    },

    onCancel() {
      this.uploading = false
      this.$emit('cancel')
    },

    onFocus() {
      if (this.uploading) {
        this.onCancel()
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.data-loader {
  .title {
    display: flex;
    align-items: center;

    > * {
      &:first-child {
        flex: 1 0 auto;
      }
    }
  }

  .summary-scroller {
    box-shadow: inset 0 0 9px 0px hsla(0, 0%, 0%, 0.6);
    background-color: hsla(201, 70%, 21%, 1);
  }

  ul.summary {
    > li {
      display: flex;
      border-bottom: 1px solid rgba(#000, 0.2);
      line-height: 1.4;
      padding: 0.5rem 0.75rem;

      > * {
        &:first-child {
          flex: 1 0 auto;
        }
      }
    }
  }
}
</style>
