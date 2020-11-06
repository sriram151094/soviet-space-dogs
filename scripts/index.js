const margin = { top: 100, right: 100, bottom: 100, left: 100 };
const width = 1600;
const height = 1600;
const speed = 3

var fullData;
var svg;
var xScale;
var yScale;

var dogPaw;
var defs;

var statusColor = new Map()

statusColor.set(1, ['#85bf76', '#28a74591'])
statusColor.set(2, ['#ba593d', '#a728288c'])
statusColor.set(3, ['#ffdd00', '#00000054'])
// yellow - #ffdd00, #00000054
// red - #ba593d, #a728288c
loadData();

// On load of the page import the wrangled data.json file
function loadData() {
    d3.csv("data/data.csv").then(data => {
        fullData = data;

        console.log(data)

        svg = d3.select('#main')
        svg.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', width)
            .attr('height', height);

        const g = svg.append('g').attr('transform', `translate(${width / 2}, ${height / 2})`)
        setInterval(() => {
            starGenerator(g);
        }, 5);

        svg.append('g')
            .attr('id', 'earth')

        defs = svg.append('svg:defs')

        d3.xml("../images/earth.svg").then(document => {
            var svgNode = document
                .getElementsByTagName("svg")[0];

            let earthBg = svg.select("#earth")
            earthBg.node().appendChild(svgNode);
            earthBg.attr('opacity', 0.8)
                .attr('transform', `translate(${width / 2 - 150 + margin.left}, ${height / 2 - 150})`)

        })

        d3.xml("../images/dog-paw.svg").then(res => {

            dogPaw = res
            defs.append('pattern')
                .attr('id', 'maple-pattern')
                .attr('patternUnits', 'objectBoundingBox')
                .attr('width', 10)
                .attr('height', 10)
                // Append svg to pattern
                .append('svg')
                .attr('x', 10)
                .attr('y', 10)
                .attr('width', 30)
                .attr('height', 30)
                .append(() => res.getElementsByTagName("svg")[0])
        })



        drawVisualisation()



    })
}

function drawVisualisation() {
    // xScale = d3.scaleLinear()
    //     .domain()
    //     .range([0, width])

    yScale = d3.scaleLinear()
        .domain([0, 500])
        .range([0, height])

    outerRadius = Math.min(width, height) / 2 - 100;

    var x = d3.scaleBand()
        .range([0, 2 * Math.PI])
        .align(0)
        .domain(fullData.map(d => d.Id));


    var y = d3.scaleRadial()
        .range([100, outerRadius])
        .domain([0, 600]);


    console.log(x.bandwidth())
    svg.append("g")
        .selectAll("path")
        .data(fullData)
        .enter()
        .append("path")
        .attr('opacity', 0.2)
        .attr("fill", d => statusColor.get(+d.Status)[0]) //d => statusColor.get(+d.Status)[0]
        .attr('transform', 'translate(' + (width / 2 + + margin.left) + ',' + height / 2 + ')')
        .attr("d", d3.arc()
            .innerRadius(100)
            .outerRadius(function (d) { return y(d.Altitude); })
            .startAngle(function (d) { return x(d.Id); })
            .endAngle(function (d) { return x(d.Id) + x.bandwidth(); })
            .padAngle(0.01)
            .padRadius(500))

    svg.append("g")
        .attr('transform', 'translate(' + (width / 2 + margin.left) + ',' + height / 2 + ')')
        .selectAll("g")
        .data(fullData)
        .enter()
        .append("g")
        .attr("text-anchor", function (d) { return (x(d.Id) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
        .attr("transform", function (d) {
            return "rotate(" + ((x(d.Id) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")" + "translate(" + (y(d.Altitude) + 10) + ",0)"
                + "rotate(" + -((x(d.Id) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")";
        })
        .call(g =>
            g.append('g')
                .call(g => g.append('circle')
                    .attr('cx', 0)
                    .attr('cy', 0)
                    .attr('r', 20)
                    .attr('fill', d => statusColor.get(+d.Status)[0])
                    .attr('stroke-width', 10)
                    .style('stroke', d => statusColor.get(+d.Status)[1])
                )
                .call(g => g.append('g')
                    .append('path')
                    .attr("d", d3.symbol().size(2500).type(d3.symbolSquare))
                    //.attr('transform', 'translate(' + yScale(300) + ',' + yScale(200) + ')')
                    .style('fill', function (d) {
                        return `url(${location}#maple-pattern)`
                    })
                )
        )


    svg.append("g")
        .attr('transform', 'translate(' + (width / 2 + + margin.left) + ',' + height / 2 + ')')
        .selectAll("g")
        .data(fullData)
        .enter()
        .append("g")
        .attr("text-anchor", function (d) { return (x(d.Id) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
        .attr("transform", function (d) {
            return "rotate(" + ((x(d.Id) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")" + "translate(" + (y(d.Altitude) + 50) + ",0)"
        })
        .append("text")
        .text(function (d) { return (d.Dogs) })
        //.call(wrap, 200)
        .attr("transform", function (d) { return (x(d.Id) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
        .style("font-size", "15px")
        .style("fill", "white")
        .attr("alignment-baseline", "middle")
        .attr("class", "badge badge-pill badge-primary")


    svg.append("g")
        .attr('transform', 'translate(' + (width / 2 + + margin.left) + ',' + height / 2 + ')')
        .selectAll("g")
        .data(fullData)
        .enter()
        .append("g")
        .attr("text-anchor", function (d) { return (x(d.Id) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
        .attr("transform", function (d) {
            return "rotate(" + ((x(d.Id) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")" + "translate(" + (110) + ",0)"
        })
        .append("text")
        .text(function (d) { return (d.Date) })
        //.call(wrap, 200)
        .attr("transform", function (d) { return (x(d.Id) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
        .style("font-size", "14px")
        .style("font-family", "monospace")
        .style("font-weight", 700)
        .style("font-style", "italic")
        .style("fill", "#9e9e9e")
        .attr("alignment-baseline", "middle")





    // svg.append('g')
    //     .call(g => g.append('circle')
    //         .attr('cx', yScale(300))
    //         .attr('cy', yScale(200))
    //         .attr('r', 40)
    //         .attr('fill', '#85bf76')
    //         .attr('stroke-width', 10)
    //         .style('stroke', '#28a74591')
    //     )
    //     .call(g => g.append('g')
    //         .append('path')
    //         .attr("d", d3.symbol().size(2500).type(d3.symbolSquare))
    //         .attr('transform', 'translate(' + yScale(300) + ',' + yScale(200) + ')')
    //         .style('fill', function (d) {
    //             return `url(${location}#maple-pattern)`
    //         }))


}

function wrap(text, width) {
    text.each(function () {
        let text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 1.1,
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y);
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
}

function starGenerator(g) {
    const size = Math.random() * 0.5 + 0.5;
    const starSpeed = Math.random() * 0.7 + 0.3;
    const angle = Math.random() * 2 * Math.PI;
    const origin = d3.pointRadial(angle, Math.random() * 400);
    const destination = d3.pointRadial(angle, 700);

    g.append('circle')
        .attr('fill', 'white')
        .attr('r', 0)
        .attr('cx', origin[0])
        .attr('cy', origin[1])
        .transition()
        .duration(10000 / speed * starSpeed)
        .ease(d3.easeCubicIn)
        .attr('r', size * 8)
        .attr('cx', destination[0])
        .attr('cy', destination[1])
        .on('end', function () { d3.select(this).remove() });
}