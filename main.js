window.onload = init;

function init() {
  // New Map
  const catCenterCoordinates = [188527.0981312341, 5145259.000081155];
  const map = new ol.Map({
    view: new ol.View({
      center: catCenterCoordinates,
      zoom: 7,
      //extent: [-20220, 4789170, 435926, 5496266],
    }),
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
    ],
    target: "openlayers-map",
  });

  // Catalonia Cities GeoJSON
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

  const styleForSelect = (feature) => {
    let cityID = feature.get("id");
    let cityIDString = cityID.toString();
    const styles = [
      new ol.style.Style({
        image: new ol.style.Circle({
          fill: new ol.style.Fill({
            color: [214, 26, 105, 0.5],
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
            color: [87, 9, 9, 1],
          }),
          stroke: new ol.style.Stroke({
            color: [87, 9, 9, 1],
            with: 0.5,
          }),
        }),
      }),
    ];

    return styles;
  };

  const cataloniaCitiesLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      format: new ol.format.GeoJSON(),
      url: "./data/catalonia_cities.geojson",
    }),
    style: catCitiesStyle,
  });
  map.addLayer(cataloniaCitiesLayer);

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

    // Default Style for all features
    let cataloniaCitiesFeatures = cataloniaCitiesLayer
      .getSource()
      .getFeatures();
    cataloniaCitiesFeatures.forEach((feature) => {
      feature.setStyle(catCitiesStyle);
      //console.log(feature);
    });
    feature.setStyle(styleForSelect);

    console.log(clickedAnchorElement);

    // Home Element : Change content in the menu to HOME
    if (clickedAnchorElement.id === "Home") {
      mapView.animate({ center: catCenterCoordinates }, { zoom: 7 });
      cityNameElement.innerHTML =
        "Welcome to Catalonia Capital Cities Tour Map";
      cityImageElement.setAttribute("src", "./data/images/catalonia_flag.jpg");
    }

    // change view and content based on the feature
    else {
      feature.setStyle(styleForSelect);
      let featureCoordinates = feature.get("geometry").getCoordinates();
      mapView.animate({ center: featureCoordinates }, { zoom: 9 });
      let featureName = feature.get("name");
      let featureImage = feature.get("image");
      cityNameElement.innerHTML = "Name of the city: " + featureName;
      cityImageElement.setAttribute(
        "src",
        "./data/images/" + featureImage + ".jpg"
      );
    }
  };

  // Navigation Button Logic
  const anchorNavElements = document.querySelectorAll(".column-navigation > a");
  for (let anchorNavElement of anchorNavElements) {
    anchorNavElement.addEventListener("click", (e) => {
      let clickedAnchorElement = e.currentTarget;
      let clickedAnchorElementID = clickedAnchorElement.id;
      console.log(clickedAnchorElementID);
      let cataloniaCitiesFeatures = cataloniaCitiesLayer
        .getSource()
        .getFeatures();
      cataloniaCitiesFeatures.forEach((feature) => {
        let featureCityName = feature.get("name");
        if (clickedAnchorElementID === featureCityName) {
          mainLogic(feature, clickedAnchorElement);
        }
        //console.log(feature.get("name"));
        // Home Navigation Case
        if (clickedAnchorElementID === "Home") {
          mainLogic(feature, clickedAnchorElement);
        }
      });
    });
  }

  // Features Hover Logic
  const popoverTextElement = document.getElementById("popover-text");
  const popoverTextLayer = new ol.Overlay({
    element: popoverTextElement,
    positioning: "bottom-center",
    stopEvent: false,
  });
  map.addOverlay(popoverTextLayer);

  map.on("pointermove", (evt) => {
    let isFeatureAtPixel = map.hasFeatureAtPixel(evt.pixel);
    if (isFeatureAtPixel) {
      let featureAtPixel = map.getFeaturesAtPixel(evt.pixel);
      let featureName = featureAtPixel[0].get("name");
      popoverTextLayer.setPosition(evt.coordinate);
      popoverTextElement.innerHTML = featureName;
      map.getViewport().style.cursor = "pointer";
    } else {
      popoverTextLayer.setPosition(undefined);
      map.getViewport().style.cursor = "";
    }
  });
}
