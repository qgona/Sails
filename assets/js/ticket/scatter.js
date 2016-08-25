//散布図グラフ
function drawScatterChart(data, xparam, yparam) {

  data.forEach(function(d) {
    d.x = +d[xparam];
    d.y = +d[yparam];
    d.testver = d.testver;
  });

  var margin = {top: 20, right: 15, bottom: 60, left: 60}
  , width = 1400 - margin.left - margin.right
  , height = 800 - margin.top - margin.bottom;

  var x = d3.scale.linear()
  .domain([0, d3.max(data, function(d) { return d.x; })])
  .range([ 0, width ]);

  var y = d3.scale.linear()
  .domain([0, d3.max(data, function(d) { return d.y; })])
  .range([ height, 0 ]);

  var chart = d3.select('#graph').append("svg")
  .attr('width', width + margin.right + margin.left)
  .attr('height', height + margin.top + margin.bottom)
  .attr('class', 'chart')

  var main = chart.append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .attr('width', width)
  .attr('height', height)
  .attr('class', 'main')

  // draw the x axis
  var xAxis = d3.svg.axis()
  .scale(x)
  .orient('bottom');

  var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span style='color:red'>" + d.testver + "</span>";
  })

  main.append('g')
  .attr("transform", "translate(0," + (height - 0) + ")")
  .attr('class', 'axis')
  .call(xAxis);

  // draw the y axis
  var yAxis = d3.svg.axis()
  .scale(y)
  .orient('left');

  main.append('g')
  .attr('transform', 'translate(0,0)')
  .attr('class', 'main axis date')
  .call(yAxis);

  var color = d3.scale.category20();

  var g = main.append("svg:g");
  g.selectAll("scatter-dots")
  .data(data)
  .enter().append("svg:circle")
  .attr("cx", function (d, i) { return x(d.x); } )
  .attr("cy", function (d) { return y(d.y); } )
  .attr("r", 8)
  .style("fill", function (d) { return color(d.testver); })
  .on('mouseover', tip.show)
  .on('mouseout', tip.hide);

  g.call(tip);

  var legend = g.selectAll(".legend")
  .data(data)
  .enter().append("g")
  .attr("class", "legend")
  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
  .attr("x", width - 100)
  .attr("width", 18)
  .attr("height", 18)
  .style("fill", function (d) { return color(d.testver); });

  // draw legend text
  legend.append("text")
  .attr("x", width - 108)
  .attr("y", 9)
  .attr("dy", ".35em")
  .style("text-anchor", "end")
  .text(function(d) {
   return d.testver;
 })
};