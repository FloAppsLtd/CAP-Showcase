import path from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

export default {
  debug: true,
  devtool: 'source-map',
  resolve: {
    alias: {
      crossfilter: path.join(__dirname, '../node_modules/crossfilter2') // Workaround for dc.js
    }
  },
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:8000',
    'webpack/hot/only-dev-server',
    path.join(__dirname, '/index.js'),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel-loader'],
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
    filename: 'app.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '/index.html'),
      files: {
        css: ['style.css'],
        js: ['app.js'],
      }
    }),
    new ExtractTextPlugin('style.css'),
  ],
  devServer: {
    colors: true,
    contentBase: __dirname,
    historyApiFallback: true,
    hot: true,
    inline: true,
    port: 8000,
    progress: true,
    stats: {
      cached: false,
    },
  },
}
