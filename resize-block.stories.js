import { random } from 'lodash'
import GridResizeBlock from './GridResizeBlock.vue'
import './story.scss'

export default {
  title: 'Components/Containers',
  component: GridResizeBlock,
  parameters: {
    layout: 'fullscreen'
  }
}

const Template = (args, {argTypes}) => ({
  components: {
    GridResizeBlock
  },
  data: () => ({
    dimStyle: {
      maxWidth: '100%',
      maxHeight: '100%',
      transition: 'all 700ms cubic-bezier(0.5, .4, 0.26, 0.99)',
      outline: '1px solid rgba(255,255,255,.5)',
      outlineOffset: '2px',
      // willChange: 'contents'
    }
  }),
  template: require('!!raw-loader!./demo-template.html').default,
  methods: {
    resize() {
      const rx = random(320, window.innerWidth, false)
      const ry = random(270, window.innerHeight, false)

      Object.assign(this.dimStyle, {
        maxWidth: `${rx}px`,
        maxHeight: `${ry}px`,
      })
    },
    resetSize() {
      Object.assign(this.dimStyle, {
        maxWidth: `100%`,
        maxHeight: `100%`,
      })
    }
  }
})



export const ResizeBlock = Template.bind({})
