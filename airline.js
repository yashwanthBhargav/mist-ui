console.clear();

values = getValues();
selectedValueFlight = "all";
previousPoints = "";

function getValues() {
  var result = Object.keys(airlines).map(function (key) {
    return { key: key, value: airlines[key] };
  });
  return result;
}

var input = document.getElementById("searchText");
input.addEventListener("keyup", function (event) {
  if (event.keyCode === 13 && input.value.trim() != "") {
    event.preventDefault();
    changeSelectedAirline(input.value);
    input.value = "";
  }
});

function searchMethod(value) {
  for (var key in airlines) {
    if (airlines[key].toLowerCase().includes(value.toLowerCase())) {
      return key;
    }
  }
  return "all";
}

function reset() {
  changeSelectedAirline("zxcvv");
  input.value = "";
}

function changeSelectedAirline(value) {
  var selected = searchMethod(value);
  if (selectedValueFlight != selected) {
    selectedValueFlight = selected;
    chart.createChart(".chart");
    // var animate = document.getElementById("animation-to-check");
    // animate.beginElement();
  }
}

// if (this.values.length == 0) document.getElementById("category").innerHTML = "<option></option>";
// else {
//   var catOptions = "";
//   // console.log(this.values)
//   for (x=0; x < this.values.length; x++) {
//         catOptions += "<option value=" + this.values[x].key + ">" + this.values[x].value + "</option>";
//     }
//     document.getElementById("category").innerHTML = catOptions;
// }

var chart = {
  element: "",
  chart: "",
  polygon: "",
  width: 100,
  height: 100,
  maxValue: 0,
  selectedValue: "asa",
  flights: [],
  points: [],
  linePoints: [],
  vSteps: 24,
  measurements: [],
  animate: "",
  date: "1 Jan 2008",
  totalFights: 0,

  getFlights: function () {
    var flightsData = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ];
    this.totalFights = 0;
    for (x = 0; x < flights_jan_01_2008.length; x++) {
      var flight = flights_jan_01_2008[x];
      if (
        flight &&
        flight.airline &&
        flight.time &&
        (selectedValueFlight === "all" ||
          flight.airline == selectedValueFlight) &&
        /\d{2}:\d{2}:\d{2}/.test(flight.time)
      ) {
        key = parseInt(flight.time.substring(0, 2));
        flightsData[key] += 1;
        this.totalFights += 1;
      }
    }
    console.log(flightsData);
    return flightsData;
  },

  calcMeasure: function () {
    this.measurements = [];
    for (x = 0; x < this.vSteps; x++) {
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
  getElement: function (element) {
    if (element.indexOf(".") == 0) {
      this.element = document.getElementsByClassName("chart")[0];
    } else if (element.indexOf("#") == 0) {
      this.element = document.getElementById("chart");
    } else {
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
  createChart: function (element) {
    console.log(selectedValueFlight);
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
    this.chart.setAttribute("preserveAspectRatio", "none");
    this.chart.setAttribute(
      "viewBox",
      "0 0 " + chart.width + " " + chart.height
    );

    // if (!previousPoints || previousPoints === "") {
    //   this.polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
    //   this.polygon.setAttribute("points", this.points);
    //   this.polygon.setAttribute("class", "line");

    // } else {

    //   // Create the <polygon>
    //   this.polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
    //   this.polygon.setAttribute("points", previousPoints);
    //   this.polygon.setAttribute("class", "line");

    //   this.animate = document.createElement("animate");
    //   this.animate.setAttribute("id", "animation-to-check");
    //   this.animate.setAttribute("begin","indefinite");
    //   this.animate.setAttribute("repeatCount","indefinite");
    //   this.animate.setAttribute("attributeName","points");
    //   this.animate.setAttribute("dur","10000ms");
    //   // this.animate.setAttribute("from",previousPoints);
    //   this.animate.setAttribute("values",this.points);
    // }

    // Create the <polygon>
    this.polygon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon"
    );
    this.polygon.setAttribute("points", this.points);
    this.polygon.setAttribute("class", "line");

    var line = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polyline"
    );
    line.setAttribute("points", this.linePoints);

    if (this.flights.length > 1) {
      var measurements = document.createElement("div");
      measurements.setAttribute("class", "chartMeasurements");
      for (x = 0; x < this.measurements.length; x++) {
        var measurement = document.createElement("div");
        measurement.setAttribute("class", "chartMeasurement");
        measurement.innerHTML = this.measurements[x];
        measurements.appendChild(measurement);
      }

      var date = document.getElementById("date");
      date.textContent = "Date : " + this.date;

      var count = document.getElementById("count");
      count.textContent = this.totalFights + " flights";

      var name = document.getElementById("name");
      name.textContent =
        selectedValueFlight === "all"
          ? "All airlines"
          : airlines[selectedValueFlight];

      this.element.appendChild(measurements);
      // Append the <svg> to the target <div>
      this.element.appendChild(this.chart);
      // Append the polygon to the target <svg>
      this.chart.appendChild(this.polygon);
      // if (previousPoints && previousPoints != "") {
      //   this.polygon.appendChild(this.animate);
      // }
      this.chart.appendChild(line);
      previousPoints = this.points;
    }
  },
  /**
   * Calc Points
   * Calculate all the points for the polygon
   */
  calcPoints: function () {
    if (this.flights.length > 1) {
      // First point is bottom left hand side (max value is the bottom of graph)
      var polygonPoints = "0," + chart.height + " ";

      var linePoints = "";

      polygonPoints +=
        "0," +
        (this.height - this.height * (this.flights[0] / this.maxValue)).toFixed(
          2
        ) +
        " ";
      // Loop through each value
      for (x = 0; x < 24; x++) {
        var delta = this.width / 24;

        // Calculate the perecentage of this value/the max value
        var perc = this.flights[x] / this.maxValue;
        // Create the point, limit points to 2 decimal points,
        // Y co-ord is calculated by the taking the chart height,
        // then subtracting (chart height * the percentage of this point)
        // Remember the & co-ord is measured from the top not the bottom like a traditional graph
        var point =
          ((x + 0.5) * delta).toFixed(2) +
          "," +
          (this.height - this.height * perc).toFixed(2) +
          " ";
        // Add this point
        polygonPoints += point;
        linePoints += point;
      }
      // Add the final point (bottom right)
      polygonPoints +=
        "100," +
        (
          this.height -
          this.height * (this.flights[23] / this.maxValue)
        ).toFixed(2) +
        " ";
      polygonPoints += "100," + this.height;
      this.points = polygonPoints;
      this.linePoints = linePoints;
    }
  },
  /**
   * Calculate Max Value
   * Find the highest value in the array, and then
   * add 10% to it so the graph doesn't touch the top of the chart
   */
  calcMaxValue: function () {
    this.maxValue = 0;
    for (x = 0; x < this.flights.length; x++) {
      if (this.flights[x] > this.maxValue) {
        this.maxValue = this.flights[x];
      }
    }
    // Round up to next integer
    // this.maxValue = Math.ceil(this.maxValue);
    if (this.maxValue < 100) {
      this.maxValue += 20;
    } else {
      this.maxValue += 50;
    }
  }

  // updateSvg : function(){
  //   if (this.animate && this.animate != "") {
  //     this.animate.setAttribute("from",previousPoints);

  //     this.getFlights();
  //     this.calcPoints();
  //     this.animate.setAttribute("to",this.points);
  //   } else {

  //     this.animate = document.createElement("animate");
  //     this.animate.setAttribute("id", "animation-to-check");
  //     this.animate.setAttribute("repeatCount","1");
  //     this.animate.setAttribute("attributeName","points");
  //     this.animate.setAttribute("dur","1000ms");
  //     this.animate.setAttribute("from",previousPoints);
  //     this.animate.setAttribute("to",this.points);
  //   }
  // }
};

chart.createChart(".chart");
