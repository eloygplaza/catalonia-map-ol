window.onload = init;

function init() {
  // New Map
  const map = new ol.Map({
    view: new ol.View({
      center: [188527.0981312341, 5145259.000081155],
      zoom: 1,
      extent: [-17220, 4889170, 435926, 5396266],
    }),
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
    ],
    target: "openlayers-map",
    //controls: ol.control.defaults({ attribution: false }).extend(mapControls),
  });

  // Catalonia Ctiies GeoJSON
  const catCitiesStyle = (feature) => {
    console.log(feature);
  };

  const cataloniaCities = new ol.layer.Vector({
    source: new ol.source.Vector({
      format: new ol.format.GeoJSON(),
      url: "./data/catalonia_cities.geojson",
    }),
    style: catCitiesStyle,
  });
  map.addLayer(cataloniaCities);
}
