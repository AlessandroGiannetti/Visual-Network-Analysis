var chiavi;

var dataSelection=[];

var focus;

var margin = {top: 5, right: 5, bottom: 5, left: 5},
    margin2 = {top: 5, right: 5, bottom: 5, left: 5},
    width = 950 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom,
    height2 = 800 - margin2.top - margin2.bottom;

var brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on("brush", brushed);

var brushTot=d3.brush()
    .extent([[0,0],[width, height]])
    .on("end", selected);

var color= d3.scaleOrdinal(d3.schemeCategory10);

function drawgraph(data){

    var svg = d3.select("#graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("collide", d3.forceCollide().strength(2).radius(100))
        .force("charge", d3.forceManyBody().strength(-180).distanceMax(280))
        .force("xAxis",d3.forceX(width/2).strength(0.4))
        .force("yAxis", d3.forceY(height / 2).strength(0.8))
        .force("center", d3.forceCenter(width / 2, height / 2));

    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var link = focus.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(data.links)
        .enter().append("line");

    var node = focus.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(data.nodes)
        .enter().append("circle")
        .attr("r", 15)
        .attr("opacity", "1")
        .style("fill", function(d) {return color(d[chiavi[2]]); });

    var textElements = focus.append("g")
        .attr("class", "texts")
        .selectAll("text")
        .data(data.nodes)
        .enter().append("text")
        .text(function (node) { return  node.id })
        .attr("font-size", 15)
        .attr("dx", 20)
        .attr("dy", 5);

    svg.append("g")
        .attr("class", "brushT")
        .call(brushTot);

    node.append("title")
        .text(function(d) { return d.id; });
    simulation
        .nodes(data.nodes)
        .on("tick", ticked);
    simulation.force("link")
        .links(data.links);

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

    focus.append("g")
        .attr("class", "brush")
        .call(brush);
}
function drawcpa(data){
    var margin = {top: 30, right: 100, bottom: 10, left: 80},
        width = 1800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scaleBand().rangeRound([0, width+100]).padding(.1),
        y = {},
        dragging = {};

    var line = d3.line(),
        background,
        foreground,
        extents;

    var svg = d3.select("#PCA").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var Range = [];

    for (var i = 0; i <= height*20; i= i+20) {
        Range.push(i);
    }
    // Extract the list of dimensions and create a scale for each.
    //cars[0] contains the header elements, then for all elements in the header
    //different than "name" it creates and y axis in a dictionary by variable name
    x.domain(dimensions = d3.keys(data.links[0]).filter(function(d) {
        if ((d == "id") || (d == "index") || (d == "Timestamp") || (d == "FlowDuration")) {
            return false;
        }
        return y[d] = d3.scaleOrdinal()
            .domain(d3.extent(data.links, function(p) {
                if(d=="source" || d=="target") {
                    return +p[d]["id"];
                }
                return +p[d]; }))
            .range(Range);
    }));
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

    /*  // Add and store a brush for each axis.
      g.append("g")
          .attr("class", "brush")
          .each(function(d) {
              d3.select(this).call(y[d].brush = d3.brushY().extent([[-8, 0], [8,height]]).on("brush start", brushstart).on("brush", brush_parallel_chart));
          })
          .selectAll("rect")
          .attr("x", -8)
          .attr("width", 16);*/

    function position(d) {
        var v = dragging[d];
        return v == null ? x(d) : v;
    }

    function transition(g) {
        return g.transition().duration(500);
    }

// Returns the path for a given data point.
    function path(d) {
        return line(dimensions.map(function(p) {
            if(p=="source" || p =="target")
                return [position(p), y[p](d[p]["id"])];
            return [position(p), y[p](d[p])]; }));
    }

    /*    function brushstart() {
            d3.event.sourceEvent.stopPropagation();
        }*/

// Handles a brush event, toggling the display of foreground lines.
    /*function brush_parallel_chart() {
    var domain;
    var range;
    for(var i=0;i<dimensions.length;++i){
        if(d3.event.target==y[dimensions[i]].brush) {
            range = y[dimensions[i]].range();
            extents[i]=d3.event.selection.map(y[dimensions[i]].invert,y[dimensions[i]]);
            // PROBLEMONE - ORDINAL SCALE NON HA LA FUNZIONE INVERT
            // problemi nella selezione su asse y
        }
    }*/

    /* foreground.style("display", function(d) {
           return dimensions.every(function(p, i) {
             if(extents[i][0]==0 && extents[i][0]==0) {
                 return true;
             }
             console.log(extents[i]);

             return extents[i][1] <= d[p] && d[p] <= extents[i][0];
         }) ? null : "none";
     });
 }*/
}
d3.json("miserables.json", function(error, data) {
    chiavi= d3.keys(data.links[0]);
    if (error) throw error;
    var l=data.links.length;
    for (var i=0;i<l;i++) {
        data.links[i].id = i;
    }
    drawgraph(data);
    drawcpa(data);
});

function brushed() {
    focus.selectAll("circle")
        .attr("cx", function (d) {
            return (d.x);
        })
        .attr("cy", function (d) {
            return d.y;
        });
    focus.select(".axis--x").call(xAxis);
}

function selected(){
    dataSelection = [];
    var selection= d3.event.selection;
    if (selection != null) {
        focus.selectAll("circle")
            .style("stroke-width", function (d) {
                if ((d.x > selection[0][0]) && ((d.x) < selection[1][0]) && ((d.y) > selection[0][1]) && ((d.y) < selection[1][1])) {
                    dataSelection.push(d.id);
                    return "4";
                } else {
                    return "1";
                }
            });
    }
    else
        {
            focus.selectAll("circle")
                .style("fill",function(d) {return color(d[chiavi[2]]); })
                .style("stroke-width", "1")
        }

        d3.select("#PCA").selectAll(".forepath")
            .style("stroke","steelblue");

    d3.select("#PCA").selectAll(".forepath")
            .style("stroke",function(d){
                if ((d.source.x > selection[0][0]) && (d.source.x < selection[1][0]) && (d.source.y > selection[0][1]) && (d.source.y < selection[1][1]) || (d.target.x > selection[0][0]) && (d.target.x < selection[1][0]) && (d.target.y > selection[0][1]) && (d.target.y < selection[1][1])) {
                    dataSelection.push(d.id);
                    return "red";
                }
                else
                {
                    return "steelblue";
                }
            });
}