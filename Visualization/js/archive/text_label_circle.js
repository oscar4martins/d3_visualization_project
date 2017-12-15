

 // create circle text
    var text = chart
        .selectAll("text")
        .data(stateData)
        .enter()
        .append("text")
    var textLabels = text
        .attr("x", function(data, index) {
            return xLinearScale(+data[currentAxisLabelX])-6;
        })
        .attr("y", function(data, index) {
            return yLinearScale(+data[currentAxisLabelY])+4;
        })
        .text( function (data) {return data.abbr})
        .attr("class","circle-text");