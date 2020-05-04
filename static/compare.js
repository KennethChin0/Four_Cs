var margin = {top: 10, right: 30, bottom: 30, left: 100},
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var chosenCountry1 = document.getElementById("country1")
chosenCountry1.addEventListener('input',function(e){check1(this)})

var chosenCountry2 = document.getElementById("country2")
chosenCountry2.addEventListener('input',function(e){check2(this)})

var list = document.getElementById("allCountries")

var country1;
var country2;

var clear = function(e) {
  d3.select('#timeGraph').selectAll('svg').remove();
}

var check1 = function(e){
  for (var i = 0; i < list.childElementCount; i++){
    if (list.children[i].value.localeCompare(e.value) == 0){
      if (e.value.localeCompare("United States") == 0){
        country1 = "United States"
        clear()
        draw()
      }
      else{
        country1 = e.value
        clear()
        draw()
      }
    }
  }

}

var check2 = function(e){
  for (var i = 0; i < list.childElementCount; i++){
    if (list.children[i].value.localeCompare(e.value) == 0){
      if (e.value.localeCompare("United States") == 0){
        country2 = "United States"
        clear()
        draw()
      }
      else{
        country2 = e.value
        clear()
        draw()
      }
    }
  }
}

var draw = function(e){
  if (country1 != undefined && country2 != undefined){
    if (country1.localeCompare("United States") == 0){
      lineGraphUS()
      }
    else{
      if (country2.localeCompare("United States") == 0){
        lineGraphUS()
      }
      else{
        lineGraph()
      }
    }
  }
}


var lineGraph = function(e){
  var filteredData1 = []//new data array with only the specified country data
  //needs a separate checker for United States because US is part of different csv
  var filteredData2 = []
  var allDates1 = []
  var allDates2 = []
  var c1 = country1;
  var c2 = country2;

  d3.csv("static/data/countries-aggregated.csv").then(function(data){
    for (var i = 0; i < data.length; i++){
      if (data[i].Country.localeCompare(c1) == 0){
        filteredData1.push(data[i])
        allDates1.push(d3.timeParse("%Y-%m-%d")(data[i].Date))
      }
    }
    for (var i = 0; i < data.length; i++){
      if (data[i].Country.localeCompare(c2) == 0){
        filteredData2.push(data[i])
        allDates2.push(d3.timeParse("%Y-%m-%d")(data[i].Date))
      }
    }
    //console.log(filteredData)
    //console.log(allDates)
    for (i = 0; i < filteredData1.length; i++){
      filteredData1[i].Date = allDates1[i]
    }
    for (i = 0; i < filteredData2.length; i++){
      filteredData2[i].Date = allDates2[i]
    }
    console.log(filteredData1)
    console.log(filteredData2)
    if (parseInt(filteredData1[filteredData1.length-1].Confirmed) < parseInt(filteredData2[filteredData2.length-1].Confirmed)){
      //filteredData1 will always be the one with the highest number of cases so the graph won't cut off some data
      var temp = filteredData1
      filteredData1 = filteredData2
      filteredData2 = temp
      var temp2 = allDates1
      allDates1 = allDates2
      allDates2 = temp2
      console.log("YES")
    }
    var svg = d3.select("#timeGraph")
      .append("svg")
        .attr("width", width + margin.left + margin.right + 50)
        .attr("height", height + margin.top + margin.bottom )
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleTime()
      .domain(d3.extent(allDates1))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    var y = d3.scaleLinear()
      .domain([0, d3.max(filteredData1, function(d) { return +d.Confirmed; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    svg.append("path")
   .datum(filteredData1)
   .attr("fill", "none")
   .attr("stroke", "blue")
   .attr("stroke-width", 1.5)
   .attr("d", d3.line()
     .x(function(d) { return x(d.Date) })
     .y(function(d) { return y(d.Confirmed) })
   )

   svg.append("path")
  .datum(filteredData2)
  .attr("fill", "none")
  .attr("stroke", "red")
  .attr("stroke-width", 1.5)
  .attr("d", d3.line()
    .x(function(d) { return x(d.Date) })
    .y(function(d) { return y(d.Confirmed) })
  )

  })
  //console.log(filteredData)
}

var lineGraphUS = function(e){
  var c1;
  var c2;
  if (country2.localeCompare("United States") == 0){
    c1 = country2
    c2 = country1
  }
  else{
    c1 = country1
    c2 = country2
  }
  var filteredData1 = []//new data array with only the specified country data
  //needs a separate checker for United States because US is part of different csv
  var allDates1 = []
  var allUSConfirmed1 = []
  d3.csv("static/data/key-countries-pivoted.csv").then(function(data){

    for (var i = 0; i < data.length; i++){
      allDates1.push(d3.timeParse("%Y-%m-%d")(data[i].Date))
      allUSConfirmed1.push({Date: data[i]}.US)
      filteredData1.push(data[i])
    }

    //console.log(filteredData)
    //console.log(allDates)
    for (var i = 0; i < filteredData1.length; i++){
      filteredData1[i].Date = allDates1[i]
    }
    //console.log(filteredData)
    var svg = d3.select("#timeGraph")
      .append("svg")
        .attr("width", width + margin.left + margin.right + 50)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleTime()
      .domain(d3.extent(allDates1))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    var y = d3.scaleLinear()
      .domain([0, d3.max(filteredData1, function(d) { return +d.US; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    svg.append("path")
   .datum(filteredData1)
   .attr("fill", "none")
   .attr("stroke", "steelblue")
   .attr("stroke-width", 1.5)
   .attr("d", d3.line()
     .x(function(d) { return x(d.Date) })
     .y(function(d) { return y(d.US) })
   )

   if (c2.localeCompare("United States") != 0){
     d3.csv("static/data/countries-aggregated.csv").then(function(data2){
       var filteredData2 = []
       var allDates2 = []
       for (var i = 0; i < data2.length; i++){
         if (data2[i].Country.localeCompare(c2) == 0){
           filteredData2.push(data2[i])
           console.log(data2[i])
           allDates2.push(d3.timeParse("%Y-%m-%d")(data2[i].Date))
         }
       }
       for (i = 0; i < filteredData2.length; i++){
         filteredData2[i].Date = allDates2[i]
       }
       console.log(filteredData2)
       svg.append("path")
        .datum(filteredData2)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x(function(d) { return x(d.Date) })
          .y(function(d) { return y(d.Confirmed) })
      )
     })
   }
  })
}

var barGraph = function(e){
  var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

  var x1 = d3.scale.ordinal();

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x0)
      .tickSize(0)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var color = d3.scale.ordinal()
      .range(["#ca0020","#f4a582","#d5d5d5","#92c5de","#0571b0"]);

  var svg = d3.select('#barGraph').append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("static/data/countries-aggregated.csv").then(function(data){
    var allCategories = []
    var allSubCategories = []
    var filteredData = []
    for (var i = 0; i < data.length; i++){
      if (data[i].Country.localeCompare(e) == 0){
        filteredData.push(data[i])
      }
    }
  })

}
