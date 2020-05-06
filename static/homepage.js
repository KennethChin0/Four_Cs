window.onload = function(){
  lineGraphCountries()
  lineGraphAggregated()
  mapWorld()
}

var margin = {top: 10, right: 30, bottom: 30, left: 100},
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var lineGraphCountries = function(e){
  var filteredData = []//new data array with only the specified country data
  //needs a separate checker for United States because US is part of different csv
  var allDates = []

  d3.csv("static/data/key-countries-pivoted.csv").then(function(data){
    for (var i = 0; i < data.length; i++){
      filteredData.push({Date : d3.timeParse("%Y-%m-%d")(data[i].Date),
                        China : data[i].China, US : data[i].US,
                        United_Kingdom : data[i].United_Kingdom,
                        Italy : data[i].Italy, France : data[i].France,
                        Germany: data[i].Germany, Spain: data[i].Spain,
                        Iran : data[i].Iran})
      allDates.push(d3.timeParse("%Y-%m-%d")(data[i].Date))
    }
    var svg = d3.select("#lineGraphCountries")
      .append("svg")
        .attr("width", width + margin.left + margin.right + 50)
        .attr("height", height + margin.top + margin.bottom )
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleTime()
      .domain(d3.extent(allDates))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    var y = d3.scaleLinear()
      .domain([0, d3.max(filteredData, function(d) { return +d.US; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    svg.append("path")
     .datum(filteredData)
     .attr("fill", "none")
     .attr("stroke", "red")
     .attr("stroke-width", 1.5)
     .attr("d", d3.line()
       .x(function(d) { return x(d.Date) })
       .y(function(d) { return y(d.China) })
     )
   svg.append("path")
    .datum(filteredData)
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { return x(d.Date) })
      .y(function(d) { return y(d.US) })
    )
  svg.append("path")
   .datum(filteredData)
   .attr("fill", "none")
   .attr("stroke", "purple")
   .attr("stroke-width", 1.5)
   .attr("d", d3.line()
     .x(function(d) { return x(d.Date) })
     .y(function(d) { return y(d.United_Kingdom) })
   )
   svg.append("path")
   .datum(filteredData)
   .attr("fill", "none")
   .attr("stroke", "yellow")
   .attr("stroke-width", 1.5)
   .attr("d", d3.line()
   .x(function(d) { return x(d.Date) })
   .y(function(d) { return y(d.Italy) })
   )
   svg.append("path")
   .datum(filteredData)
   .attr("fill", "none")
   .attr("stroke", "orange")
   .attr("stroke-width", 1.5)
   .attr("d", d3.line()
   .x(function(d) { return x(d.Date) })
   .y(function(d) { return y(d.France) })
  )
  svg.append("path")
  .datum(filteredData)
  .attr("fill", "none")
  .attr("stroke", "green")
  .attr("stroke-width", 1.5)
  .attr("d", d3.line()
  .x(function(d) { return x(d.Date) })
  .y(function(d) { return y(d.Germany) })
  )
  svg.append("path")
  .datum(filteredData)
  .attr("fill", "none")
  .attr("stroke", "pink")
  .attr("stroke-width", 1.5)
  .attr("d", d3.line()
  .x(function(d) { return x(d.Date) })
  .y(function(d) { return y(d.Spain) })
  )
  svg.append("path")
  .datum(filteredData)
  .attr("fill", "none")
  .attr("stroke", "gray")
  .attr("stroke-width", 1.5)
  .attr("d", d3.line()
  .x(function(d) { return x(d.Date) })
  .y(function(d) { return y(d.Iran) })
  )

  svg.append("circle")
    .attr("cx",60).attr("cy",30).attr("r",8).style("fill", "red")
  svg.append("text").attr("x", 70).attr("y", 30).text("China").style("font-size", "15px").attr("alignment-baseline","middle")
  svg.append("circle")
    .attr("cx",60).attr("cy",50).attr("r",8).style("fill", "blue")
  svg.append("text").attr("x", 70).attr("y", 50).text("United States").style("font-size", "15px").attr("alignment-baseline","middle")
  svg.append("circle")
    .attr("cx",60).attr("cy",70).attr("r",8).style("fill", "purple")
  svg.append("text").attr("x", 70).attr("y", 70).text("United Kingdom").style("font-size", "15px").attr("alignment-baseline","middle")
  svg.append("circle")
    .attr("cx",60).attr("cy",90).attr("r",8).style("fill", "yellow")
  svg.append("text").attr("x", 70).attr("y", 90).text("Italy").style("font-size", "15px").attr("alignment-baseline","middle")
  svg.append("circle")
    .attr("cx",60).attr("cy",110).attr("r",8).style("fill", "orange")
  svg.append("text").attr("x", 70).attr("y", 110).text("France").style("font-size", "15px").attr("alignment-baseline","middle")
  svg.append("circle")
    .attr("cx",60).attr("cy",130).attr("r",8).style("fill", "green")
  svg.append("text").attr("x", 70).attr("y", 130).text("Germany").style("font-size", "15px").attr("alignment-baseline","middle")
  svg.append("circle")
    .attr("cx",60).attr("cy",150).attr("r",8).style("fill", "pink")
  svg.append("text").attr("x", 70).attr("y", 150).text("Spain").style("font-size", "15px").attr("alignment-baseline","middle")
  svg.append("circle")
    .attr("cx",60).attr("cy",170).attr("r",8).style("fill", "gray")
  svg.append("text").attr("x", 70).attr("y", 170).text("Iran").style("font-size", "15px").attr("alignment-baseline","middle")
  })

}

var lineGraphAggregated = function(e){
  var filteredData = []
  var allDates = []
  d3.csv("static/data/worldwide-aggregated.csv").then(function(data){
    for (var i = 0; i < data.length; i++){
      filteredData.push({Date : d3.timeParse("%Y-%m-%d")(data[i].Date),
                        Confirmed : data[i].Confirmed, Recovered : data[i].Recovered,
                        Deaths : data[i].Deaths})
      allDates.push(d3.timeParse("%Y-%m-%d")(data[i].Date))
    }
    var svg = d3.select("#lineGraphAggregated")
      .append("svg")
        .attr("width", width + margin.left + margin.right + 50)
        .attr("height", height + margin.top + margin.bottom )
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
    var x = d3.scaleTime()
      .domain(d3.extent(allDates))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
      var y = d3.scaleLinear()
        .domain([0, d3.max(filteredData, function(d) { return +d.Confirmed; })])
        .range([ height, 0 ]);
      svg.append("g")
        .call(d3.axisLeft(y));

      svg.append("path")
     .datum(filteredData)
     .attr("fill", "none")
     .attr("stroke", "blue")
     .attr("stroke-width", 1.5)
     .attr("d", d3.line()
       .x(function(d) { return x(d.Date) })
       .y(function(d) { return y(d.Confirmed) })
     )

     svg.append("path")
    .datum(filteredData)
    .attr("fill", "none")
    .attr("stroke", "green")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { return x(d.Date) })
      .y(function(d) { return y(d.Recovered) })
    )

    svg.append("path")
    .datum(filteredData)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
     .x(function(d) { return x(d.Date) })
     .y(function(d) { return y(d.Deaths) })
    )

    svg.append("text")
      .attr("transform", "translate(" + (width+3) + "," + y(Number(filteredData[filteredData.length -1].Confirmed)) + ")")
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .style("fill", "blue")
      .text("Confirmed");

    svg.append("text")
      .attr("transform", "translate(" + (width+3) + "," + y(Number(filteredData[filteredData.length -1].Recovered)) + ")")
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .style("fill", "green")
      .text("Recovered");

    svg.append("text")
      .attr("transform", "translate(" + (width+3) + "," + y(Number(filteredData[filteredData.length -1].Deaths)) + ")")
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .style("fill", "red")
      .text("Deaths");
  })
}


var mapWorld = function(e){



  Promise.all([
  d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'),
  d3.csv('static/data/countries-aggregated.csv')
  ]).then(
  d => ready(null, d[0], d[1], d)
  );
  // var promises = [
  // d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
  // d3.csv("static/data/countries-aggregated.csv").then(function(d) {
  //   //d = d.splice(17945)
  //   mapData.set(d.Country, +d.Confirmed);
  // })
  // ]
}

function ready(error, data, confirmed, something){
  confirmed = confirmed.splice(17945)
  var confirmedByCountry = {}
  confirmed.forEach(d => { confirmedByCountry[d.Country] = + d.Confirmed})
  data.features.forEach(d => {d.Confirmed = confirmedByCountry[d.Country]})

  console.log(confirmedByCountry)
  confirmedByCountry["United States"] = 1000000
  var projection = d3.geoRobinson()
    .scale(148)
    .rotate([352, 0, 0])
    .translate( [width / 2, height / 2]);
  var path = d3.geoPath().projection(projection);
  var color = d3.scaleThreshold()
    .domain([
      0, 1000, 10000, 100000, 1000000, 10000000
    ])
    .range(d3.schemeReds[5]);


  var svg = d3.select("#map")
    .append("svg")
      .attr("width", width + margin.left + margin.right )
      .attr("height", height + margin.top + margin.bottom )
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")
    .attr('class','map');

  svg.append('g')
    .attr('class', 'countries')
    .selectAll('path')
    .data(data.features)
    .enter().append('path')
      .attr('d', path)
      .style('fill', function(d){
        var value = confirmedByCountry[d.properties.name] || 0
        console.log(d.properties.name)
        if (d.properties.name.localeCompare("USA") == 0){
          value = 1240000
        }
        return color(value)})
      .style('stroke', 'white')
      .style('opacity', 0.8)
      .style('stroke-width', 0.3)
  svg.append('path')
    .datum(topojson.mesh(data.features, (a, b) => a.Confirmed !== b.Confirmed))
    .attr('class', 'names')
    .attr('d', path);
}
