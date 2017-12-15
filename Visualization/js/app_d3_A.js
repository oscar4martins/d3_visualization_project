var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 60, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart = svg.append("g");

// Append a div to the body to create tooltips, assign it a class
d3.select(".chart")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

d3.csv("scatterData1.csv", function(err, scatterData) {
  if (err) throw err;

  scatterData.forEach(function(data) {
    data.Locationabbr = data.Locationabbr;
    data.Locationdesc = data.Locationdesc;
    data.Single = +data.Single;
    data.Drink_Alcohol = +data.Drink_Alcohol;
  });


  // Create scale functions (set the x-ylims)
  var yLinearScale = d3.scaleLinear()
    .range([height, 0]);

  var xLinearScale = d3.scaleLinear()
    .range([0, width]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Scale the domain
  xLinearScale.domain([20, d3.max(scatterData, function(data) {
    return +data.Single;
  })]);
  yLinearScale.domain([0, d3.max(scatterData, function(data) {
    return +data.Drink_Alcohol;
  })]);

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(data) {
      var Locationdesc = data.Locationdesc;
      var Single = +data.Single;
      var Drink_Alcohol = +data.Drink_Alcohol;
      return (Locationdesc + "<br> Pct Single: " + Single + "<br> Pct Drink: " + Drink_Alcohol);
    });

  chart.call(toolTip);

  chart.selectAll("circle")
    .data(scatterData)
    .enter().append("circle")
      .attr("cx", function(data, index) {
        return xLinearScale(data.Single);
      })
      .attr("cy", function(data, index) {
        return yLinearScale(data.Drink_Alcohol);
      })
      .attr("r", "18")
      //.attr("fill", "violet")
      .style("fill", "lightskyblue")
      .style("stroke", "black")
      .style("opacity", .15)
      .attr("class","scatterO")
      // onmouseover event
      .on("click", function(data) {
        toolTip.show(data);
      })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      })
      ;

    chart.selectAll("text")
      .data(scatterData)
      .enter()
      .append("text")
      .attr("x", function(data, index) {
            return xLinearScale(data.Single);
      })
      .attr("y", function(data, index) {
        return yLinearScale(data.Drink_Alcohol + -0.6);
      })
      .attr("text-anchor", "middle")
      .attr("class", "circleText")     
      .text(function(data, index){return data.Locationabbr});

  chart.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chart.append("g")
    .call(leftAxis);

// Append y-axis labels
  chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Behavior - Drinking Alcohol");

// Append x-axis labels
  chart.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 30) + ")")
    .attr("class", "axisText")
    .text("Percent Single by State (Incl DC, Puerto Rico)");
});


