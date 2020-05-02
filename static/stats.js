var margin = {top: 10, right: 30, bottom: 30, left: 100},
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var chosenCountry = document.getElementById("country")
chosenCountry.addEventListener('input',function(e){check(this)})

var list = document.getElementById("allCountries")


var check = function(e){//checks if input is a valid country
  for (var i = 0; i < list.childElementCount; i++){
    if (list.children[i].value.localeCompare(e.value) == 0){
      if (e.value.localeCompare("United States") == 0){
        createTimeGraphUS(e.value)
        createPopulationPieUS("US")
      }
      else{
        createTimeGraph(e.value)//e.value is the chosen country
        createPopulationPie(e.value)//population vs confirmed pie chart
        createBarGraph(e.value)
      }
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

    //console.log(filteredData)
    //console.log(allDates)
    for (i = 0; i < filteredData.length; i++){
      filteredData[i].Date = allDates[i]
    }
    //console.log(filteredData)
    var svg = d3.select("#timeGraph")
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
  //console.log(filteredData)
}

var createPopulationPie = function(e){
  var width = 450
  var height = 450
  var margin = 40

  var radius = Math.min(width, height) / 2 - margin

  var svg = d3.select("#populationPie")
    .append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var population = 0
  var latestNumOfConfirmed = 0
  var allConfirmedDays = []

  d3.csv("static/data/reference.csv").then(function(data){
    var found = false;//reference.csv includes state/province population so we
    //only need the first match which is total population
    for (var i = 0; i < data.length; i++){
      if (e.localeCompare(data[i].Country_Region) == 0 && !found){
        population = data[i].Population
        //console.log(population)
        found = true
      }
    }


    d3.csv("static/data/countries-aggregated.csv").then(function(data){
        for (var i = 0; i < data.length; i++){
          if (data[i].Country.localeCompare(e) == 0){
            allConfirmedDays.push(data[i].Confirmed)
          }
        }
        latestNumOfConfirmed = allConfirmedDays[allConfirmedDays.length - 1]
        var pieData = {Healthy : population - latestNumOfConfirmed, Confirmed : parseInt(latestNumOfConfirmed)}

        var color = d3.scaleOrdinal()
          .domain(pieData)
          .range(["#73c378","#f9694c"]);

        var pie = d3.pie()
          .value(function(d) {return d.value; })
        var data_ready = pie(d3.entries(pieData))
        var arcGenerator = d3.arc()
          .innerRadius(0)
          .outerRadius(radius)
        svg
          .selectAll('mySlices')
          .data(data_ready)
          .enter()
          .append('path')
            .attr('d', arcGenerator)
            .attr('fill', function(d){ return(color(d.data.key)) })
            .style("stroke-width", "2px")
            .style("opacity", 0.7)
            svg
      .selectAll('mySlices')
        .data(data_ready)
        .enter()
        .append('text')
        .text(function(d){ return d.data.key})
        .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
        .style("text-anchor", "middle")
        .style("font-size", 17)

    })
  })



}

var createTimeGraphUS = function(e){
  var filteredData = []//new data array with only the specified country data
  //needs a separate checker for United States because US is part of different csv
  var allDates = []
  var allUSConfirmed = []
  d3.csv("static/data/key-countries-pivoted.csv").then(function(data){
    for (var i = 0; i < data.length; i++){
      allDates.push(d3.timeParse("%Y-%m-%d")(data[i].Date))
      allUSConfirmed.push({Date: data[i]}.US)
      filteredData.push(data[i])
    }

    //console.log(filteredData)
    //console.log(allDates)
    for (i = 0; i < filteredData.length; i++){
      filteredData[i].Date = allDates[i]
    }
    //console.log(filteredData)
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
      .domain([0, d3.max(filteredData, function(d) { return +d.US; })])
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
     .y(function(d) { return y(d.US) })
   )
  })
  //console.log(filteredData)
}

var createPopulationPieUS = function(e){
  var width = 450
  var height = 450
  var margin = 40

  var radius = Math.min(width, height) / 2 - margin

  var svg = d3.select("#populationPie")
    .append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var population = 0
  var latestNumOfConfirmed = 0
  var allConfirmedDays = []

  d3.csv("static/data/reference.csv").then(function(data){
    var found = false;//reference.csv includes state/province population so we
    //only need the first match which is total population
    for (var i = 0; i < data.length; i++){
      if (e.localeCompare(data[i].Country_Region) == 0 && !found){
        population = data[i].Population
        //console.log(population)
        found = true
      }
    }


    d3.csv("static/data/key-countries-pivoted.csv").then(function(data){
        for (var i = 0; i < data.length; i++){
          allConfirmedDays.push(data[i].US)
        }
        latestNumOfConfirmed = allConfirmedDays[allConfirmedDays.length - 1]
        var pieData = {Healthy : population - latestNumOfConfirmed, Confirmed : parseInt(latestNumOfConfirmed)}

        var color = d3.scaleOrdinal()
          .domain(pieData)
          .range(["#73c378","#f9694c"]);

        var pie = d3.pie()
          .value(function(d) {return d.value; })
        var data_ready = pie(d3.entries(pieData))
        var arcGenerator = d3.arc()
          .innerRadius(0)
          .outerRadius(radius)
        svg
          .selectAll('mySlices')
          .data(data_ready)
          .enter()
          .append('path')
            .attr('d', arcGenerator)
            .attr('fill', function(d){ return(color(d.data.key)) })
            .style("stroke-width", "2px")
            .style("opacity", 0.7)
            svg
      .selectAll('mySlices')
        .data(data_ready)
        .enter()
        .append('text')
        .text(function(d){ return d.data.key})
        .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
        .style("text-anchor", "middle")
        .style("font-size", 17)

    })
  })
}

var createBarGraph = function(e){
  var x = d3.scaleBand()
    .range([0, width])
    .padding(0.1);
  var y = d3.scaleLinear()
    .range([height, 0]);

  var svg = d3.select("#barGraph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("static/data/countries-aggregated.csv").then(function(data){
    var filteredData = []//getting all rows with the specified country
    for (var i = 0; i < data.length; i++){
      if (data[i].Country.localeCompare(e) == 0){
        filteredData.push(data[i])
      }
    }

    filteredData = [filteredData[filteredData.length - 1]]
    filteredData = [{Category : "Confirmed", number : filteredData[0].Confirmed},
                    {Category : "Recovered", number : filteredData[0].Recovered},
                    {Category : "Deaths", number : filteredData[0].Deaths}]

    var allCategory = []
    var allNumbers = []
    for (var i = 0; i < filteredData.length; i++){
      allCategory.push({Category : filteredData[i].Category})
      allNumbers.push({number : filteredData[i].number})
    }

    x.domain(filteredData.map(function(d) { return d.Category; }));
    y.domain([0, d3.max(filteredData, function(d) { return d.number; })]);

    console.log(x(filteredData.Category))

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.selectAll(".bar")
      .data(filteredData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("fill", "#88cd87")
      .attr("x", function(d) { return x(d.Category); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(Number(d.number)); })
      .attr("height", function(d) { return height - y(Number(d.number)); });
  })
}
