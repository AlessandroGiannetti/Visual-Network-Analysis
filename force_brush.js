// ======= Global variable declaration =======
var
    // ScalePack of packets for link dimension
    scalePackets,
    colorScalePackets,
    // NumberSentPackets key: [source]  value : total n° of packets
    NumberSentPackets = {},
    NumberDeliveredPackets = {},
    transferPackets = {},
    //SVG width and height
    width = 950,
    height = 805;
// ======= Fine Global variable declaration=======

// extraction of the dataset from the file
d3.json("miserables.json", function (error, data) {
    if (error) throw error;

    drawDataController("controller1");
    drawDataController("controller2");
    drawDataController("controller3");
    drawDataController("controller4");

    // building the map packet
    buildMapPacket(data);
    // building the scale packet
    scalePacket(NumberDeliveredPackets);
    //drawing the graph network
    drawGraph(data);
    // drawing the cpa plot
    drawCpa(data);
    // drawing the box plot
    drawBoxPlot(data);

    drawLegend();
    // ================ LISTENER ===================
    d3.select("#check1").on("change", updateCheck1);
    function updateCheck1() {
        if (d3.select("#check1").property("checked"))
            d3.select("#svgcontroller1").transition().duration(200).style("display", "block").style("opacity", "1");
        else {
            d3.select("#svgcontroller1").transition().duration(200).style("opacity", "0");
            d3.select("#svgcontroller1").transition().delay(200).style("display", "none");
        }
    }
    d3.select("#check2").on("change", updateCheck2);
    function updateCheck2() {
        if (d3.select("#check2").property("checked"))
            d3.select("#svgcontroller2").transition().duration(200).style("display", "block").style("opacity", "1");
        else {
            d3.select("#svgcontroller2").transition().duration(200).style("opacity", "0");
            d3.select("#svgcontroller2").transition().delay(200).style("display", "none");
        }
    }
    d3.select("#check3").on("change", updateCheck3);
    function updateCheck3() {
        if (d3.select("#check3").property("checked"))
            d3.select("#svgcontroller3").transition().duration(200).style("display", "block").style("opacity", "1");
        else {
            d3.select("#svgcontroller3").transition().duration(200).style("opacity", "0");
            d3.select("#svgcontroller3").transition().delay(200).style("display", "none");
        }
    }
    d3.select("#check4").on("change", updateCheck4);
    function updateCheck4() {
        if (d3.select("#check4").property("checked"))
            d3.select("#svgcontroller4").transition().duration(200).style("display", "block").style("opacity", "1")
            ;
        else {
            d3.select("#svgcontroller4").transition().duration(200).style("opacity", "0");
            d3.select("#svgcontroller4").transition().delay(200).style("display", "none");
        }
    }

    // ================ FINE LISTENER ===================
});

function drawDataController(tag) {
    var margin = {top: 50, right: 30, bottom: 50, left: 30},
        width = 440 - margin.left - margin.right,
        height = 150 - margin.bottom - margin.top;

    // scale function
    var timeScale = d3.scaleTime()
        .domain([new Date(), new Date()])
        .range([0, width])
        .nice(d3.timeDay)
        .clamp(true);

    var formatDate = d3.timeFormat('%H:%M');

    var svg = d3.select("#" + tag).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", "svg" + tag)
        .append("g")
        // classic transform to position g
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("rect")
        .style("pointer-events", "all")
        .style("fill", "none")
        .attr("width", width)
        .attr("height", height)
        .style("cursor", "crosshair")
        .on("mousedown", function () {
            updateStartingPos(this);
        })
        .on("mousemove", function () {
            if (d3.event.which === 1) {
                updateEndingPos(this);
            }
        });

    function updateStartingPos(elem) {
        var xPos = d3.mouse(elem)[0];
        handle2.attr('transform', 'translate(' + xPos + ",0)");
        text2.text(formatDate(timeScale.invert(xPos)));
        handle1.attr('transform', 'translate(' + xPos + ",0)");
        text1.text(formatDate(timeScale.invert(xPos)));
    }

    function updateEndingPos(elem) {
        var xPos = d3.mouse(elem)[0];
        handle1.attr('transform', 'translate(' + xPos + ",0)");
        text1.text(formatDate(timeScale.invert(xPos)));
    }

    svg.append("g")
        .attr("class", "x axis")
        // put in middle of screen
        .attr("transform", "translate(0," + height / 2 + ")")
        // inroduce axis
        .call(d3.axisBottom()
            .scale(timeScale)
            .tickFormat(function (d) {
                return formatDate(d);
            })
            .ticks(12)
            .tickSize(8)
            .tickPadding(12))
        .select(".domain")
        .select(function () {
            return this.parentNode.appendChild(this.cloneNode(true));
        })
        .attr("class", "halo");

    var handle1 = svg.append("g")
        .attr("class", "handle");

    handle1.append("path")
        .attr("transform", "translate(0," + height / 2 + ")")
        .attr("d", "M 0 -20 V 20");

    var text1 = handle1.append('text')
        .text(formatDate(timeScale.domain()[0]))
        .attr("transform", "translate(" + (-18) + " ," + (height / 2 - 25) + ")");

    var handle2 = svg.append("g")
        .attr("class", "handle");

    handle2.append("path")
        .attr("transform", "translate(0," + height / 2 + ")")
        .attr("d", "M 0 -20 V 20");

    var text2 = handle2.append('text')
        .text(formatDate(timeScale.domain()[0]))
        .attr("transform", "translate(" + (-18) + " ," + (height / 2 - 25) + ")");

    handle1.attr('transform', 'translate(0,0)');
    handle2.attr('transform', 'translate(' + width + ",0)");
}
function drawGraph(data) {
    var width = 950,
        height = 805;

    var edges = [];
    var nodes = new Set();

    // create the svg on
    var svg = d3.select("#graph").append("svg")
        .attr("width", width)
        .attr("height", height);

    // declaretion of the force for the simulation
    var simulation = d3.forceSimulation()
        .force("forceX", d3.forceX().strength(0.30))
        .force("forceY", d3.forceY().strength(0.01053))
        .force("charge", d3.forceManyBody().strength(-150).distanceMin(200).distanceMax(800))
        .force('x', d3.forceX(d => (d.group === '1') ? 200 : 930).strength(1))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force("link", d3.forceLink().distance(730).strength(0).id(function (d) {
            return d.id;
        }));

    //declaration of the tooltipLink (extra info on over)
    var tooltipLink = d3.select('body').append('div')
        .style('opacity', 0)
        .attr('class', 'd3-tip');

    var tooltipNode = d3.select('body').append('div')
        .style('opacity', 0)
        .attr('class', 'd3-tip');

    //declaration of the link of the network
    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(data.links)
        .enter().append("line")
        .on('mousemove', function (d) {
            tooltipLink.transition().duration(150)
                .style('opacity', 1);
            tooltipLink.html(contentLinkTip(d))
                .style('left', (d3.event.pageX + 50) + 'px')
                .style('top', (d3.event.pageY) + 'px');
            handleMouseMoveEdge(d);
        })
        .on('mouseout', function () {
            tooltipLink.transition().duration(150).delay(0).delay(20)
                .style('opacity', 0);
            handleMouseOutEdge();
        })
        .attr("stroke-width", function (d) {
            return scalePackets(transferPackets[d.source + d.target]);
        })
        .attr("display", function (d) {
            if (edges.findIndex(x => (x.source == d.source && x.target == d.target)) <= -1) {
                edges.push(d);
                return "block";
            } else {
                return "none";
            }
        });

    // declaration of the node of the network
    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(data.nodes)
        .enter().append("circle")
        .attr("r", 15)
        .style("fill", function (d) {
            if (d.group === "1")
                if (colorScalePackets(NumberSentPackets[d.id]) != null)
                    return colorScalePackets(NumberSentPackets[d.id]);
                else
                    return colorScalePackets(0);
            if (d.group === "2")
                if (colorScalePackets(NumberDeliveredPackets[d.id]) != null)
                    return colorScalePackets(NumberDeliveredPackets[d.id]);
                else
                    return colorScalePackets(0);
        })
        .on("click", function () {
            d3.select(this).transition().duration(200).style("stroke", "red");
            nodes.add(d3.select(this)._groups[0][0].__data__.id);
            handleSelectedNode(nodes);
        })
        .on('dblclick', function () {
            d3.select(this).transition().duration(200).style("stroke", "black");
            nodes.delete(d3.select(this)._groups[0][0].__data__.id);
            handleSelectedNode(nodes);
        })
        .on('mouseover', function (d) {
            handleMouseOverNode(d3.select(this));
            tooltipNode.transition().duration(150)
                .style('opacity', .9);
            tooltipNode.html(contentNodeTip(d))
                .style('left', (d3.event.pageX + 50) + 'px')
                .style('top', (d3.event.pageY) + 'px');
        })
        .on('mouseout', function () {
            tooltipNode.transition().duration(150).delay(0).delay(20)
                .style('opacity', 0);
            handleMouseOutNode();
        });

    //declaration of the text (ip) of the node
    var textElements = svg.append("g")
        .attr("class", "texts")
        .selectAll("text")
        .data(data.nodes)
        .enter().append("text")
        .text(function (node) {
            return node.id.slice(0, -2)
        })
        .attr("font-size", 15)
        .attr("text-anchor", function () {
            if (d3.select(this)._groups[0][0].__data__.group == "1") return "end"; else return "start";
        })
        // riflette gli indirizzi IP a destra e sinistra
        .attr("dx", function () {
            if (d3.select(this)._groups[0][0].__data__.group == "1") return -25; else return 25;
        })
        .attr("dy", 5);

    // starting the simulation
    simulation
        .nodes(data.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(data.links);

    //associate the node with the link and the ip address
    function ticked() {
        link
            .attr("x1", function (d) {
                if (d.source.group == '1') return d.source.x;
            })
            .attr("y1", function (d) {
                if (d.source.group == "1") return d.source.y;
            })
            .attr("x2", function (d) {
                if (d.target.group == "2") return d.target.x;
            })
            .attr("y2", function (d) {
                if (d.target.group == "2") return d.target.y;
            });
        node
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            });
        textElements
            .attr("x", function (d) {
                return d.x;
            })
            .attr("y", function (d) {
                return d.y;
            });
    }
    // content of the windows on link mouse over
    function contentLinkTip(d) {
        var content = "<h5 align='center'>LINK</h5>";
        content += " <table align='center'><tr><td>IP address Attacker:</td> <td>" + d.source.id.slice(0, -2) + "</td></tr>" +
            "<tr><td> IP address Target:</td><td align='left'>" + d.target.id.slice(0, -2) + "</td></tr>" +
            "<tr><th>Tot N° of packets:</th> <td>" + transferPackets[d.source.id + d.target.id] + "</td></tr></table>";
        return content;
    }
    function contentNodeTip(d) {
        var value = 0;
        if (NumberSentPackets[d.id] != null && d.group === "1")
            value = NumberSentPackets[d.id];
        if (NumberDeliveredPackets[d.id] != null && d.group === "2")
            value = NumberDeliveredPackets[d.id];
        var content = "<h5 align='center'>NODE</h5>";
        if (d.group === "1")
            content += " <table align='center'><tr><td>IP address:</td> <td>" + d.id.slice(0, -2) + "</td></tr>" +
                "<tr><td>N° malicious packages sent: </td><td align='left'>" + value + "</td></tr></table>";
        if (d.group === "2")
            content += " <table align='center'><tr><td>IP address:</td> <td>" + d.id.slice(0, -2) + "</td></tr>" +
                "<tr><td>N° malicious packets delivered: </td><td align='left'>" + value + "</td></tr></table>";
        return content;
    }
}
function drawCpa(data) {
    var margin = {top: 30, right: 200, bottom: 10, left: 265},
        width = 1800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scaleBand().rangeRound([0, width + 100]).padding(.1),
        y = {},
        dragging = {};

    var line = d3.line(),
        background,
        foreground;

    var svg = d3.select("#PCA").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var Range = [];

    for (var i = 0; i <= height * 20; i = i + 20) {
        Range.push(i);
    }

    x.domain(dimensions = d3.keys(data.links[0]).filter(function (d) {
        if ((d == "id") || (d == "index") || (d == "Timestamp") || (d == "FlowDuration") || (d == "Protocol") || (d == "TotalBackwardPackets") || (d == "TotalLenghtOfBwdPackets")) {
            return false;
        }
        return y[d] = d3.scaleOrdinal()
            .domain(d3.extent(data.links, function (p) {
                if (d == "source" || d == "target") {
                    return +p[d]["id"];
                }
                return +p[d];
            }))
            .range(Range);
    }));

    // Add grey background lines for context.
    background = svg.append("g")
        .attr("class", "background")
        .selectAll("path")
        .data(data.links)
        .enter().append("path")
        .attr("class", "backpath")
        .attr("d", path);

    // Add blue foreground lines for focus.
    foreground = svg.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(data.links)
        .enter().append("path")
        .attr("class", "forepath")
        .attr("d", path)
        .style("stroke", "#007bff");

    // Add a group element for each dimension.
    var g = svg.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function (d) {
            return "translate(" + x(d) + ")";
        })
        .call(d3.drag()
            .subject(function (d) {
                return {x: x(d)};
            })
            .on("start", function (d) {
                dragging[d] = x(d);
                background.attr("visibility", "hidden");
            })
            .on("drag", function (d) {
                dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                foreground.attr("d", path);
                dimensions.sort(function (a, b) {
                    return position(a) - position(b);
                });
                x.domain(dimensions);
                g.attr("transform", function (d) {
                    return "translate(" + position(d) + ")";
                })
            })
            .on("end", function (d) {
                delete dragging[d];
                transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                transition(foreground).attr("d", path);
                background
                    .attr("d", path)
                    .transition()
                    .delay(500)
                    .duration(0)
                    .attr("visibility", null);
            }));
    // Add an axis and title.
    g.append("g")
        .attr("class", "axis")
        .each(function (d) {
            d3.select(this).call(d3.axisLeft(y[d]));
        })
        //text does not show up because previous line breaks somehow
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function (d) {
            return d;
        });

    function position(d) {
        var v = dragging[d];
        return v == null ? x(d) : v;
    }

    function transition(g) {
        return g.transition().duration(500);
    }

// Returns the path for a given data point.
    function path(d) {
        return line(dimensions.map(function (p) {
            if (p == "source" || p == "target")
                return [position(p), y[p](d[p]["id"].slice(0, -2))];
            return [position(p), y[p](d[p])];
        }));
    }

    svg.append("circle").attr("cx", 1340).attr("cy", 30).attr("r", 9).style("fill", "red");
    svg.append("circle").attr("cx", 1340).attr("cy", 60).attr("r", 9).style("fill", "#007bff");
    svg.append("text").attr("x", 1380).attr("y", 30).text("Selected Node").style("font-size", "15px").attr("alignment-baseline", "middle");
    svg.append("text").attr("x", 1380).attr("y", 60).text("Unselected Node").style("font-size", "15px").attr("alignment-baseline", "middle")

}
function drawBoxPlot(data) {
    //TODO imlementare;
}
function buildMapPacket(data) {
    for (var i = 0; i < data.links.length; i++) {
        if (getAttackPackets(data.links[i].source) == null)
            NumberSentPackets[data.links[i].source] = parseInt(data.links[i].TotalFwdPackets);
        else
            NumberSentPackets[data.links[i].source] += parseInt(data.links[i].TotalFwdPackets);
        if (getTargetPackets(data.links[i].target) == null)
            NumberDeliveredPackets[data.links[i].target] = parseInt(data.links[i].TotalFwdPackets);
        else
            NumberDeliveredPackets[data.links[i].target] += parseInt(data.links[i].TotalFwdPackets);
        if (getTransferedPackets(data.links[i].source + data.links[i].target) == null)
            transferPackets[data.links[i].source + data.links[i].target] = parseInt(data.links[i].TotalFwdPackets);
        else
            transferPackets[data.links[i].source + data.links[i].target] += parseInt(data.links[i].TotalFwdPackets);
    }
}

function handleSelectedNode(nodes) {
    console.log(nodes);
    d3.select("#PCA").selectAll(".forepath").transition().duration(200)
        .style("stroke", function (d) {
            if (nodes.has(d.source.id) || (nodes.has(d.target.id)))
                return "red";
            else
                return "#007bff";

        })
        .style("opacity", function (d) {
            if (nodes.has(d.source.id) || (nodes.has(d.target.id)))
                return "1";
            else
                return "0";
        });
    console.log(nodes)

}
function handleMouseOverNode(circle) {
    var nodes = [];
    nodes.push(circle._groups[0][0].__data__.id);
    d3.select("#graph").selectAll("line").transition().duration(200)
        .style("opacity", function (d) {
            if ((d.source.id === circle._groups[0][0].__data__.id) || (d.target.id === circle._groups[0][0].__data__.id)) {
                nodes.push(d.target.id);
                nodes.push(d.source.id);
                return "1";
            }
            if ((d.source.id !== circle._groups[0][0].__data__.id) || (d.target.id !== circle._groups[0][0].__data__.id))
                return "0.1";
        });
    d3.select("#graph").selectAll("circle").transition().duration(200)
        .style("opacity", function (d) {
            if (nodes.indexOf(d.id) > -1)
                return "1";
            else
                return "0.1"
        })

}
function handleMouseOutNode() {
    d3.select("#graph").selectAll("line").transition().duration(200).style("opacity", "1");
    d3.select("#graph").selectAll("circle").transition().duration(200).style("opacity", "1")
}
function handleMouseMoveEdge(edge) {
    d3.select("#graph").selectAll("line").transition().duration(200).style("opacity", function (d) {
        if (d.source.id === edge.source.id && d.target.id === edge.target.id)
            return "1";
        else
            return "0.1";
    });

    d3.select("#graph").selectAll("circle").transition().duration(200).style("opacity", function (d) {
        if (d.id === edge.source.id || d.id === edge.target.id)
            return "1";
        else
            return "0.1";
    })
}
function handleMouseOutEdge() {
    d3.select("#graph").selectAll("line").transition().duration(150).delay(20).style("opacity", "1");
    d3.select("#graph").selectAll("circle").transition().duration(150).delay(20).style("opacity", "1");
}
function drawLegend() {
    var legendheight = 300,
        legendwidth = 80,
        margin = {top: 10, right: 60, bottom: 10, left: 2};

    var canvas = d3.select("#boxplot")
        .style("height", legendheight + "px")
        .style("width", legendwidth + "px")
        .style("position", "relative")
        .append("canvas")
        .attr("height", legendheight - margin.top - margin.bottom)
        .attr("width", 1)
        .style("height", (legendheight - margin.top - margin.bottom) + "px")
        .style("width", (legendwidth - margin.left - margin.right) + "px")
        .style("border", "1px solid #000")
        .style("position", "absolute")
        .style("top", (margin.top) + "px")
        .style("left", (margin.left) + "px")
        .node();

    var ctx = canvas.getContext("2d");

    var legendscale = d3.scaleLinear()
        .range([1, legendheight - margin.top - margin.bottom])
        .domain(colorScalePackets.domain());

    // image data hackery based on http://bl.ocks.org/mbostock/048d21cf747371b11884f75ad896e5a5
    var image = ctx.createImageData(1, legendheight);
    d3.range(legendheight).forEach(function (i) {
        var c = d3.rgb(colorScalePackets(legendscale.invert(i)));
        image.data[4 * i] = c.r;
        image.data[4 * i + 1] = c.g;
        image.data[4 * i + 2] = c.b;
        image.data[4 * i + 3] = 255;
    });
    ctx.putImageData(image, 0, 0);

    var legendaxis = d3.axisRight()
        .scale(legendscale)
        .tickSize(5)
        .ticks(10);

    var svg = d3.select("#boxplot")
        .append("svg")
        .attr("height", (legendheight) + "px")
        .attr("width", (legendwidth) + "px")
        .style("position", "absolute")
        .style("left", "0px")
        .style("top", "0px");

    svg
        .append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (legendwidth - margin.left - margin.right + 3) + "," + (margin.top) + ")")
        .call(legendaxis);
}
// built the scale for the packets
function scalePacket() {
    var max = 0;
    Object.keys(NumberSentPackets).forEach(function (key) {
        if (NumberSentPackets[key] > max)
            max = NumberSentPackets[key];

    });
    Object.keys(NumberDeliveredPackets).forEach(function (key) {
        if (NumberDeliveredPackets[key] > max)
            max = NumberDeliveredPackets[key];
    });
    colorScalePackets = d3.scaleSequential(d3.interpolateViridis).domain([0, max]);

    max = 0;
    var min = 999999999;
    Object.keys(transferPackets).forEach(function (key) {
        if (transferPackets[key] > max)
            max = transferPackets[key];
        if (transferPackets[key] < min)
            min = transferPackets[key];
    });
    scalePackets = d3.scaleLinear().domain([min, max]).range([3, 27]);

}

// return the value of the map with key k
function getAttackPackets(k) {
    return NumberSentPackets[k];
}
function getTargetPackets(k) {
    return NumberDeliveredPackets[k];
}
function getTransferedPackets(k) {
    return transferPackets[k];
}

