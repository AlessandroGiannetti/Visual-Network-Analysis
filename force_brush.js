var selectedCircle = new Set();

function drawgraph(data){
    var svg = d3.select("#graph"),
    width = +svg.attr("width",),
    height = +svg.attr("height",);

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("collide", d3.forceCollide().strength(2).radius(35))
        .force("charge", d3.forceManyBody().strength(-200).distanceMax(250))
        .force("center", d3.forceCenter(width / 2, height / 2));

    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(data.links)
        .enter().append("line");

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(data.nodes)
        .enter().append("circle")
        .attr("r", 15)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    var textElements = svg.append("g")
        .attr("class", "texts")
        .selectAll("text")
        .data(data.nodes)
        .enter().append("text")
        .text(function (node) { return  node.id })
        .attr("font-size", 15)
        .attr("dx", 15)
        .attr("dy", 4);

    node.append("title")
        .text(function(d) { return d.id; });
    simulation
        .nodes(data.nodes)
        .on("tick", ticked);
    simulation.force("link")
        .links(data.links);

    var brush = svg.append("g")
        .datum(function() { return {selected: false, previouslySelected: false}; })
        .attr("class", "brush")
        .call(d3.brush()
            .extent([[0, 0], [width, height]])
            .on("brush", function() {
                console.log(selectedCircle)
                var extent = d3.event.selection;
                node.style("fill", function(d) {
                    var evaluation = extent[0][0] <= d.x && d.x < extent[1][0]
                        && extent[0][1] <= d.y && d.y < extent[1][1];
                    if (evaluation == true) {
                        selectedCircle.add(d)
                        return "red"
                    } else {
                        selectedCircle.delete(d)
                        return d3.select(this).attr("fill-copied");
                    }
                });
            }));

    function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
        textElements
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; });
    }
};

function drawcpa(data){
    var margin = {top: 30, right: 10, bottom: 10, left: 10},
        width = 960 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var x = d3.scaleBand().rangeRound([0, width+100]).padding(.1),
        y = {},
        dragging = {};

    var line = d3.line(),
        //axis = d3.axisLeft(x),
        background,
        foreground,
        extents;

    var svg = d3.select("#PCA").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Extract the list of dimensions and create a scale for each.
    //cars[0] contains the header elements, then for all elements in the header
    //different than "name" it creates and y axis in a dictionary by variable name
    //var d
   // x.domain(dimensions = d3.keys(data.links[0]).filter(function(d) {
   //     d = d;
     //   return y[d] = d3.scaleLinear()
       //     .domain(//array dei valori)
         //   .range([height, 0]);
    //}));
    extents = dimensions.map(function(p) { return [0,0]; });

    // Add grey background lines for context.
    background = svg.append("g")
        .attr("class", "background")
        .selectAll("path")
        .data(data.links)
        .enter().append("path")
        .attr("class","backpath")
        .attr("d", path);

    // Add blue foreground lines for focus.
    foreground = svg.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(data.links)
        .enter().append("path")
        .attr("class","forepath")
        .attr("d", path);

    // Add a group element for each dimension.
    var g = svg.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function(d) {  return "translate(" + x(d) + ")"; })
        .call(d3.drag()
            .subject(function(d) { return {x: x(d)}; })
            .on("start", function(d) {
                dragging[d] = x(d);
                background.attr("visibility", "hidden");
            })
            .on("drag", function(d) {
                dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                foreground.attr("d", path);
                dimensions.sort(function(a, b) { return position(a) - position(b); });
                x.domain(dimensions);
                g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
            })
            .on("end", function(d) {
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
        .each(function(d) {  d3.select(this).call(d3.axisLeft(y[d]));})
        //text does not show up because previous line breaks somehow
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function(d) { return d; });

    // Add and store a brush for each axis.
    g.append("g")
        .attr("class", "brush")
        .each(function(d) {
            d3.select(this).call(y[d].brush = d3.brushY().extent([[-8, 0], [8,height]]).on("brush start", brushstart).on("brush", brush_parallel_chart));
        })
        .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);

    function position(d) {
        var v = dragging[d];
        return v == null ? x(d) : v;
    }

    function transition(g) {
        return g.transition().duration(500);
    }

// Returns the path for a given data point.
    function path(d) {
        return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
    }

    function brushstart() {
        d3.event.sourceEvent.stopPropagation();
    }


// Handles a brush event, toggling the display of foreground lines.
    function brush_parallel_chart() {
        for(var i=0;i<dimensions.length;++i){
            if(d3.event.target==y[dimensions[i]].brush) {
                extents[i]=d3.event.selection.map(y[dimensions[i]].invert,y[dimensions[i]]);

            }
        }

        foreground.style("display", function(d) {
            return dimensions.every(function(p, i) {
                if(extents[i][0]==0 && extents[i][0]==0) {
                    return true;
                }
                return extents[i][1] <= d[p] && d[p] <= extents[i][0];
            }) ? null : "none";
        });
    }
};

d3.json("miserables.json", function(error, data) {
    chiavi= d3.keys(data.links[0]);

    if (error) throw error;
    var l=data.links.length;
    for (i=0;i<l;i++)
    {
        data.links[i].id=i
    }
    drawgraph(data);
    // drawcpa(data);

});

function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}