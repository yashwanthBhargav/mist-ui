console.clear();

values = getValues();
selectedValueFlight = "all";
previousPoints = "";
dataPointsSvg = [];

function getValues() {
  var result = Object.keys(airlines).map(function (key) {
    return { key: key, value: airlines[key] };
  });
  return result;
}

var input = document.getElementById("searchText");
input.addEventListener("keyup", function (event) {
  if (event.keyCode == 13 && input.value.trim() != "") {
    event.preventDefault();
    changeSelectedAirline(input.value);
    input.value = "";
  }
});

function searchMethod(value) {
  if (value && value != "") {
    for (var key in airlines) {
      if (airlines[key].toLowerCase().includes(value.toLowerCase())) {
        return key;
      }
    }
  }
  return "all";
}

function reset() {
  changeSelectedAirline("");
  input.value = "";
}

function changeSelectedAirline(value) {
  var selected = searchMethod(value);
  if (selectedValueFlight != selected) {
    selectedValueFlight = selected;
    chart.createChart(".chart");
  }
}

function onHover(event) {
  var svg = document.getElementById("svg");
  var box = svg.getBoundingClientRect();

  var pos = Math.ceil((event.offsetX / box.width) * 24);
  console.log("event", pos);
  chart.showDataPoint(pos - 1);
}

function clearDataPoint() {
  var data = document.getElementById("dataPoint");
  var point = document.getElementById("pointCircle");
  if (data) {
    // data.remove();
    // point.remove();
  }
}

var chart = {
  element: "",
  chart: "",
  polygon: "",
  width: 100,
  height: 100,
  maxValue: 0,
  flights: {
    all: [],
    asa: [],
    aay: [],
    aal: [],
    dal: [],
    fft: [],
    hal: [],
    jbu: [],
    swa: [],
    nks: [],
    scx: [],
    ual: [],
    vrd: []
  },
  points: {
    all: "",
    asa: "",
    aay: "",
    aal: "",
    dal: "",
    fft: "",
    hal: "",
    jbu: "",
    swa: "",
    nks: "",
    scx: "",
    ual: "",
    vrd: ""
  },
  linePoints: {
    all: "",
    asa: "",
    aay: "",
    aal: "",
    dal: "",
    fft: "",
    hal: "",
    jbu: "",
    swa: "",
    nks: "",
    scx: "",
    ual: "",
    vrd: ""
  },
  dashArray: {
    all: "",
    asa: "",
    aay: "",
    aal: "",
    dal: "",
    fft: "",
    hal: "",
    jbu: "",
    swa: "",
    nks: "",
    scx: "",
    ual: "",
    vrd: ""
  },
  vSteps: 24,
  measurements: [],
  animate: "",
  date: "1 Jan 2008",
  totalFights: 0,
  currentDataPoint: -100,

  getFlights: function () {
    var flightsData = Array(24).fill(0);
    this.totalFights = 0;
    for (x = 0; x < flights_jan_01_2008.length; x++) {
      var flight = flights_jan_01_2008[x];
      if (
        flight &&
        flight.airline &&
        flight.time &&
        (selectedValueFlight == "all" ||
          flight.airline == selectedValueFlight) &&
        /([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]/.test(flight.time)
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
  /**
   * Create Chart
   *  - calc the max value
   *  - calc the points for the polygon
   *  - create a chart <svg>
   *  - set width, height, and viewbox attributes on <svg>
   *  - create a <polygon>
   *  - set points on <polygon>
   *  - calc the vertical measurements
   */
  createChart: function (element) {
    console.log(selectedValueFlight);
    this.getElement(element);
    if (
      !this.points[selectedValueFlight] ||
      this.points[selectedValueFlight] == ""
    ) {
      this.flights[selectedValueFlight] = this.getFlights();
      this.calcMaxValue();
      this.calcPoints();
    } else {
      this.calcMaxValue();
    }
    if (!this.measurements || this.measurements < 1) {
      this.calcMeasure();
    }

    this.element.innerHTML = "";

    this.chart = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.chart.setAttribute("id", "svg");
    this.chart.setAttribute("onmousemove", "onHover(event)");
    this.chart.setAttribute("onmouseout", "clearDataPoint()");
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
    this.polygon.setAttribute("points", this.points[selectedValueFlight]);
    this.polygon.setAttribute("class", "line");

    var line = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polyline"
    );
    line.setAttribute("points", this.linePoints[selectedValueFlight]);

    if (this.flights[selectedValueFlight].length > 1) {
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
        selectedValueFlight == "all"
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
    if (this.flights[selectedValueFlight].length > 1) {
      this.dataPoints = [];
      dataPointsSvg = [];
      var polygonPoints = "0," + chart.height + " ";

      var linePoints = "";

      var dashArray = "6,6";

      polygonPoints +=
        "0," +
        (
          this.height -
          this.height * (this.flights[selectedValueFlight][0] / this.maxValue)
        ).toFixed(2) +
        " ";

      for (x = 0; x < 24; x++) {
        var delta = this.width / 24;
        console.log("delta", delta);

        var perc = this.flights[selectedValueFlight][x] / this.maxValue;

        var point =
          ((x + 0.5) * delta).toFixed(2) +
          "," +
          (this.height - this.height * perc).toFixed(2) +
          " ";

        if (x < 23) {
          var dashHeight =
            perc - this.flights[selectedValueFlight][x + 1] / this.maxValue;
          var dash =
            Math.sqrt(
              Math.pow(delta, 2) + Math.pow(dashHeight * this.height, 2)
            ) * 5;
          console.log("dash", dash.toFixed(2));
          dashArray += "," + dash.toFixed(2) + ",6,6,6";
        }
        polygonPoints += point;
        linePoints += point;
      }
      polygonPoints +=
        "100," +
        (
          this.height -
          this.height * (this.flights[selectedValueFlight][23] / this.maxValue)
        ).toFixed(2) +
        " ";
      polygonPoints += "100," + this.height;
      this.points[selectedValueFlight] = polygonPoints;
      this.linePoints[selectedValueFlight] = linePoints;
      this.dashArray[selectedValueFlight] = dashArray;
    }
  },
  calcMaxValue: function () {
    this.maxValue = 0;
    for (x = 0; x < this.flights[selectedValueFlight].length; x++) {
      if (this.flights[selectedValueFlight][x] > this.maxValue) {
        this.maxValue = this.flights[selectedValueFlight][x];
      }
    }
    if (this.maxValue < 100) {
      this.maxValue += 20;
    } else {
      this.maxValue += 50;
    }
  },
  showDataPoint: function (measure) {
    var data = document.getElementById("dataPoint");
    var point = document.getElementById("pointCircle");
    if (!data || measure != this.currentDataPoint) {
      if (!data) {
        var data = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        data.setAttribute("id", "dataPoint");
        data.setAttribute("class", "textClass");
        this.chart.appendChild(data);

        point = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        point.setAttribute("id", "pointCircle");
        point.setAttribute("class", "circleClass");
        point.setAttribute("r", "0.5");
        this.chart.appendChild(point);
      }
      var delta = this.width / 24;
      var perc = this.flights[selectedValueFlight][measure] / this.maxValue;
      data.innerHTML = this.flights[selectedValueFlight][measure];
      data.setAttribute("x", ((measure + 0.5) * delta).toFixed(2) - 1);
      data.setAttribute("y", (this.height - this.height * perc).toFixed(2) - 3);
      point.setAttribute("cx", ((measure + 0.5) * delta).toFixed(2));
      point.setAttribute("cy", (this.height - this.height * perc).toFixed(2));

      this.currentDataPoint = measure;
    }
  }
};

chart.createChart(".chart");
