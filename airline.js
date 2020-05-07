console.clear();

values = getValues();
selectedValueFlight = "asa"

  
function getValues(){
  var result = Object.keys(airlines).map(function (key) { 
    return {"key": key, "value": airlines[key]}; 
  }); 
  return result;
}

function changeSelectedAirline(value){
  if (selectedValueFlight != value) {
    selectedValueFlight = value
    chart.createChart('.chart');
  }
}

if (this.values.length == 0) document.getElementById("category").innerHTML = "<option></option>";
else {
  var catOptions = "";
  // console.log(this.values)
  for (x=0; x < this.values.length; x++) {
        catOptions += "<option value=" + this.values[x].key + ">" + this.values[x].value + "</option>";
    }
    document.getElementById("category").innerHTML = catOptions;
}

var chart = {

  element      : "",
  chart        : "",
  polygon      : "",
  width        : 100,
  height       : 100,
  maxValue     : 0,
  values       : [],
  selectedValue : "asa",
  flights       : [],
  points       : [],
  vSteps       : 24,
  measurements : [],

  getFlights : function(){
    var flightsData = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    for(x=0; x < flights_jan_01_2008.length; x++) {
      var flight = flights_jan_01_2008[x]
      if (flight && flight.airline && flight.time && flight.airline == selectedValueFlight && /\d{2}:\d{2}:\d{2}/.test(flight.time)) {
        key = parseInt(flight.time.substring(0, 2))
        flightsData[key] += 1;
      }
    }
    return flightsData;
  },

  calcMeasure : function(){
    this.measurements = [];
      for(x=0; x < this.vSteps; x++){
        var measurement = x < 10 ? "0" + x : x;
        this.measurements.push(measurement);
      }
  },
  /**
   * Get Element
   * Take the selector  being passed, determine if 
   * the selector is a class (".") or an id ("#"), and get the element
   * @param  {String} element - the element selector
   */
  getElement : function(element){
  	if(element.indexOf(".") == 0){
  		this.element = document.getElementsByClassName("chart")[0]	
  	} 
  	else if(element.indexOf("#") == 0){
  		this.element = document.getElementById("chart");
  	}
  	else {
  		console.error("Please select a valid element");
  	}
  	
  },
  /**
   * Create Chart
   *  - calc the max value
   *  - calc the points for the polygon
   *  - create a chart <svg> 
   *  	- set width, height, and viewbox attributes on <svg>
   *  - create a <polygon>
   *  	- set points on <polygon>	
   *  - calc the vertical measurements
   * @param  {array} values - the values to plot on the chart
   */
  createChart : function(element){
    console.log(selectedValueFlight)
  	this.getElement(element);
  	this.flights = this.getFlights();

    // Do some calculations
    this.calcMaxValue();
    this.calcPoints();
    this.calcMeasure();
    // this.getValues();
    
    // Clear any existing
    this.element.innerHTML = "";
    
    // Create the <svg>
    this.chart = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.chart.setAttribute("width", "100%");
    this.chart.setAttribute("height", "100%");
    this.chart.setAttribute("viewBox", "0 0 " + chart.width + " " + chart.height);

    // Create the <polygon>
    this.polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
    this.polygon.setAttribute("points", this.points);
    this.polygon.setAttribute("class", "line");
  
    if(this.flights.length > 1){
      var measurements = document.createElement("div");
      measurements.setAttribute("class", "chartMeasurements");
      for(x=0; x < this.measurements.length; x++){
        var measurement = document.createElement("div");
        measurement.setAttribute("class", "chartMeasurement");
        measurement.innerHTML = this.measurements[x];
        measurements.appendChild(measurement);
      }


      this.element.appendChild(measurements);
      // Append the <svg> to the target <div>
      this.element.appendChild(this.chart);
      // Append the polygon to the target <svg>
      this.chart.appendChild(this.polygon);
    }
  },
  /**
   * Calc Points
   * Calculate all the points for the polygon
   */
  calcPoints : function(){
    this.points = [];
    if(this.flights.length > 1){
      // First point is bottom left hand side (max value is the bottom of graph)
      var points = "0," + chart.height + " ";
      // Loop through each value
      for(x=0; x < this.flights.length; x++){
        // Calculate the perecentage of this value/the max value
        var perc  = this.flights[x] / this.maxValue;
        // Steps is a percentage (100) / the total amount of values
        var steps = 100 / ( this.flights.length - 1 );
        // Create the point, limit points to 2 decimal points, 
        // Y co-ord is calculated by the taking the chart height, 
        // then subtracting (chart height * the percentage of this point)
        // Remember the & co-ord is measured from the top not the bottom like a traditional graph
        var point = (steps * (x )).toFixed(2) + "," + (this.height - (this.height * perc)).toFixed(2) + " ";
        // Add this point
        points += point;
      }
      // Add the final point (bottom right)
      points += "100," + this.height;
      this.points = points;
      
     
    }

  },
  /**
   * Calculate Max Value
   * Find the highest value in the array, and then
   * add 10% to it so the graph doesn't touch the top of the chart
   */
  calcMaxValue : function(){
    this.maxValue = 0;
    for(x=0; x < this.flights.length; x++){
      if(this.flights[x] > this.maxValue){
        this.maxValue = this.flights[x];
      }
    }
    // Round up to next integer
    this.maxValue = 20 ;
  }
}

var values = [];

function addValue(){
  var input = document.getElementById("value");
  var value = parseInt(input.value);
  
  if(!isNaN(value)){
    // values.push(value);
    chart.createChart('.chart',values);  
  } 
  
  input.value = "";
  
  
}

function clearChart(){
  values = [];
  chart.createChart('.chart',values);  
}





chart.createChart('.chart');  


