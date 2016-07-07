//円グラフ描画
function drawPieChart(data, h, w, target = "#graph", title = "", add = true) {
    var width = h;
    var height = w;

    if (add) {
        var svg = d3.select(target).append("svg").attr({
            width : width,
            height : height
        })
        .append("g")
        .attr("transform",  "translate(" + width / 2 + "," + height / 2 + ")");
    } else {
        var svg = d3.select(target).attr({
            width : width,
            height : height
        })
        .append("g")
        .attr("transform",  "translate(" + width / 2 + "," + height / 2 + ")");
    }

    // パイを定義
    var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.total; });

    // 円弧の外径と内径を定義
    var radius = Math.min(width, height) / 2;
    var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(5);

    var text = svg.append("text")
    .attr("x", -200)
    .attr("y", -120)
    .text(title);

    // データバインド
    var g = svg.selectAll("path")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc");

    g.append("path")
    .attr("d", arc)
    .attr("data-legend", function(d){return d.data._id}); // 円弧を設定

    var color = d3.scale.category20();
    var colorArr = color.range();

    g.attr("stroke", "white")
    .style({
        fill: function(d, i) {
            return colorArr[i];
        }
    });

    //アニメーション
    svg.selectAll("path")
        .transition()   // トランジション開始
        .duration(1000) // 1秒間でアニメーションさせる
        .attrTween("d", function(d){    // 指定した範囲で値を変化させアニメーションさせる
            var interpolate = d3.interpolate(
                { startAngle : 0, endAngle : 0 },   // 各円グラフの開始角度
                { startAngle : d.startAngle, endAngle : d.endAngle }    // 各円グラフの終了角度
                );
            return function(t){
                return arc(interpolate(t)); // 時間に応じて処理
            };
        });
    // テキスト
    g.append("text")
    .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
    .attr("font-size", "14")
    .style("text-anchor", "middle")
    .style("fill", "#fff")
    .text(function(d) { return d.data._id; });

    var legend = svg.selectAll(".legend")
    .data(color.domain().slice().reverse())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

    legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d; });
}