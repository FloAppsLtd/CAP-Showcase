# Archived in February 2021

Repo has dependencies to vulnerable packages.

# Interactive visualization components
The following is a collection of [React](https://facebook.github.io/react/) components for interactive visualizations which includes charts and maps using [dc.js](https://dc-js.github.io/dc.js/), [d3.js](https://d3js.org) and [Leaflet](http://leafletjs.com).

## Development

### Initial setup
Install necessary libraries:
```
npm install
```

### Getting started

To run the example for development, use the following command:
```
npm run example:dev
```

Open a browser at `http://localhost:8000/`

To compile the example as a single page web application, run the following:
```
npm run example:dist
```

This will create a `dist-example` folder with all the necessary JavaScript and CSS files for the example to run.

# Example application
The example application demonstrates how to integrate the visualization components and manage the application state using [Crossfilter](https://github.com/crossfilter/crossfilter) and [Freezer-js](https://github.com/arqex/freezer). Freezer-js is used to manage the state of the application; and Crossfilter is used for the data rendering and filtering of the dc.js charts.

Because dc.js and Freezer-js handle the events independently, for example, filtering data on a chart will not trigger a state update in Freezer-js. It is necessary to include an object that will listen to dc.js events. We have created an object called `dcListener.js` which gets added to the dc.js chart registry and therefore, at each render, redraw, or filter event in any of the dc.js charts, it will trigger a state change in the Freezer-js store.

Application structure:

- `customComponents`: Custom components that extend the visualization charts.

- `data`: Sample data files

- `store`:
    - `DataHandler`: a class that contains the Crossfilter object with all the groups and filters necessary for the dc.js charts.
In the DataHandler, the dimensions and groups are specified, as well as the [Reductio](https://github.com/crossfilter/reductio) reduce fuctions using. (See the documentation on  [Crossfilter](https://github.com/crossfilter/crossfilter/wiki) and [Reductio](https://github.com/crossfilter/reductio#toc) for information on how they work.)

    - `dcListener`: dc.js event listener
    - `Reactions`: Freezer-js trigger events
    - `RetrieveDataService`: a mock service that simulates data retrieval
    - `Store`: A Freezer-js object for the application state with the default values

# Components
There are three types of components: Leaflet map plugins, dc.js charts and a d3.js parallel coordinates chart. Their usage is described in the Example application section below:

react-leaflet plugin components:

- react-leaflet-heatmap
- react-leaflet-marker-cluster
- react-leaflet-topojson

dc.js components:

- dc-barchart
- dc-rowchart
- dc-datacount

d3.js component:

- d3-parallel-coordchart

## react-leaflet plugin components
These components extend the [react-leaflet](https://github.com/PaulLeCam/react-leaflet) library and require to be children of a [react-leaflet Map](https://github.com/PaulLeCam/react-leaflet/blob/master/docs/Components.md#map).

### react-leaflet-heatmap
Displays a heatmap in the location of the data provided.
This component is based on the [leaflet-heat](https://github.com/Leaflet/Leaflet.heat) plugin. It will also show a legend with the defined min and max values.

Required props:

- `heatpoints`: an array of coordinates with an optional data object with information to display on the popups

Optional props:

- `showLegend`: a boolean to either show or not the legend
- `max`: a number for the max value (defaults to the max value of the data)
- `min`: a number for the min value of the data (defaults to 1)
- `options`: other options to render the leaflet-heat plugin

Example:
```javascript
[{lat: 60.3, lng: 20, data: { comment: 'new point', value: 4}}]
```

### react-leaflet-marker-cluster
Shows clustered markers with the option of adding an element for the marker popup. This plugin is a wrapper around [leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster) based on [MarkerCluster](https://github.com/troutowicz/geoshare/blob/master/app/components/MarkerCluster.jsx). It includes an option to display the names of the locations using either Google Maps API or OpenStreet Map.

Required props:

- `children`: a function that returns an React stateless component, which will render the html for the marker popup.

Optional props:

- `data`: an array of latitude and longitude coordinates
- `useGeoCoding`: a boolean to either use or not the geocoding service
- `geoCodingService`: the name of the geocoding service to use, it could either be `GOOGLE` or `OPEN_STREET_MAP` (it defaults to `OPEN_STREET_MAP`)
- `options`: options for the leaflet.markercluster plugin

### react-leaflet-topojson
Creates a map given a TopoJSON object, this plugin is wrapper around the [TopoJSON](https://github.com/topojson/topojson) library.

Required props:

- `data`:  a TopoJSON object

## dc.js components:
These components wrap [dc.js](https://dc-js.github.io/dc.js/) charts

### dc-barchart
React component that wraps a dc.js [barChart](https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md#dc.barChart).

Required props:

- `name`: a name that will be added to the id of the component div tag
- `dimension`: a crossfilter dimension object
- `group`: a crossfilter dimension group object
- `xRange`: an array defining the range of the X axis

Optional props:

- `width`: width of the chart (it defaults to 600)
- `height`: height of the chart (it defaults to 200)
- `yRange`: an array defining the range of the Y axis
- `getChartID`: a function to return the chartID number (defined in the dc.js chart Registry)
- `rangeChartID`: the id number of the chart rangeChart to be associated with the chart
- `rangeFilter`: an array with range of values to filter
- `children`: a function that returns an React stateless component, which will render the html for the tooltip
- `options`: other options to render the dc.js barChart

### dc-rowchart
React component that wrapps a dc.js [rowChart](https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md#dc.rowChart).

Required props:

- `name`: a name that will be added to the id of the component div tag
- `dimension`: a crossfilter dimension object
- `group`: a crossfilter dimension group object

Optional props:

- `width`: width of the chart (it defaults to 600)
- `height`: height of the chart (it defaults to 200)
- `options`: other options to render the dc.js rowChart

### dc-datacount
React component that wraps a dc.js [dataCount](https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md#dc.dataCount).

Required props:

- `name`: a name that will be added to the id of the component div tag
- `dimension`: a crossfilter dimension object
- `group`: a crossfilter dimension group object

Optional props:

- `templateAll`: a React Element which will render the html for the text when all records are selected
- `templateSome`: a React Element which will render the html for the text when some of the records are selected

## d3.js component:
This component creates a parallel coordinates chart, it is a wrapper around the [parallel-coordinates](http://syntagmatic.github.io/parallel-coordinates/) library which is based on d3.js, and inspired by the [react-parllel-coordinates](https://github.com/Git-me-outta-here/react-parallel-coordinates/blob/master/react-parallel-coordinates.js) component.

### d3-parallel-coordchart

Required props:

- `name`: a name that will be added to the id of the component div tag
- `dimensions`: an object with the metadata for data fields, as required by the parallel-coordinates library

Optional props:

- `minWidth`: minimum width of the chart
- `minHeight`: minimum height of the chart
- `data`: array of data objects   
- `hideAxis`: an array of data headers which will not be shown in the chart
- `onBrush`: a function to execute each time an axis is brushed
- `initBrushExtents`: an array of objects with the selected range of an axis
- `colorFn`: a function that will return the color of the parallel lines based on axis values
- `options`: other options to render the parallel-coordinates chart
