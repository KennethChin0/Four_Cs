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
  var allDates = []
  var allCountries = []
  var allConfirmed = []
  var allRecovered = []
  var allDeaths = []
  d3.csv("static/data/countries-aggregated.csv").then(function(data){
    for (var i = 0; i < data.length; i++){
      if (data[i].Country.localeCompare(e) == 0){
        filteredData.push(data[i])
        allDates.push(d3.timeParse("%Y-%m-%d")(data[i].Date))
        allCountries.push( {Country: data[i].Country})
        allConfirmed.push({Confirmed: data[i].Confirmed})
        allRecovered.push({Recovered: data[i].Recovered})
        allDeaths.push({Deaths: data[i].Deaths})
      }
    }

    console.log(filteredData)
    console.log(allDates)
    for (i = 0; i < filteredData.length; i++){
      filteredData[i].Date = allDates[i]
    }
    console.log(filteredData)
    var svg = d3.select("#timeGraph")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
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
   .attr("stroke", "steelblue")
   .attr("stroke-width", 1.5)
   .attr("d", d3.line()
     .x(function(d) { return x(d.Date) })
     .y(function(d) { return y(d.Confirmed) })
   )
  })
  //console.log(filteredData)
}
