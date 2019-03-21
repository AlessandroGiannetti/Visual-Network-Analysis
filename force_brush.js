// ======= Global variable declaration =======
var
    // ScalePack scale of packets
    scalePack,
    // NofPackets key: [source+target]  value : total n° of packets
    NofPackets = {},
    //SVG width and height
    width = 950,
    height = 805;
// ======= Fine Global variable declaration=======

// extraction of the dataset from the file
d3.json("miserables.json", function (error, data) {
    if (error) throw error;
    // building the map packet
    buildMapPacket(data);
    // building the scale packet
    scalePacket(NofPackets);
    //drawing the graph network
    drawGraph(data);
    // drawing the cpa plot
    drawCpa(data);
});

function drawGraph(data) {

    var edges = [];

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

    //declaration of the tooltip (extra info on over)
    var tooltip = d3.select('body').append('div')
        .style('opacity', 0)
        .attr('class', 'd3-tip');

    //declaration of the link of the network
    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(data.links)
        .enter().append("line")
        .on('mousemove', function (d) {
            tooltip.transition().duration(150)
                .style('opacity', .9);
            tooltip.html(contentLinkTip(d))
                .style('left', (d3.event.pageX + 50) + 'px')
                .style('top', (d3.event.pageY) + 'px');
            handleMouseMoveEdge(d);
        })
        .on('mouseout', function () {
            tooltip.transition().duration(150).delay(0).delay(20)
                .style('opacity', 0);
            handleMouseOutEdge();
        })
        .attr("stroke-width", function (d) {
            return scalePack(NofPackets[d.source + d.target]);
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
        .on("click", function () {
            d3.select(this).style("fill", "lightcoral");
            handleSelectedNode(d3.select(this));
        })
        .on('dblclick', function () {
            d3.select(this).style("fill", "steelblue");
            handleUnselectedNode(d3.select(this));
        })
        .on('mouseover', function () {
            handleMouseOverNode(d3.select(this));
        })
        .on('mouseout', function () {
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
        .attr("dx", function () {
            if (d3.select(this)._groups[0][0].__data__.group == "1") return -25; else return 25;
        })
        .attr("dy", 5);

    node.append("title")
        .text(function (d) {
            return d.id;
        });

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
        var content = " <table align='center'><tr><td>Attacker:</td> <td>" + d.source.id.slice(0, -2) + "</td></tr>" +
            "<tr><td>Target:</td><td align='left'>" + d.target.id.slice(0, -2) + "</td></tr>" +
            "<tr><th>Tot n° of packets:</th> <td>" + NofPackets[d.source.id + d.target.id] + "</td></tr></table>";
        return content;
    }
}

function drawCpa(data) {
    var margin = {top: 30, right: 100, bottom: 10, left: 80},
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
        .attr("d", path);

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
        .style("font-size", "15px")
        .style("font-family", "'Ubuntu', sans-serif")
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

}

function buildMapPacket(data) {
    for (i = 0; i < data.links.length; i++) {
        if (get(data.links[i].source + data.links[i].target) == null)
            NofPackets[data.links[i].source + data.links[i].target] = parseInt(data.links[i].TotalFwdPackets);
        else
            NofPackets[data.links[i].source + data.links[i].target] += parseInt(data.links[i].TotalFwdPackets);
    }
}

// return the value of the map with key k
function get(k) {
    return NofPackets[k];
}

// built the scale for the packets
function scalePacket(map) {
    var max = 0, min = 9999999;
    Object.keys(map).forEach(function (key) {
        if (map[key] > max)
            max = map[key];
        if (map[key] < min)
            min = map[key];
    });
    scalePack = d3.scale.linear().domain([min, max]).range([3, 20])
}

function handleSelectedNode(circle) {
    d3.select("#PCA").selectAll(".forepath").transition().duration(200)
        .style("stroke", function (d) {
            if ((d.source.id == circle._groups[0][0].__data__.id) || (d.target.id == circle._groups[0][0].__data__.id)) {
                return "red";
            }
        })
        .style("opacity", function (d) {
            if ((d.source.id == circle._groups[0][0].__data__.id) || (d.target.id == circle._groups[0][0].__data__.id)) {
                return "1";
            } else
                return "0.01";
        });
}

function handleUnselectedNode(circle) {
    d3.select("#PCA").selectAll(".forepath").transition().duration(200)
        .style("stroke", function (d) {
            if ((d.source.id == circle._groups[0][0].__data__.id) || (d.target.id == circle._groups[0][0].__data__.id)) {
                return "steelblue";
            }
        })
        .style("opacity", function (d) {
            if ((d.source.id != circle._groups[0][0].__data__.id) || (d.target.id != circle._groups[0][0].__data__.id)) {
                return "1";
            }
        });
}
function handleMouseOverNode(circle) {
    var nodes = [];
    nodes.push(circle._groups[0][0].__data__.id);
    d3.select("#graph").selectAll("line").transition().duration(200).delay(500)
        .style("opacity", function (d) {
            if ((d.source.id == circle._groups[0][0].__data__.id) || (d.target.id == circle._groups[0][0].__data__.id)) {
                nodes.push(d.target.id);
                nodes.push(d.source.id);
                return "1";
            }
            if ((d.source.id != circle._groups[0][0].__data__.id) || (d.target.id != circle._groups[0][0].__data__.id))
                return "0.1";
        });
    d3.select("#graph").selectAll("circle").transition().duration(200).delay(500)
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
    d3.select("#graph").selectAll("line").transition().duration(150).style("opacity", function (d) {
        if (d.source.id == edge.source.id && d.target.id == edge.target.id)
            return "1";
        else
            return "0.1";
    })
}
function handleMouseOutEdge() {
    d3.select("#graph").selectAll("line").transition().duration(150).delay(20).style("opacity", "1");
}
