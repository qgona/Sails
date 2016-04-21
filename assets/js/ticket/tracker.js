var width = 960,
    height = 500,
    radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
    .range(["#E60012", "#F39800", "#FFF100", "#8FC31F", "#009944", "#009E96", "#00A0E9"
            , "#0068B7", "#1D2088", "#920783", "#E4007F", "#E5004F"]);

// 円弧の外径と内径を定義
var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

// パイを定義
var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.total; });

// svgの定義
var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// データを読み込む
d3.json("/tracker", function(error, data) {
    // データをフォーマット
    data.forEach(function(d) {
        d.total = +d.total;
    });
     // パイにデータを割り当て、パイを作成
    var g = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");
     // 円弧を指定
    g.append("path")
            .attr("d", arc)
            .style("fill", function(d) { return color(d.data.total); });
     // 年齢をパイに表示
    g.append("text")
            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .attr("font-weight", "bold")
            .style("text-anchor", "middle")
            .text(function(d) { return d.data._id; });
 });
