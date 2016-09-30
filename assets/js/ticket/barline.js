function DrawBarLine(data) {
  $id = 'graph';

  //仮データ
  var data = [
  {name:"a", Y1: 1000, Y2: 1500, X: '2014-01-01' },
  {name:"b", Y1: 9000, Y2: 180, X: '2014-01-02' },
  {name:"c", Y1: 5000, Y2: 900, X: '2014-01-03' },
  {name:"a", Y1: 7000, Y2: 430, X: '2014-01-04' },
  {name:"a", Y1: 5000, Y2: 600, X: '2014-01-05' },
  {name:"a", Y1: 3000, Y2: 880, X: '2014-01-06' },
  {name:"a", Y1: 6000, Y2: 1100, X: '2014-01-07' },
  {name:"a", Y1: 8000, Y2: 1600, X: '2014-01-08' },
  {name:"a", Y1: 10000, Y2: 23, X: '2014-01-09' },
  {name:"a", Y1: 8000, Y2: 730, X: '2014-01-10' },
  {name:"a", Y1: 10000, Y2: 130, X: '2014-01-11' },
  {name:"a", Y1: 1300, Y2: 1200, X: '2014-01-12' },
  ];

  var margin = { top : 40, right: 40, bottom : 40, left : 40 };
  var stgW = 1400 - margin.left - margin.right;
  var stgH = 920 - margin.top - margin.bottom;
  var barPd = 1;
  var parseDate = d3.time.format("%Y-%m-%d").parse;

    data.forEach(function(d) {
      d.X  =  parseDate(d.X);
      d.Y1 = parseInt(d.Y1);
      d.Y2 = parseInt(d.Y2);
    });

    var dateExtent = d3.extent(data.map(F('X')));

    var svg = d3.select('#' + $id)
    .append('svg')
    .attr({
      width: stgW + margin.left + margin.right,
      height: stgH + margin.top + margin.bottom,
    });
    var scaleX = d3.time.scale()
    .domain(dateExtent)
    .range([0, stgW]);

    var scaleY = d3.scale.linear()
    .domain([0, d3.max(data, function(d){ return d.Y1 })])
    .range([stgH, 0]);


//装飾用変数
gradient = svg.append("svg:defs")
.append("svg:linearGradient")
.attr("id", "gradient")
.attr("x1", "0%")
.attr("y1", "0%")
.attr("x2", "0%")
.attr("y2", "100%");

gradient.append("svg:stop")
.attr("offset", "0%")
.attr("stop-color", "#c5dd32")
.attr("stop-opacity", 1);

gradient.append("svg:stop")
.attr("offset", "100%")
.attr("stop-color", "#738316")
.attr("stop-opacity", 1);

shadow = svg.append("defs").append("filter")
.attr("id","dropshadow")
.attr("width", "130%")
.attr("height", "130%");

shadow.append("feOffset")
.attr("dx", 6)
.attr("dy", 6)
.attr("result", "offset");

shadow.append("feColorMatrix")
.attr("in", "offset")
.attr("result", "matrix")
.attr("type", "matrix")
.attr("values", "0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.2 0 0 0 0 0 1 0");

shadow.append("feGaussianBlur")
.attr("in", "matrix")
.attr("result", "blur")
.attr("stdDeviation", 2);

shadow.append("feBlend")
.attr("in", "SourceGraphic")
.attr("in2", "blur")
.attr("mode", "normal");

//X軸とY軸の目盛を描写
var yAxisCall = d3.svg.axis()
.scale(scaleY)
.orient('left')
.ticks(8)
.innerTickSize(-stgW)
.outerTickSize(0)
.tickPadding(4);

var xAxisCall = d3.svg.axis()
.scale(scaleX)
.orient('bottom')
.tickFormat(d3.time.format("%Y/%m/%d"))
.ticks(4)
.innerTickSize(-stgH)
.outerTickSize(0)
.tickPadding(10);

var yAxis = svg.append('g')
.attr({
  "class": "y1 axis",
  "transform": "translate(" + [margin.left, margin.top] + ")"
})
.call(yAxisCall);

var xAxis = svg.append('g')
.attr({
  "class": "x axis",
  "transform": "translate(" + [margin.left, stgH + margin.top] + ")",
})
.call(xAxisCall);

//折れ線グラフの描写
  var scaleY2 = d3.scale.linear()
  .domain([0, d3.max(data, function(d){ return d.Y2 })])
  .range([stgH, 0]);


  //ライン描画関数を作成
  var valueLine1  = d3.svg.line()
  .x(function(d){ return scaleX(d.X)})
  .y(function(d){ return stgH})
  .interpolate('linear');


  var valueLine2 = d3.svg.line()
  .x(function(d){ return scaleX(d.X)})
  .y(function(d){ return scaleY2(d.Y2)　})
  .interpolate('linear');

//Y2軸の目盛りを描画

var y2AxisCall = d3.svg.axis()
.scale(scaleY2)
.orient('right')
.ticks(4)
.innerTickSize(-stgW)
.outerTickSize(0)
.tickPadding(4);

var y2Axis = svg.append('g')
.attr({
  "class": "y2 axis",
  "transform": "translate(" + [stgW + margin.left, margin.top] + ")"
})
.call(y2AxisCall);

//棒グラフの描写
var barchart = svg.selectAll('rect')
.data(data)
.enter()
.append('rect')
.attr({
  x: function(d, i){ return i * (stgW / data.length)},
  y: function(d){ return stgH + margin.top},
  width: function(d){ return (stgW / data.length - barPd)},
  height: 0,
  "transform": "translate(" + [margin.left, 0] + ")",
});

  //棒グラフのアニメーション
  barchart
  .transition()
  .delay(function(d,i){
    return i * 100
  })
  .duration(1000)
  .ease('bounce')
  .style("filter", "url(#dropshadow)")
  .attr({
    fill : "url(#gradient)",
    y: function(d){ return scaleY(d.Y1)},
    height: function(d){ return stgH - scaleY(d.Y1)},
    "transform": "translate(" + [margin.left, margin.top] + ")",
  });

  //折れ線グラフを描画
  svg.append("path")
  .attr({
    "d": valueLine1(data),
    'class' : 'linechart',
    fill: "none",
    "stroke-width": 1,
    "transform": "translate(" + [margin.left, margin.top] + ")",
  });

  //折れ線チャートのアニメーション
  svg.selectAll(".linechart")
  .transition()
  .duration(1000)
  .ease('bounce')
  .style("filter", "url(#dropshadow)")
  .attr({
    "d": valueLine2(data),
    "stroke-width": 6,
  });

  //目盛り種別を記載する
  var text = '';
  text_Y1 = 'Y1軸データ';
  text_Y2 = 'Y2軸データ';
  text_X = 'X軸データ';

  var circles = svg.selectAll('circle').data(data);

  circles.enter()
  .append('circle')
  .attr({
    'cx' : valueLine2.x(),
    'cy' : stgH,
    'r'  : 0,
    "transform": "translate(" + [margin.left, margin.top] + ")",
  });

  circles
  .transition()
  .duration(1000)
  .style("filter", "url(#dropshadow)")
  .attr({
    'cy' : valueLine2.y(),
    'r'  : 4,
  });

  d3.select('#id_' + $id).select(".y1.axis")
  .append("text")
  .text(text_Y1)
  .attr({
    'fill' : 'none',
    'class' : 'labelY1',
    'x' : -32,
    'y' : -14});

  d3.select('#id_' + $id).select(".y2.axis")
  .append("text")
  .text(text_Y2)
  .attr({
    'fill' : 'none',
    'class' : 'labelY2',
    'x' : 0,
    'y' : -14});

  var tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden")
  .text("a simple tooltip");

  circles
  .on("mouseover", function(){
    return tooltip.style("visibility", "visible");
  })
  .on("mousemove", function(d){
    return tooltip
    .style("top", (d3.event.pageY - 10) + "px")
    .style("left",(d3.event.pageX + 10) + "px")
    .html("<dl><dt>" + text_X + "</dt><dd>" + d3.time.format("%Y-%m-%d")(d.X) + "</dd><dt>" + text_Y1 + "</dt><dd>" + d.Y1 + "</dd><dt>" + text_Y2 + "</dt><dd>" + d.Y2 + "</dd></dl>");
  })
  .on("mouseout", function(){
    return tooltip.style("visibility", "hidden");
  });

  barchart
  .on("mouseover", function(){
    return tooltip.style("visibility", "visible");
  })
  .on("mousemove", function(d){
    return tooltip
    .style("top", (d3.event.pageY - 10) + "px")
    .style("left",(d3.event.pageX + 10) + "px")
    .html("<dl><dt>" + text_X + "</dt><dd>" + d3.time.format("%Y-%m-%d")(d.X) + "</dd><dt>" + text_Y1 + "</dt><dd>" + d.Y1 + "</dd><dt>" + text_Y2 + "</dt><dd>" + d.Y2 + "</dd></dl>");
  })
  .on("mouseout", function(){
    return tooltip.style("visibility", "hidden");
  });
}

function F(name){
  var params = Array.prototype.slice.call(arguments, 1);
  return function(d){
    if ( typeof params[0] ==='function') {
      return params[0](d[name]);
    }
    if ( typeof params[0] ==='string') {
      return (new Function( 'return (' + d[name] + params[0] + ')' )());
    }
    if ( typeof name === 'object' ) {
      return name;
    }
    return d[name];
  }
}