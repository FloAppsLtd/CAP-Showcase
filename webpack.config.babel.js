import path from 'path'
import webpack from 'webpack'
import LodashModuleReplacementPlugin from 'lodash-webpack-plugin'

const outputPath = path.resolve(__dirname, 'dist')

const lodashFeatures = {
  caching: true,
  collections: true,
  paths: true
}

const config = {
  entry: {
    lib: './src/index',
  },
  externals: [
    {
      react: {
        amd: 'react',
        commonjs: 'react',
        commonjs2: 'react',
        root: 'React',
      },
    },
    {
      'react-dom': {
        amd: 'react-dom',
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
        root: 'ReactDOM',
      },
    },
  ],
  resolve: {
    alias: {
      crossfilter: path.join(__dirname, './node_modules/crossfilter2') // Workaround for dc.js
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.css$/,
        exclude: null,
        loaders: [
          'style',
          'css?sourceMap&-minimize'
        ]
      }
    ],
  },
}

export default [
  {
    ...config,
    output: {
      filename: 'react-dc-crossfilter.js',
      library: 'ReactDCCrossfilter',
      libraryTarget: 'umd',
      path: outputPath,
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
      new LodashModuleReplacementPlugin(lodashFeatures),
    ],
  },
  {
    ...config,
    output: {
      filename: 'react-dc-crossfilter.js',
      library: 'ReactDCCrossfilter',
      libraryTarget: 'umd',
      path: outputPath,
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      new LodashModuleReplacementPlugin(lodashFeatures),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          dead_code: true,
          warnings: false,
        },
      }),
    ],
  },
]
