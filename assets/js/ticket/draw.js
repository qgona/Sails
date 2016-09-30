//折れ線グラフ
function drawStackedChart(data) {

    var margin = { top: 20, right: 120, bottom: 30, left: 40 };
    var width = 1400 - margin.left - margin.right;
    var height = 800 - margin.top - margin.bottom;

    var svg = d3.select('body')
    .insert('svg', 'div')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var xScale = d3.scale.ordinal().rangeRoundBands([0, width], 0.1);
    var yScale = d3.scale.linear().rangeRound([height, 0]);
    // var colorScale = d3.scale.ordinal().range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']);
    var colorScale = d3.scale.category20();

    var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom');

    var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left');

    var rawTotalMax = 0;
    var titleArray = new Array();

    colorScale.domain(
        d3.keys(data[0]).filter(function(key) {
            return key !== 'title';
        })
    );

    data.forEach(function(d) {
        var tmpY = 0;
        d.entries = colorScale.domain().map(function(name) {
            var obj = {
                name: name,
                title: d.title,
                rawY0: tmpY,
                rawY1: tmpY + parseInt(d[name]),
                rawValue: parseInt(d[name]),
                nrmlY0: tmpY,
                nrmlY1: tmpY + parseInt(d[name]),
                nrmlValue: null
            };
            tmpY += parseInt(d[name]);
            return obj;
        });

        d.entries.forEach(function(d) {
            d.nrmlY0 /= tmpY;
            d.nrmlY1 /= tmpY;
            d.nrmlValue = d.nrmlY1 - d.nrmlY0;
        });

        d.rawTotal = tmpY;
        if (d.rawTotal > rawTotalMax) { rawTotalMax = d.rawTotal; }

        titleArray.push(d.title);
    });

    svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')');

    svg.append('g')
    .attr('class', 'y axis')
    .append('text')
    .attr('class', 'y axis text')
    .attr('transform', 'rotate(-90)')
    .attr('y', -40)
    .attr('dy', '.71em')
    .style('text-anchor', 'end');

    titleArray.forEach(function(title) {
        var li = d3.select('#yearCheckUl').append('li');
        li.append('input')
        .attr('type', 'checkbox')
        .attr('id', title)
        .attr('class', 'yearCheck');
        li.append('text')
        .text(title);
    });

    // 凡例
    var legend = svg.selectAll('.legend')
    .data(colorScale.domain().slice().reverse())
    .enter().append('g')
    .attr('class', 'legend')
    .attr('transform', function(d, i) { return 'translate(0,' + i * 20 + ')'; });

    legend.append('rect')
    .attr('x', width + 60)
    .attr('width', 18)
    .attr('height', 18)
    .style('fill', colorScale);

    legend.append('text')
    .attr('x', width + 55)
    .attr('y', 9)
    .attr('dy', '.35em')
    .style('text-anchor', 'end')
    .text(function(d) { return d; });

    // 初期処理
    d3.select('#radioRaw').property('checked', true);
    d3.select('#checkDefault').property('checked', true);
    checkDefault();
    changeYear();

    d3.selectAll('#yearChange')
    .on('click', changeYear);
    d3.selectAll('input[name="graphType"]')
    .on('change', function() { changeGraph(2); });
    d3.select('#checkAll')
    .on('click', checkAll);
    d3.select('#checkDefault')
    .on('click', checkDefault);

    // 表示年変更
    function changeYear() {
        svg.selectAll('.block').remove();
        var checkedYear = new Array();
        d3.selectAll('.yearCheck').each(function() {
            if (d3.select(this).property('checked') === true) {
                checkedYear.push(d3.select(this).attr('id'));
            }
        });

        xScale.domain(checkedYear);
        xAxis(svg.select('.x.axis'));

        var _data = data.filter(function(d) {
            return checkedYear.some(function(c) {
                return d.title === c;
            });
        });

        var blocks = svg.selectAll('.block')
        .data(_data)
        .enter().append('g')
        .attr('class', 'block')
        .attr('transform', function(d) {
            return 'translate(' + xScale(d.title) + ', 0)'; }
        )

        blocks.selectAll('rect')
        .data(function(d) {
            return d.entries;
        })
        .enter().append('rect')
        .attr('width', xScale.rangeBand())
        .style('fill', function(d) {
            return colorScale(d.name);
        });

        // マウスオーバーでデータ表示
        blocks.selectAll('rect')
        .on('mouseover', function(d) {
            var str = d.title + ' ' + d.name + ' ' + d.rawValue + '人 ' + Math.round(d.nrmlValue * 100)  + '%';
            d3.select('#detailDataDiv')
            .append('span')
            .style('color', colorScale(d.name))
            .text(str);
        })
        .on('mouseout', function(d) {
            d3.select('#detailDataDiv').text('');
        });
        changeGraph(1);

        svg.selectAll('.x.axis .tick text')
        .attr('y', function(d, i) {
            if ((i % 2) == 1) {
                return 9;
            } else {
                return 20;
            }
        })
    }

    // 表示グラフタイプ変更
    function changeGraph(transitionType) {
        var newYScaleDomain, newY0, newY1, newYAxisTickFormat, newYAxisText;
        // 絶対数グラフ
        if (d3.select('#radioRaw').property('checked') === true) {
            newYScaleDomain = [0, rawTotalMax];
            newY0 = 'rawY0';
            newY1 = 'rawY1';
            newYAxisTickFormat = '.2s';
            newYAxisText = '件数';
        // 相対数グラフ
        } else {
            newYScaleDomain = [0, 1];
            newY0 = 'nrmlY0';
            newY1 = 'nrmlY1';
            newYAxisTickFormat = '.0%';
            newYAxisText = '割合';
        }

        yScale.domain(newYScaleDomain);
        // transition分岐
        switch (transitionType) {
            case 1:
                svg.selectAll('.block rect')
                .attr('y', function(d) {
                    return yScale(d[newY1]);
                })
                .attr('height', function(d) {
                    return yScale(d[newY0]) - yScale(d[newY1]);
                })
                .style('opacity',0)
                .transition()
                .duration(1000)
                .style('opacity',1);
                break;

            case 2:
                var yearCount = svg.selectAll('.block')[0].length;
                svg.selectAll('.block rect')
                .transition()
                .duration(1000)
                .delay(function(d, i) { return i / 7 / yearCount * 1000; })
                .attr('y', function(d) { return yScale(d[newY1]); })
                .attr('height', function(d) { return yScale(d[newY0]) - yScale(d[newY1]); });
                break;

            default:
                svg.selectAll('.block rect')
                .attr('y', function(d) { return yScale(d[newY1]); })
                .attr('height', function(d) { return yScale(d[newY0]) - yScale(d[newY1]); });
                break;
        }
        yAxis.tickFormat(d3.format(newYAxisTickFormat));
        yAxis(svg.select('.y.axis'));
        svg.select('.y.axis.text')
        .text(newYAxisText);
    }

    // 全チェック／全解除
    function checkAll() {
        var checked = d3.select('#checkAll').property('checked');
        d3.selectAll('.yearCheck').property('checked', checked);
    }

    // 初期年チェック
    function checkDefault() {
        var checked = d3.select('#checkDefault').property('checked');
        if (checked) {
            d3.selectAll('.yearCheck').property('checked', false);
            // 新しい方から30年のみチェックする
            var inputArray = d3.selectAll('.yearCheck');
            var length = inputArray[0].length;
            inputArray.each(function(d, i) {
                if (i > length - 11) {
                    d3.select(this).property('checked', true);
                }
            });
            d3.select('#checkDefault').property('checked', false);
        }
    }
};