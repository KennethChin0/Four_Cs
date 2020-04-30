console.log("hi")

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
  console.log(e)
}
