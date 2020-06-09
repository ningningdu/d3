var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty"
var chosenYAxis = "healthcare"
// console.log(chosenAxes)


// function used for updating x-scale var upon click on axis label
function xScale(healthData, chosenXAxis) {
  // create scales
  // console.log(chosenAxes)
  // var chosenXAxis = chosenAxes[0]
  // console.log(chosenAxes)
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
      d3.max(healthData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}


// function used for updating y-scale var upon click on axis label
function yScale(healthData, chosenYAxis) {
  // create scales
  // console.log(chosenYAxis)

  // var chosenYAxis= chosenAxes[1]
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.8,
      d3.max(healthData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;

}
// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  // var leftAxis = d3.axisLeft(newYscale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  
  // yAxis.transition()
  //   .duration(1000)
  //   .call(leftAxis);

  return xAxis;
}
function renderYAxes(newYScale, yAxis) {
  // var bottomAxis = d3.axisBottom(newXScale);
  var leftAxis = d3.axisLeft(newYScale);

  // xAxis.transition()
  //   .duration(1000)
  //   .call(bottomAxis);
  
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}


// function used for updating circles group with a transition to
// new circles
// circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
  // console.log(chosenXAxis)
  // console.log(chosenYAxis)
  // console.log(newXScale)
  // console.log(newYScale)
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d=> newYScale(d[chosenYAxis]));

  return circlesGroup;
}

function renderText(textGroup, newXScale,newYScale,chosenXAxis,chosenYAxis){
  // console.log(chosenXAxis)
  // console.log(chosenYAxis)
  // console.log(newXScale)
  // console.log(newYScale)
  textGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y", d => newYScale(d[chosenYAxis]))
  return textGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(circlesGroup) {

  // var label;

  // if (chosenXAxis === "hair_length") {
  //   label = "Hair Length:";
  // }
  // else {
  //   label = "# of Albums:";
  // }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>Poverty(%):${d.poverty}%<br>Obesity(%):${d.obesity}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
(async function(){
  var healthData = await d3.csv("assets/data/data.csv").catch(err => console.log(err))
  // console.log(healthData)
  // console.log(chosenAxes)
  // console.log(chosenAxes[0])
  // console.log(typeof(chosenAxes[0]))
  // var a = "hello"
  // console.log(a)

  // parse data
  healthData.forEach(function(data) {
    // data.income = +data.income;
    data.healthcare = +data.healthcare;
    data.poverty = +data.poverty;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
  });
  
  // var chosenXAxis=chosenAxes[0];
  // var chosenYAxis=chosenAxes[1];
  // console.log(chosenXAxis)
  // console.log(chosenYAxis)
  // console.log(healthData.chosenXAxis)

  // chosenXAxis = "poverty"
  // chosenYAxis = "healthcare"
  // xLinearScale function above csv import
  var xLinearScale = xScale(healthData, chosenXAxis);
  

  // Create y scale function
  // var yLinearScale = d3.scaleLinear()
  //   .domain([0, d3.max(hairData, d => d.num_hits)])
  //   .range([height, 0]);
  var yLinearScale = yScale(healthData, chosenYAxis)
  // console.log(yLinearScale)

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axix",true)
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 15)
    .attr("fill", "skyblue")
    .attr("opacity", ".5");

      // append circle text
  var textGroup = chartGroup.selectAll("text")
    .data(healthData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .attr("transform", "translate(-7.5,5)")
    .attr("class", "CircleText")
    .attr("fill", "black")
    .attr("font-size", "12px")
    .text(d =>d.abbr);

  // Create group for two x-axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In poverty(%)");

  var smokesLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes");

    // append y axis
      // Create group for two x-axis labels
  var ylabelsGroup = chartGroup.append("g")
    .attr("transform",`translate(0, ${height/2}) rotate(-90)`)

    // .attr("y", height/2)
    // .attr("x", 0)
    // .attr("transform", `translate(0, ${height/2})`)
    // .attr("transform",`translate(0, ${height/2}) rotate(-90)`);

  // .attr("transform", `translate(${width / 2}, ${height + 20})`);
  var healthcareLabel = ylabelsGroup.append("text")
    // .attr("dy", "1em")
    .attr("value","healthcare")
    .classed("active", true)
    // .attr("transform",`translate(0, ${height/2}) rotate(-90)`)
    .attr("y", -40)
    .attr("x", 0)
    .text("Lack of healthcare(%)");

  var obesityLabel = ylabelsGroup.append("text")
    // .attr("transform", "rotate(-90)")
    // // .attr("y", 0 - margin.left)
    // // .attr("x", 0 - (height / 2))
    // .attr("dy", "1em")
    .attr("value","obesity")
    .classed("inactive", true)
    .attr("y", -60)
    .attr("x", 0)
    // .attr("transform",`translate(0, ${height/2}) rotate(-90)`)
    .text("Obesity(%)");

 
  // initialize tooltip
  circlesGroup = updateToolTip(circlesGroup);

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;
        if (chosenXAxis === "poverty") {
          chosenYAxis = "healthcare";
        }
        else {
          chosenYAxis= "obesity";
        }

        // console.log(chosenXAxis)
        // console.log(chosenYAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(healthData, chosenXAxis);
        yLinearScale = yScale(healthData, chosenYAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);
        yAxis = renderYAxes(yLinearScale, yAxis);
        // yAxis = renderAxes

        // updates circles and text
        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
        textGroup = renderText(textGroup, xLinearScale,yLinearScale,chosenXAxis,chosenYAxis);


        // updates tooltips with new circles
        circlesGroup = updateToolTip(circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);          
        }
        else {
          povertyLabel
          .classed("active", false)
          .classed("inactive", true);
          healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });

})()
