const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'

const path = require('path')
// function resolve (dir) {
//   return path.join(__dirname, dir)
// }

/**
 * @typedef { import("@vue/cli-service").ProjectOptions } Options
 * @typedef { import("webpack-chain") } ChainWebpack
 */

/**
 * @type { Options }
 */
module.exports = {
  runtimeCompiler: true,

  /**
   * Leave empty for relative loading
   */
  publicPath: isDevelopment ? '/' : '',

  lintOnSave: true,

  /**
   * ! Leave off to avoid build errors with web workers
   */
  parallel: false,

  css: {
    sourceMap: process.env.VUE_APP_CSS_SOURCE_MAP === 'true'
    // extract:   true
  },
  productionSourceMap: process.env.VUE_APP_PRODUCTION_SOURCE_MAP === 'true',

  configureWebpack: config => {
    /**
     * * Copy static directory into build
     */
    const ignore = ['.*']

    if (process.env.NODE_ENV === 'production') {
      ignore.push('**/dev/**/*', '**/unused/**/*')
    }

    // const CopyWebpackPlugin = require('copy-webpack-plugin')
    // config.plugins.push(
    //   new CopyWebpackPlugin({
    //     patterns: [
    //       {

    //         from: resolve('static'),
    //         to:   'static'

    //       }
    //     ]
    //   })
    // )

    if (isProduction || process.env.REPORT_UNUSED === 'true') {
      const devExcludes = [
        // '**/dev',
        '**/unused'
      ]

      const prodExcludes = [
        '**/unused',
        '**/dev'
      ]

      const envExcludes = isDevelopment ? devExcludes : prodExcludes

      if (!process.env.STORYBOOK_MODE) {
        envExcludes.push('*.stories.js')
      }

      const UnusedWebpackPlugin = require('unused-webpack-plugin')
      config.plugins.push(
        new UnusedWebpackPlugin({
        // Source directories
          directories: [path.join(__dirname, 'src')],
          // Exclude patterns
          exclude:     [
            ...envExcludes,
            '*.d.ts',
            '**/utils'
          ],
          // Root directory (optional)
          root: __dirname
        })
      )
    }

    /** @type {DevtoolOptions} */
    const sourceMapType = 'eval-source-map'

    // Dev only
    if (isDevelopment) {
      config.devtool = sourceMapType

      config.devServer = {
        // ...config.devServer,

        // liveReload: true,

        // https: true,
        proxy: {
          global: {
            target:       'https://api.prism.elcdna.com',
            ws:           true,
            changeOrigin: true
          },
          sales: {
            target:       'https://api.prism.elcdna.com',
            ws:           true,
            changeOrigin: true
          },
          rollup: {
            target:       'https://api.prism.elcdna.com',
            ws:           true,
            changeOrigin: true
          },
          regional: {
            target:       'https://api.prism.elcdna.com',
            ws:           true,
            changeOrigin: true
          },
          affiliate: {
            target:       'https://api.prism.elcdna.com',
            ws:           true,
            changeOrigin: true
          },
          product: {
            target:       'https://api.prism.elcdna.com',
            ws:           true,
            changeOrigin: true
          }
        }

      }
    }

    // For production
    if (isProduction) {
      if (process.env.GZIP === 'true') {
        const CompressionPlugin = require('compression-webpack-plugin')
        config.plugins.push(new CompressionPlugin())
      }

      if (process.env.COMPRESS) {
        const TerserPlugin = require('terser-webpack-plugin')
        config.optimization.minimize = true
        config.optimization.mergeDuplicateChunks = true
        config.optimization.splitChunks = {
          minChunks: 2
        }
        config.optimization.minimizer.push(
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console:  true,
                dead_code:     true,
                drop_debugger: true,
                unused:        true,
                passes:        2,
                ecma:          6
              }
            }
          })
        )
      }
    }
  },

  /**
   * @type {(config: ChainWebpack) => void}
   */
  chainWebpack: (config) => {
    // config.plugins.delete('html')
    // config.plugins.delete('preload')
    // config.plugins.delete('prefetch')

    if (!isDevelopment) {
      config.optimization.splitChunks({
        chunks: 'all'
      })
      config.optimization.usedExports(true).concatenateModules(true)
    }

    /**
     * * Web workers
     */
    config.module
      .rule('webworkers')
      .test(/\.worker\.js$/)
      .use('worker-loader')
      .loader('worker-loader')
      .end()
      .use('babel-loader')
      .loader('babel-loader')
      .end()

    /**
     * * Markdown File Configuration
     */
    config.module
      .rule('markdown')
      .test(/\.md$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()

    /**
     * Import fragment shaders
     */
    config.module
      .rule('frag')
      .test(/\.(frag|vert|glsl)(\?.*)?$/)
      .use('raw-loader')
      .loader('raw-loader')
  },

  transpileDependencies: process.env.NODE_ENV === 'development'
    ? []
    : [
      'd3',
      'vuedraggable'
    ]
}
