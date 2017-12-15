var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 70, left: 100 };

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

d3.csv("scatterData3.csv", function(err, scatterData3) {
  if (err) throw err;

  scatterData3.forEach(function(data) {
    data.Locationabbr = data.Locationabbr;
    data.Locationdesc = data.Locationdesc;
    data.Single = +data.Single;
    data.Drink_Alcohol = +data.Drink_Alcohol;  
    data.Poverty_Level = +data.Poverty_Level;
    data.Employed = +data.Employed;
    data.Bachelors = +data.Bachelors;
    data.Health_Insurance = +data.Health_Insurance;
  });


  // Create scale functions (set the x-ylims)
  var yLinearScale = d3.scaleLinear()
    .range([height, 0]);

  var xLinearScale = d3.scaleLinear()
    .range([0, width]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // These variables store the maximum values in a column in scatterData3.csv
  var xMax;
  var yMax;

  // The default x and y-axis 
  var currentAxisLabelX = "Single";
  var currentAxisLabelY = "Drink_Alcohol";

  xMax = d3.max(scatterData3, function(data) {
      return +data[currentAxisLabelX];
    });

  yMax = d3.max(scatterData3, function(data) {
      return +data[currentAxisLabelY];
    });

  
  // Scale the domain
  // Set the domain of an axis to extend from 0 to the max value of the data
  xLinearScale.domain([0, xMax]);
  yLinearScale.domain([0, yMax]);

  
  // This function identifies the  maximum values in a column in 
  // scatterData3.csv, and assigns them to Max
  function findMax(dataColumn) {
    Max = d3.max(scatterData3, function(data) {return +data[dataColumn];});
  }

  // reset button listener  resets the elements
  d3.select('#reset')
    .on("click", function () {
      console.log("In reset click event");
        d3.selectAll('.scatterO')
          .transition()
          .duration(1800)
          .attr("r", "18")
          .style("fill", "violet")
          .style("stroke", "black")
          .style("opacity", .15);
        d3.selectAll('.circleText')
          .transition()
          .delay(1000)
          .transition()
          .style("stroke", "gray")
          .style("opacity", 1)
          .duration(1800);
    });

  // navigation  put the list on the page
  d3.select('#nav-alt').append('ul')
    .selectAll('li')
    .data(scatterData3)
    .enter().append('li')
    .on('click', function (data, index) {
        highlightLine(data, index);
      })
    .text(function(data, index) { return data.Locationabbr; });


  // highlight line and fade other lines
  function highlightLine(data, index) {
    console.log("index is ", index);
    d3.selectAll('.scatterO')
      .transition()
      .style('opacity', 0.05)
      .attr("r", "18")
      .duration(1000);
    d3.selectAll('.circleText')
      .transition()
      .style('opacity', 0.05)
      .duration(1000);
    d3.selectAll('.sel-' + index)
      .transition()
      .style('opacity', 1)
      .style("stroke", "gray")
      .attr("r", "50")
      .duration(1800);
    } 
  

  // This needs to change as a part of changing the new active axis 
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(data) {
      var Location = data.Locationdesc;
      var currentX = +data[currentAxisLabelX];
      var currentY = +data[currentAxisLabelY];
      return (Location + "<br>" + currentAxisLabelX + ": " + currentX + "<br>" + currentAxisLabelY + ": " + currentY);
    });

  chart.call(toolTip);

  chart.selectAll("circle")
    .data(scatterData3)
    .enter().append("circle")
      .attr("cx", function(data, index) {
        return xLinearScale(data[currentAxisLabelX]);
      })
      .attr("cy", function(data, index) {
        return yLinearScale(data[currentAxisLabelY]);
      })
      .attr("r", "18")
      .style("fill", "violet")
      .style("stroke", "black")
      .style("opacity", .15)
      .attr("class", function(data, index){return "scatterO sel-" + index}) 
      // onmouseover event
      .on("click", function(data){toolTip.show(data);})
      // onmouseout event
      .on("mouseout", function(data){toolTip.hide(data);});

    
    // Add state abbr to circles
    chart.selectAll("text")
      .data(scatterData3)
      .enter()
      .append("text")
      .attr("x", function(data, index) {
            return xLinearScale(data[currentAxisLabelX]);
      })
      .attr("y", function(data, index) {
        return yLinearScale(data[currentAxisLabelY] + -0.6);
      })
      .attr("text-anchor", "middle")
      .attr("class", function(data, index){return "circleText sel-" + index})     
      .text(function(data, index){return data.Locationabbr});

  // Place the x-y axes lines
  chart.append("g")
    .attr("transform", `translate(0, ${height})`)
    .attr("class", "x-axis")
    .call(bottomAxis);

  chart.append("g")
    .attr("class", "y-axis")
    .call(leftAxis);

  // Place the axes labels
  // Append y-axis label
  chart.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 58)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axis-text active yaxis")
    .attr("data-axis-name", "Drink_Alcohol")
    .text("Behavior - Consumes Alcohol");
  
  // Append y-axis inactive label
  chart
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 42)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    // y-axis label is inactive by default
    .attr("class", "axis-text inactive yaxis")
    .attr("data-axis-name", "Employed")
    .text("Behavior - Currently Employed");

    // Append y-axis inactive label
  chart
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 26)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    // y-axis label is inactive by default
    .attr("class", "axis-text inactive yaxis")
    .attr("data-axis-name", "Health_Insurance")
    .text("Behavior - Have Health Insurance");  


  // Append x-axis label
  chart.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 15) + ")")
    .attr("class", "axis-text active xaxis")
    .attr("data-axis-name", "Single")
    .text("Percent Single by State (Incl DC, PR)");

  // Append x-axis inactive label
  chart
    .append("text")
    .attr("transform", "translate(" + width / 2 + " ," + (height + margin.top + 31) + ")")
    // x-axis label is inactive by default
    .attr("class", "axis-text inactive xaxis")
    .attr("data-axis-name", "Poverty_Level")
    .text("Percent Below Poverty Rate by State (Incl DC, PR)");

  // Append x-axis inactive label
  chart
    .append("text")
    .attr("transform", "translate(" + width / 2 + " ," + (height + margin.top + 46) + ")")
    // x-axis label is inactive by default
    .attr("class", "axis-text inactive xaxis")
    .attr("data-axis-name", "Bachelors")
    .text("Percent Bachelor Degrees by State (Incl DC, PR)");


  // Change an axis's status from inactive to active when clicked 
  // (if it was inactive) Change the status of all active axes to 
  // inactive otherwise
  function labelChange(clickedAxis, subAxis) {
    console.log("subaxis: ", subAxis);
    d3.selectAll(".axis-text")
      .filter(".active")
      .filter(subAxis)
      // Make the active label inactive
      .classed("active", false)
      .classed("inactive", true);

    clickedAxis.classed("inactive", false).classed("active", true);
  }


  d3.selectAll(".axis-text").on("click", function() {
    // Assign a variable to current axis
    var clickedSelection = d3.select(this);
    // "true" or "false" based on whether the axis is currently selected
    var isClickedSelectionInactive = clickedSelection.classed("inactive");
    // console.log("this axis is inactive", isClickedSelectionInactive)
    // Grab the data-attribute of the axis and assign it to a variable
    var clickedAxis = clickedSelection.attr("data-axis-name");
    console.log("on click axis: ", clickedAxis);


    // The onclick events below take place only if the axis is inactive
    // Clicking on an already active axis will therefore do nothing
    if (isClickedSelectionInactive) {
      // Assign the clicked axis to the variable currentAxisLabel
      currentAxisLabel = clickedAxis;
      // Call findMax()
      findMax(currentAxisLabel); 
      //console.log("Max: ",Max);  

      if (clickedAxis == 'Single' || clickedAxis == 'Poverty_Level' || clickedAxis == 'Bachelors'){
        // x axis code
        console.log("clickedAxis: ", clickedAxis);
        subAxis = ".xaxis";       
        currentAxisLabelX = clickedAxis;
       
        // Set the new domain for the x-axis (y-axis not changing)
        xLinearScale.domain([0, Max]);
        // Create a transition effect for the x-axis
        chart
          .select(".x-axis")
          .transition()
          // .ease(d3.easeElastic)
          .call(bottomAxis)
          .duration(2000);


        // Select all circles to create a transition effect
        // based on the new axis that was selected/clicked
        chart.selectAll("circle").each(function() {
          d3.select(this)
            .transition()
            // .ease(d3.easeBounce)
            .attr("cx", function(data,index) {
              return xLinearScale(+data[currentAxisLabelX]);
            })
            .attr("r", "18")
            .style("opacity", .15)
            .duration(2000);
        });

        // Make the current circle text fade out
        chart.selectAll(".circleText")
          .transition()
          .style("opacity", 0)
          .duration(1000);
        //   .remove();

        console.log("currentAxisLabelX: ", currentAxisLabelX);
        console.log("currentAxisLabelY: ", currentAxisLabelY); 

        // Add state abbr to circles
        chart.selectAll(".circleText").each(function() {
          d3.select(this)
            .transition()
            .duration(1000)
            .style("opacity", 0)
            .transition()
            .delay(250)
            // .ease(d3.easeBounce)
            .attr("x", function(data, index) {
                return xLinearScale(data[currentAxisLabelX]);
               })
            .style("opacity", 1)
            .transition()
            .duration(3000);
          });     
   

        // Prepare the click or hover text  
        var toolTip = d3.tip()
          .attr("class", "tooltip")
          .offset([80, -60])
          .html(function(data) {
          var Location = data.Locationdesc;
          var currentX = +data[currentAxisLabelX];
          var currentY = +data[currentAxisLabelY];
          return (Location + "<br>" + currentAxisLabelX + ": " + currentX + "<br>" + currentAxisLabelY + ": " + currentY);
          });
      
      } else {  // y axis code
        console.log("clickedAxis: ", clickedAxis);
        subAxis = ".yaxis";
        currentAxisLabelY = clickedAxis;
        // Call findMax()
        findMax(currentAxisLabelY);
        // Set the domain for the y-axis (x-axis not changing)
        //console.log("Max: ",Max);
        yLinearScale.domain([0, Max]);
        // Create a transition effect for the x-axis
        chart
          .select(".y-axis")
          .transition()
          // .ease(d3.easeElastic)
          .duration(1800)
          .call(leftAxis);
 
        // Select all circles to create a transition effect
        // based on the new axis that was selected/clicked
        d3.selectAll("circle").each(function() {
          d3
            .select(this)
            .transition()
            // .ease(d3.easeBounce)
            .attr("cy", function(data,index) {
              return yLinearScale(+data[currentAxisLabelY]);
            })
            .attr("r", "18")
            .style("opacity", .15)
            .duration(2000);
        });

        // fade out the previous text
        chart.selectAll(".circleText")
          .transition()
          .duration(1000)
          .style("opacity", 0);
          //.remove();        


        console.log("currentAxisLabelX ", currentAxisLabelX);
        console.log("currentAxisLabelY: ", currentAxisLabelY); 

        // Add state abbr to circles
        chart.selectAll(".circleText").each(function() {
          d3.select(this)
            .transition()
            .duration(1000)
            .style("opacity", 0)
            .transition()
            .delay(250)
            // .ease(d3.easeBounce)
            .attr("y", function(data, index) {
                return yLinearScale(data[currentAxisLabelY]);
               })
            .style("opacity", 1)
            .transition()
            .duration(3000);
          });         
          

        // Prepare the click or hover text  
        var toolTip = d3.tip()
          .attr("class", "tooltip")
          .offset([80, -60])
          .html(function(data) {
          var Location = data.Locationdesc;
          var currentX = +data[currentAxisLabelX];
          var currentY = +data[currentAxisLabelY];
          return (Location + "<br>" + currentAxisLabelX + ": " + currentX + "<br>" + currentAxisLabelY + ": " + currentY);
          });
      }

      // Change the status of the axes. See above for more info on this function.
      labelChange(clickedSelection, subAxis);
    }
  });
    
});


