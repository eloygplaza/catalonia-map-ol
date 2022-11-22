window.onload = init;

function init() {
  // New Map
  const map = new ol.Map({
    view: new ol.View({
      center: [188527.0981312341, 5145259.000081155],
      zoom: 1,
      extent: [-20220, 4789170, 435926, 5496266],
    }),
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
    ],
    target: "openlayers-map",
  });

  // Catalonia Ctiies GeoJSON
  const catCitiesStyle = (feature) => {
    let cityID = feature.get("id");
    let cityIDString = cityID.toString();
    const styles = [
      new ol.style.Style({
        image: new ol.style.Circle({
          fill: new ol.style.Fill({
            color: [77, 219, 105, 0.6],
          }),
          stroke: new ol.style.Stroke({
            color: [6, 125, 34, 1],
            width: 2,
          }),
          radius: 12,
        }),
        text: new ol.style.Text({
          text: cityIDString,
          scale: 1.5,
          fill: new ol.style.Fill({
            color: [232, 26, 26, 1],
          }),
          stroke: new ol.style.Stroke({
            color: [232, 26, 26, 1],
            with: 0.3,
          }),
        }),
      }),
    ];

    return styles;
  };

  const cataloniaCities = new ol.layer.Vector({
    source: new ol.source.Vector({
      format: new ol.format.GeoJSON(),
      url: "./data/catalonia_cities.geojson",
    }),
    style: catCitiesStyle,
  });
  map.addLayer(cataloniaCities);

  // Map Features Click Logic
  const navElements = document.querySelector(".column-navigation");
  const cityNameElement = document.getElementById("cityname");
  const cityImageElement = document.getElementById("cityimage");
  const mapView = map.getView();

  map.on("singleclick", (evt) => {
    map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
      let featureName = feature.get("name");
      let navElement = navElements.children.namedItem(featureName);
      mainLogic(feature, navElement);
      console.log(feature);
      console.log(navElement);
    });
  });

  const mainLogic = (feature, clickedAnchorElement) => {
    // Re-assign active class to the clicked element
    let currentActiveStyledElement = document.querySelector(".active");
    currentActiveStyledElement.className =
      currentActiveStyledElement.className.replace("active", "");
    clickedAnchorElement.className = "active";

    // change the view based on the feature
    let featureCoordinates = feature.get("geometry").getCoordinates();
    mapView.animate({ center: featureCoordinates }, { zoom: 5 });
    console.log(featureCoordinates);
  };
}
