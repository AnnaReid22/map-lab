import './style.css';
import Feature from 'ol/Feature.js';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import * as proj from 'ol/proj';
import {Circle} from 'ol/geom.js';
import {Vector as VectorSource} from 'ol/source.js';
import {Style, Stroke, Fill} from 'ol/style.js';
import {Vector as VectorLayer} from 'ol/layer.js';

/* Constants for initializing the size of the circle and the cities */
const STARTING_RADIUS = 10000;
const INC_RADIUS = 1000;
const MAX_COLOR_VALUE = 255;

/* Static locations, avoiding magic numbers */

/* DEMO LOCATIONS BELOW */
const FROM_SLO = 100;
const SLO_LOC = [-120.680656, 35.270378];

const FROM_LAS_VEGAS = 20;
const LAS_VEGAS_LOC = [-115.176468, 36.188110];

const FROM_SAN_DIEGO = 1;
const SAN_DIEGO_LOC = [-117.161087, 32.715736];

const FROM_PHOENIX = 1;
const PHOENIX_LOC = [-112.074036, 33.448376];

const FROM_SEATTLE = 1;
const SEATTLE_LOC = [-117.823059, 33.669445];

const FROM_IRVINE = 1;
const IRVINE_LOC = [-122.335167, 47.608013];

const data = [[FROM_SAN_DIEGO, SAN_DIEGO_LOC], [FROM_PHOENIX, PHOENIX_LOC], 
              [FROM_SEATTLE, SEATTLE_LOC], [FROM_IRVINE, IRVINE_LOC], [FROM_SLO, SLO_LOC], [FROM_LAS_VEGAS, LAS_VEGAS_LOC]];

const circles = data.map(function(i) 
  {
    /* radius determines the color impact and the size of the circle. it increases the radius by INC_RADIUS
      for each additional person living in the area */
    var additional = INC_RADIUS * i[0] - 1;
    var radius = STARTING_RADIUS + additional;

    var color_change = additional / 255.0;

    if(color_change > MAX_COLOR_VALUE)
    {
      color_change = MAX_COLOR_VALUE;
    }

    var style = new Style({
      stroke: new Stroke({
          color: [0, MAX_COLOR_VALUE, color_change, 0.7],
          width: 3
      }),
      fill: new Fill({
          color: [color_change, 0, MAX_COLOR_VALUE, 0.7]
      })
    });

    /* Create new feature to append to circles list */
    const circle =  new Feature({
      geometry: new Circle(proj.fromLonLat(i[1]), radius),
    });

    circle.setStyle(style);
    return circle;
  }
);

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    new VectorLayer({
      source: new VectorSource({
        features: circles,
      }),
    }),

  ],
  view: new View({
    center: proj.fromLonLat(SLO_LOC),
    zoom: 10
  })
});

