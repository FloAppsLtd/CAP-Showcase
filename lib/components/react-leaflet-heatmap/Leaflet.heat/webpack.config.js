'use strict';

module.exports = {
  entry: './src/HeatLayer.js',
  output: {
    path: './dist/',
    filename: 'leaflet-heat.js'
  },
  resolve: {
    modulesDirectories: ['node_modules']
  }
};