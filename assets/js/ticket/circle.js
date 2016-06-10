function drawPie(id, dataset) {
    // コンテナ
    var width = 300,
        height = 200,
        radius = Math.min(width, height)/2;
    var svg = d3.select(id)
            .attr({
                width : width,
                height : height
            })
            .append("g")
            .attr("transform",  "translate(" + width / 2 + "," + height / 2 + ")");

    // パイを定義
    var pie = d3.layout.pie()
            .sort(null)
            .value(function(d) { return d.rate; });

    // 円弧の外径と内径を定義
    var arc = d3.svg.arc()
            .outerRadius(radius - 10)
            .innerRadius(5);

    // データバインド
    var g = svg.selectAll("path")
            .data(pie(dataset))
            .enter()
            .append("g")
            .attr("class", "arc");

    // 描画
    g.append("path")
        .attr("d", arc); // 円弧を設定

    // テキスト
    g.append("text")
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("font-size", "8")
        .style("text-anchor", "middle")
        .style("fill", "#fff")
        .text(function(d) { return d.data.age; });

    // スタイル
    var colorArr = ['#E74C3C',
                    '#3498DB',
                    '#2ECC71',
                    '#9B59B6',
                    '#34495e',
                    '#449248',
                    '#652681'];
    g.attr("stroke", "white")    // 円グラフの区切り線を白色にする
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
}
