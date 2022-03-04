import Vue from 'vue'
import VueCompositionApi, * as composition from '@vue/composition-api'
import { CSV_PATHS } from '@/main'
import axios from 'axios'
import { csvParse } from 'd3'

Vue.use(VueCompositionApi)

if (process.env.NODE_ENV === 'development') {
  const loadCsv = async function (pathOrIndex) {
    const isIndex = typeof pathOrIndex === 'number'

    const url = isIndex ? CSV_PATHS[pathOrIndex] : pathOrIndex

    const { data } = await axios.get(url, {
      transformResponse: _d => csvParse(_d)
    })

    return data
  }

  Object.assign(window, {
    dev: {
      d3:   require('d3'),
      d3ar: require('d3-array'),
      composition,
      CSV_PATHS,
      loadCsv,
      Vue
    }
  })
}
