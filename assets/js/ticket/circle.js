// 幅（ Width ）と高さ（ height ）
var w = 900;
var h = 600;
var padding = 50;

d3.json("/circle", function(error, dataset) {
  if (error) throw error;

  var colorCategoryScale = d3.scale.category10();

    var color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b"]);
    // スケール関数の生成
    var xScale = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d) { return d.time; })])
    .range([padding, w - padding * 2]);

    var yScale = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d) { return d.count; })])
    .range([h - padding, padding]);

    var rScale = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d) { return d.count; })])
    .range([2, 5]);

    // X 軸の定義
    var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(5);

    // Y 軸の定義
    var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(5);

    // SVG 要素の生成
    var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

    // 円の生成
    svg.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("fill", function(d) {
      return colorCategoryScale(d.ratio);
    })
    .attr("cx", function(d) {
      return xScale(d.time);
    })
    .attr("cy", function(d) {
      return yScale(d.count);
    })
    .attr("r", function(d) {
      return rScale(d.count);
    });

    // ラベルの生成
    svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function(d) {
      return d.testver;
    })
    .attr("x", function(d) {
      return xScale(d.time);
    })
    .attr("y", function(d) {
      return yScale(d.count);
    })
    .attr("font-family", "Meiryo ui")
    .attr("font-size", "13px")
    .attr("fill", "blue");

    // X 軸の生成
    svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis)
    .append("text")
    .attr("y", 20)
    .attr("x",　-100 + w)
    .style("text-anchor", "end")
    .text("時間");

    // Y 軸の生成
    svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis)
    .append("text")
    .attr("y", -10)
    .attr("x",10)
    .style("text-anchor", "end")
    .text("件数");

    var legend = svg.selectAll(".legend")
    .data(color.domain().slice().reverse())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    // 凡例の色を描画
    legend.append("rect")
      .attr("x", 0)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d) {
        return colorCategoryScale(d.ratio);
      });

    // 凡例の説明を描画
    legend.append("text")
    .attr("x", 65)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d.testver; });

  });