var margin = {top: 10, right: 30, bottom: 30, left: 100},
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var chosenCountry = document.getElementById("country")
chosenCountry.addEventListener('input',function(e){check(this)})

var list = document.getElementById("allCountries")


var check = function(e){//checks if input is a valid country
  for (var i = 0; i < list.childElementCount; i++){
    if (list.children[i].value.localeCompare(e.value) == 0){
      createTimeGraph(e.value)//e.value is the chosen country
    }
  }
}

var createTimeGraph = function(e){
  var filteredData = []//new data array with only the specified country data
  //needs a separate checker for United States because US is part of different csv
  d3.csv("static/data/countries-aggregated.csv").then(function(data){
    for (var i = 0; i < data.length; i++){
      if (data[i].Country.localeCompare(e) == 0){
        filteredData.push(data[i])
      }
    }

    var svg = d3.select("#timeGraph")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.Date; }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.Confirmed; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));
    console.log(e)
  })
  //console.log(filteredData)
}
