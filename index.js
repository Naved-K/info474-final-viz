'use strict';

(function() {

    let data = ""
    let svg = ""

    const measurements = {
        margin: 50,
        width: 500,
        height: 500
    }



    window.onload = function() {
        svg = d3.select("body").append("svg")
            .attr("width", 700)
            .attr("height", 700);

        d3.csv("data/listings2.csv", function (data){
            makeHistogram(data)
        })
    }

    function makeHistogram(data) {
        let price = data.map((row) => row["monthly_price"]);
        price = price.filter(Boolean);
        for (var i = 0; i < price.length; i++) {
          var number = Number(price[i].replace(/[^0-9\.]+/g,""));
          price[i] = number;
        }
        
        let maxprice = d3.max(price);
        console.log(maxprice);
        let minprice = d3.min(price);
        console.log(minprice);
        var x = d3.scaleLinear()
                .domain([0, maxprice])
                .range([50, 500]);
            svg.append("g")
                .attr("transform", "translate(0," + 500 + ")")
                .call(d3.axisBottom(x));


        var histogram = d3.histogram()
                        .value(function(price) { return price; })
                        .domain(x.domain())
                        .thresholds(x.ticks(40));

        var bins = histogram(price);

        var y = d3.scaleLinear()
                .domain([d3.max(bins, function(d) { return d.length; }), 0])
                .range([0,450]);
            svg.append("g")
                .call(d3.axisLeft(y));

        drawAxes(x,y);

        svg.selectAll("rect")
            .data(bins)
            .enter()
            .append("rect")
            .attr("x", 1)
            .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
            .attr("width", function(d) { return x(d.x1) - x(d.x0); })
            .attr("height", function(d) { return measurements.height - y(d.length); })
            .style("fill", "steelblue")
        }

    function drawAxes(scaleX, scaleY) {
        let xAxis = d3.axisBottom()
            .scale(scaleX)

        let yAxis = d3.axisLeft()
            .scale(scaleY)

        svg.append('g')
            .attr('transform', 'translate(50,50)')
            .call(yAxis)


        }
})()
