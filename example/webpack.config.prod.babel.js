import path from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

export default {
  debug: true,
  devtool: 'cheap-module-source-map',
  resolve: {
    alias: {
      crossfilter: path.join(__dirname, '../node_modules/crossfilter2') // Workaround for dc.js
    }
  },
  entry: [
    path.join(__dirname, '/index.js'),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
      }, {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.css$/,
        exclude: null,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap&-minimize'),
      }
    ],
  },
  output: {
    path: path.resolve(__dirname, '../dist-example'),
    filename: 'app.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.optimize.UglifyJsPlugin({
      exclude: /\.css/i,
      compress: {
        dead_code: true,
        warnings: false,
      },
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '/index.html'),
      files: {
        css: ['style.css'],
        js: ['app.js'],
      }
    }),
    new ExtractTextPlugin('style.css'),
  ]
}
