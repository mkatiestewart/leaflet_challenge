// Create the map object
let myMap = L.map("map", {
  center: [39.34461, -100.43864],
  zoom: 4
});

// Add the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Get the GeoJSON data
d3.json(queryUrl).then(function(data) { 
  place_list=[]
  for (let i =0; i <data.features.length; i++) {
    let feat= data.features[i]

    let color = "";
    if (feat.geometry.coordinates[2] > 50) {
      color = "firebrick";
    } else if (feat.geometry.coordinates[2] > 40) {
      color = "crimson";
    } else if (feat.geometry.coordinates[2] > 30) {
      color = "red";
    } else if (feat.geometry.coordinates[2] > 20) {
      color = "darkorange";
    } else if (feat.geometry.coordinates[2] > 10) {
      color = "gold"}
      else {
      color='limegreen'
      }
    L.circle([feat.geometry.coordinates[1],feat.geometry.coordinates[0]], {
      fillOpacity: 0.75,
      color: color,
      fillColor: color,

      // Adjust the radius
      radius: Math.sqrt(feat.properties.mag) * 300000
  }).bindPopup(`<h2>${feat.properties.place}</h2> <hr> <h3>Magitude: ${feat.properties.mag}<br>Depth of Earthquake: ${feat.geometry.coordinates[2]}</h3>`).addTo(myMap);
}
});

let legend = L.control({ position: "bottomright" })
legend.onAdd= function(){
  let div = L.DomUtil.create('div', 'info legend');
  let limits = ['<10', '10-20','20-30','30-40','40-50','>50'];
  let colors=['limegreen',"gold","darkorange","red", 'crimson','firebrick'];
  div.innerHTML+= `<h2>Size of Circle Related to Magnitude</h2><hr><h2>Depth of Earthquake </h2>`
  for (let i=0; i<limits.length; i++) {
    div.innerHTML+= `<p style="background-color:${colors[i]}" > ${limits[i]} </p>`
  }
  return div
};

legend.addTo(myMap)