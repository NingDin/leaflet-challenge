//set the url for fetch
var url='https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
//create the layer group per method show in class
// var show=L.layerGroup();

//Fetch the 7 days weekly data;//see the structure of the data;
d3.json(url).then((data)=>console.log(data));
//make amplifier
function markerSize(magnitude) {
    return (magnitude^2)*1000;
}

//data mining
function datamining(depth){
    if(depth<10) return '#edf8fb';
    else if (depth<30) return '#bfd3e6';
    else if (depth<50) return '#9ebcda';
    else if (depth<70) return '#8c96c6';
    else if (depth<90) return '#8856a7';
    else return '#810f7c'
}

//feed data to createFeatures;
d3.json(url).then(function (data){
    createFeatures(data.features);
})
function createFeatures(datafeed){
    function onEachFeature(feature,layer){
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p></h4><hr><p>Magnitude: ${feature.properties.mag}</p>`);
    }
    var events=L.geoJSON(datafeed, {
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, coord) {

        var markers = {
          radius: markerSize(6*feature.properties.mag),
          fillColor: datamining(feature.geometry.coordinates[2]),
          color: "black",
          weight: 1,
          opacity: 1,
          stroke: true,
          fillOpacity: 0.9
        };
        return L.circle(coord,markers);
      }
    });
    // give it to basemap
    baseMap(events);
  }
  ///////base map /////////////////////////
function baseMap(events) {
    // Create the base layers.
     var copyright = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});
     //the base map
    var myMap = L.map("map", {
      center: [
        33,-115
      ],
      zoom: 6,
      layers: [copyright, events]
    });

    //add legend
    var legend=L.control({position: 'bottomright'});

    legend.onAdd = function () {

        var div = L.DomUtil.create('div', 'info legend'),
        depth = [-10, 10, 30, 50, 70, 90];

        div.innerHTML+='Depth<br><hr>'
        for (var i = 0; i < depth.length; i++) {
            div.innerHTML +=
            '<i style="background:' + datamining(depth[i] + 1) + '">-------------</i> ' +
            depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }

    return div;
    };

    legend.addTo(myMap);
  };

//////////////////////////

