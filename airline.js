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
  }
}

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
  getElement: function (element) {
    if (element.indexOf(".") == 0) {
      this.element = document.getElementsByClassName("chart")[0];
    } else if (element.indexOf("#") == 0) {
      this.element = document.getElementById("chart");
    } else {
      console.error("Please select a valid element");
    }
  },
  createChart: function (element) {
    console.log(selectedValueFlight);
    this.getElement(element);
    this.flights = this.getFlights();

    this.calcMaxValue();
    this.calcPoints();
    this.calcMeasure();

    this.element.innerHTML = "";

    this.chart = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.chart.setAttribute("width", "100%");
    this.chart.setAttribute("height", "100%");
    this.chart.setAttribute("preserveAspectRatio", "none");
    this.chart.setAttribute(
      "viewBox",
      "0 0 " + chart.width + " " + chart.height
    );

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
      this.element.appendChild(this.chart);
      this.chart.appendChild(this.polygon);
      this.chart.appendChild(line);
      previousPoints = this.points;
    }
  },
  calcPoints: function () {
    if (this.flights.length > 1) {
      var polygonPoints = "0," + chart.height + " ";

      var linePoints = "";

      polygonPoints +=
        "0," +
        (this.height - this.height * (this.flights[0] / this.maxValue)).toFixed(
          2
        ) +
        " ";
      for (x = 0; x < 24; x++) {
        var delta = this.width / 24;

        var perc = this.flights[x] / this.maxValue;
 
        var point =
          ((x + 0.5) * delta).toFixed(2) +
          "," +
          (this.height - this.height * perc).toFixed(2) +
          " ";
        polygonPoints += point;
        linePoints += point;
      }
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
  calcMaxValue: function () {
    this.maxValue = 0;
    for (x = 0; x < this.flights.length; x++) {
      if (this.flights[x] > this.maxValue) {
        this.maxValue = this.flights[x];
      }
    }
    if (this.maxValue < 100) {
      this.maxValue += 20;
    } else {
      this.maxValue += 50;
    }
  }

};

chart.createChart(".chart");
