const pkg = require('./package')
const basePlugins = require('./rollup.plugins.js')

const pluginBabel = require('rollup-plugin-babel')({
  ignore: ["/node_modules\/(!emittery).*/"],
  plugins: ['@babel/plugin-external-helpers', '@babel/plugin-transform-object-assign', '@babel/transform-regenerator'],
  presets: [
    [
      '@babel/env',
      {
        modules: false,
        targets: {
          browsers: ['last 4 versions', 'safari >= 7', 'ie 11']
        }
      }
    ]
  ]
})

const pluginBabelCjs = require('rollup-plugin-babel')({
  runtimeHelpers: true,
  ignore: ["/node_modules\/(!emittery).*/"],
  plugins: ['@babel/plugin-external-helpers', '@babel/plugin-transform-object-assign', '@babel/plugin-transform-runtime'],
  presets: [
    [
      '@babel/env',
      {
        modules: false,
        targets: {
          browsers: ['last 4 versions', 'safari >= 7', 'ie 11']
        }
      }
    ]
  ]
})

const pluginBabelEs = require('rollup-plugin-babel')({
  ignore: ["/node_modules\/(!emittery).*/"],
  plugins: ['@babel/plugin-external-helpers', '@babel/plugin-transform-object-assign'],
  presets: [
    [
      '@babel/env',
      {
        modules: false,
        targets: {
          browsers: ['last 4 versions', 'safari >= 7', 'ie 11']
        }
      }
    ]
  ]
})

/**
 * UMD build
 *
 * @method umdBuild
 *
 * @return {Object}
 */
function umdBuild () {
  const pluginReplace = require('rollup-plugin-replace')({
    'process.env.NODE_ENV': JSON.stringify('development')
  })

  return {
    input: 'index.js',
    output: {
      file: pkg.browser,
      name: 'adonis.Ws',
      format: 'umd'
    },
    plugins: [pluginReplace].concat(basePlugins).concat([pluginBabel])
  }
}

/**
 * Umd build for production
 *
 * @method umdProductionBuild
 *
 * @return {Object}
 */
function umdProductionBuild () {
  const pluginReplace = require('rollup-plugin-replace')({
    'process.env.NODE_ENV': JSON.stringify('development')
  })

  const pluginUglify = require('rollup-plugin-uglify')()

  return {
    input: 'index.js',
    output: {
      file: `${pkg.browser.replace(/\.js$/, '.min.js')}`,
      name: 'adonis.Ws',
      format: 'umd'
    },
    plugins: [pluginReplace].concat(basePlugins).concat([pluginBabel, pluginUglify])
  }
}

/**
 * Es build
 *
 * @method esBuild
 *
 * @return {Object}
 */
function esBuild () {
  return {
    input: 'index.js',
    output: {
      file: pkg.module,
      format: 'es'
    },
    plugins: basePlugins.concat([pluginBabelEs])
  }
}

/**
 * CommonJS build
 *
 * @method esBuild
 *
 * @return {Object}
 */
function cjsBuild () {
  return {
    input: 'index.js',
    output: {
      file: pkg.cjs,
      format: 'cjs'
    },
    plugins: basePlugins.concat([pluginBabelCjs])
  }
}

const build = process.argv.slice(3)[0]

if (build === '--umd') {
  module.exports = umdBuild()
} else if (build === '--umd-production') {
  module.exports = umdProductionBuild()
} else if (build === '--esm') {
  module.exports = esBuild()
} else if (build === '--cjs') {
  module.exports = cjsBuild()
}
