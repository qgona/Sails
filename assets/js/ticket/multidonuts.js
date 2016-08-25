//円グラフ描画
function MultiDonuts(data) {
    var radius = 150;   //円の直径
    var padding = 15;   //隙間

    //塗り分け色
    var color = d3.scale.category20c();

    //円のサイズ
    var arc = d3.svg.arc()
    .outerRadius(radius)
    .innerRadius(radius - 75);

    //円弧の定義
    var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) {
        return d.value;
    });

    var legend = d3.select("#graph").append("svg")
    .attr("class", "legend")
    .attr("width", radius)
    .attr("height", radius * 2)
    .style("padding-top", 15)
    .selectAll("g")
    .data(data[0].values)
    .enter().append("g")
    .attr("transform", function(d, i) {
        return "translate(0," + i * 20 + ")";
    });

    //凡例■
    legend.append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function(d, i) {
        return color(i);
    });

    //凡例ラベル
    legend.append("text")
    .attr("x", 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .text(function(d) {
        return d.name;
    });

    var svg = d3.select("#graph").selectAll(".pie")
    .data(data)
    .enter().append("svg")
    .attr("class", "pie")
    .attr("width", radius * 2)
    .attr("height", radius * 2)
    .append("g")
    .attr("transform", "translate(" + radius + "," + radius + ")");

    svg.selectAll(".arc")
    .data(function(d) {
        return pie(d.values);
    })
    .enter().append("path")
    .attr("class", "arc")
    .attr("d", arc)
    .style("fill", function(d, i) {
        return color(i);
    });

    svg.append("text")
    .attr("dy", ".35em")
    .style("text-anchor", "middle")
    .text(function(d) {
        return d.title;
    });

    svg.append("text")
    .attr("dy", "1.5em")
    .style("text-anchor", "middle")
    .text(function(d) {
        return Math.ceil(d.total);
    });
}