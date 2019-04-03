// ======= Global variable declaration =======
var
    // ScalePack of packets for link dimension
    scalePackets,
    colorScalePackets,
    // NumberSentPackets key: [source]  value : total n° of packets
    NumberSentPackets = {},
    // NumberDeliveredPackets key: [target]  value : total n° of packets
    NumberDeliveredPackets = {},
    // transferedPackets key: [source+target]  value : total n° of packets
    transferPackets = {},
    //SVG width and height
    width = 950,
    height = 805;
var data;
var step = 0;
var attackDay1 = {};
var attackDay2 = [];
var attackDay3 = [];
var attackDay4 = [];
var extents;
// ======= Fine Global variable declaration=======
// extraction of the dataset from the file
d3.json("miserables.json", function (error, datas) {
    if (error) throw error;
    data = datas;
    // building the map packet
    buildMapPacket(data.links);
    // building the scale packet
    scalePacket();

    drawData();
});

function drawData() {

    // ========================= SLIDERS ===================================
    var marginSlider = {top: 0, right: 30, bottom: 0, left: 30},
        widthSlider = 302 - marginSlider.left - marginSlider.right,
        heightSlider = 65 - marginSlider.bottom - marginSlider.top;
    var formatDate = d3.timeFormat('%H:%M');

    // ================= SLIDER 1 GIORNO 4/7/2017 =========================
    var timeScale1 = d3.scaleTime()
        .domain([new Date(moment("07/04/2017 00:00", 'MMDDYYYY HH:mm')), new Date(moment("07/04/2017 23:59", 'MMDDYYYY HH:mm'))])
        .range([0, widthSlider])
        .nice(d3.timeDay)
        .clamp(true);
    var svgSlider1 = d3.select("#controller1").append("svg")
        .attr("width", widthSlider + marginSlider.left + marginSlider.right)
        .attr("height", heightSlider + marginSlider.top + marginSlider.bottom)
        .attr("id", "svgcontroller1")
        .append("g")
        // classic transform to position g
        .attr("transform", "translate(" + marginSlider.left + "," + marginSlider.top + ")");
    svgSlider1.append("rect")
        .style("pointer-events", "all")
        .style("fill", "none")
        .attr("width", widthSlider)
        .attr("height", heightSlider)
        .style("cursor", "crosshair");
    svgSlider1.append("g")
        .attr("class", "x axis")
        // put in middle of screen
        .attr("transform", "translate(0," + heightSlider / 2 + ")")
        // inroduce axis
        .call(d3.axisBottom()
            .scale(timeScale1)
            .tickFormat(function (d) {
                return formatDate(d);
            })
            .ticks(12)
            .tickSize(8)
            .tickPadding(13))
        .select(".domain")
        .select(function () {
            return this.parentNode.appendChild(this.cloneNode(true));
        })
        .attr("class", "halo");
    var brush1 = d3.brushX()
        .extent([[0, 0], [widthSlider, heightSlider]])
        .on("start brush end", update);
    svgSlider1.append("g")
        .attr("class", "brush1")
        .style("opacity", "0")
        .call(brush1);
    var handle1 = svgSlider1.append("g")
        .attr("class", "handle");
    handle1.append("path")
        .attr("transform", "translate(0," + heightSlider / 2 + ")")
        .attr("d", "M 0 -20 V 20");
    var text1 = handle1.append('text')
        .text(formatDate(timeScale1.domain()[0]))
        .attr("transform", "translate(" + (-18) + " ," + (heightSlider / 2 - 22) + ")");
    var handle2 = svgSlider1.append("g")
        .attr("class", "handle");
    handle2.append("path")
        .attr("transform", "translate(0," + heightSlider / 2 + ")")
        .attr("d", "M 0 -20 V 20");
    var text2 = handle2.append('text')
        .text(formatDate(timeScale1.domain()[0]))
        .attr("transform", "translate(" + (-18) + " ," + (heightSlider / 2 - 22) + ")");
    handle1.attr('transform', 'translate(0,0)');
    handle2.attr('transform', 'translate(' + widthSlider + ",0)");
    // ================= FINE SLIDER GIORNO 4/7/2017 =========================
    // ====================== SLIDER GIORNO 5/7/2017 =========================
    var timeScale2 = d3.scaleTime()
        .domain([new Date(moment("07/05/2017 00:00", 'MMDDYYYY HH:mm')), new Date(moment("07/05/2017 23:59", 'MMDDYYYY HH:mm'))])
        .range([0, widthSlider])
        .nice(d3.timeDay)
        .clamp(true);
    var svgSlider2 = d3.select("#controller2").append("svg")
        .attr("width", widthSlider + marginSlider.left + marginSlider.right)
        .attr("height", heightSlider + marginSlider.top + marginSlider.bottom)
        .attr("id", "svgcontroller2")
        .append("g")
        // classic transform to position g
        .attr("transform", "translate(" + marginSlider.left + "," + marginSlider.top + ")");
    svgSlider2.append("rect")
        .style("pointer-events", "all")
        .style("fill", "none")
        .attr("width", widthSlider)
        .attr("height", heightSlider)
        .style("cursor", "crosshair");
    svgSlider2.append("g")
        .attr("class", "x axis")
        // put in middle of screen
        .attr("transform", "translate(0," + heightSlider / 2 + ")")
        // inroduce axis
        .call(d3.axisBottom()
            .scale(timeScale2)
            .tickFormat(function (d) {
                return formatDate(d);
            })
            .ticks(12)
            .tickSize(8)
            .tickPadding(13))
        .select(".domain")
        .select(function () {
            return this.parentNode.appendChild(this.cloneNode(true));
        })
        .attr("class", "halo");
    var brush2 = d3.brushX()
        .extent([[0, 0], [widthSlider, heightSlider]])
        .on("start brush end", update);
    svgSlider2.append("g")
        .attr("class", "brush2")
        .style("opacity", "0")
        .call(brush2);
    var handle3 = svgSlider2.append("g")
        .attr("class", "handle");
    handle3.append("path")
        .attr("transform", "translate(0," + heightSlider / 2 + ")")
        .attr("d", "M 0 -20 V 20");
    var text3 = handle3.append('text')
        .text(formatDate(timeScale2.domain()[0]))
        .attr("transform", "translate(" + (-18) + " ," + (heightSlider / 2 - 22) + ")");
    var handle4 = svgSlider2.append("g")
        .attr("class", "handle");
    handle4.append("path")
        .attr("transform", "translate(0," + heightSlider / 2 + ")")
        .attr("d", "M 0 -20 V 20");
    var text4 = handle4.append('text')
        .text(formatDate(timeScale2.domain()[0]))
        .attr("transform", "translate(" + (-18) + " ," + (heightSlider / 2 - 22) + ")");
    handle3.attr('transform', 'translate(0,0)');
    handle4.attr('transform', 'translate(' + widthSlider + ",0)");
    // ================= FINE SLIDER GIORNO 5/7/2017 =========================
    // ====================== SLIDER GIORNO 6/7/2017 =========================
    var timeScale3 = d3.scaleTime()
        .domain([new Date(moment("07/06/2017 00:00", 'MMDDYYYY HH:mm')), new Date(moment("07/06/2017 23:59", 'MMDDYYYY HH:mm'))])
        .range([0, widthSlider])
        .nice(d3.timeDay)
        .clamp(true);
    var svgSlider3 = d3.select("#controller3").append("svg")
        .attr("width", widthSlider + marginSlider.left + marginSlider.right)
        .attr("height", heightSlider + marginSlider.top + marginSlider.bottom)
        .attr("id", "svgcontroller3")
        .append("g")
        // classic transform to position g
        .attr("transform", "translate(" + marginSlider.left + "," + marginSlider.top + ")");
    svgSlider3.append("rect")
        .style("pointer-events", "all")
        .style("fill", "none")
        .attr("width", widthSlider)
        .attr("height", heightSlider)
        .style("cursor", "crosshair");
    svgSlider3.append("g")
        .attr("class", "x axis")
        // put in middle of screen
        .attr("transform", "translate(0," + heightSlider / 2 + ")")
        // inroduce axis
        .call(d3.axisBottom()
            .scale(timeScale3)
            .tickFormat(function (d) {
                return formatDate(d);
            })
            .ticks(12)
            .tickSize(8)
            .tickPadding(13))
        .select(".domain")
        .select(function () {
            return this.parentNode.appendChild(this.cloneNode(true));
        })
        .attr("class", "halo");
    var brush3 = d3.brushX()
        .extent([[0, 0], [widthSlider, heightSlider]])
        .on("start brush end", update);
    svgSlider3.append("g")
        .attr("class", "brush3")
        .style("opacity", "0")
        .call(brush3);
    var handle5 = svgSlider3.append("g")
        .attr("class", "handle");
    handle5.append("path")
        .attr("transform", "translate(0," + heightSlider / 2 + ")")
        .attr("d", "M 0 -20 V 20");
    var text5 = handle5.append('text')
        .text(formatDate(timeScale3.domain()[0]))
        .attr("transform", "translate(" + (-18) + " ," + (heightSlider / 2 - 22) + ")");
    var handle6 = svgSlider3.append("g")
        .attr("class", "handle");
    handle6.append("path")
        .attr("transform", "translate(0," + heightSlider / 2 + ")")
        .attr("d", "M 0 -20 V 20");
    var text6 = handle6.append('text')
        .text(formatDate(timeScale3.domain()[0]))
        .attr("transform", "translate(" + (-18) + " ," + (heightSlider / 2 - 22) + ")");
    handle5.attr('transform', 'translate(0,0)');
    handle6.attr('transform', 'translate(' + widthSlider + ",0)");
    // ================= FINE SLIDER GIORNO 6/7/2017 =========================
    // ====================== SLIDER GIORNO 7/7/2017 =========================
    var timeScale4 = d3.scaleTime()
        .domain([new Date(moment("07/07/2017 00:00", 'MMDDYYYY HH:mm')), new Date(moment("07/07/2017 23:59", 'MMDDYYYY HH:mm'))])
        .range([0, widthSlider])
        .nice(d3.timeDay)
        .clamp(true);
    var svgSlider4 = d3.select("#controller4").append("svg")
        .attr("width", widthSlider + marginSlider.left + marginSlider.right)
        .attr("height", heightSlider + marginSlider.top + marginSlider.bottom)
        .attr("id", "svgcontroller4")
        .append("g")
        // classic transform to position g
        .attr("transform", "translate(" + marginSlider.left + "," + marginSlider.top + ")");
    svgSlider4.append("rect")
        .style("pointer-events", "all")
        .style("fill", "none")
        .attr("width", widthSlider)
        .attr("height", heightSlider)
        .style("cursor", "crosshair");
    svgSlider4.append("g")
        .attr("class", "x axis")
        // put in middle of screen
        .attr("transform", "translate(0," + heightSlider / 2 + ")")
        // inroduce axis
        .call(d3.axisBottom()
            .scale(timeScale4)
            .tickFormat(function (d) {
                return formatDate(d);
            })
            .ticks(12)
            .tickSize(8)
            .tickPadding(13))
        .select(".domain")
        .select(function () {
            return this.parentNode.appendChild(this.cloneNode(true));
        })
        .attr("class", "halo");
    var brush4 = d3.brushX()
        .extent([[0, 0], [widthSlider, heightSlider]])
        .on("start brush end", update);
    svgSlider4.append("g")
        .attr("class", "brush4")
        .style("opacity", "0")
        .call(brush4);
    var handle7 = svgSlider4.append("g")
        .attr("class", "handle");
    handle7.append("path")
        .attr("transform", "translate(0," + heightSlider / 2 + ")")
        .attr("d", "M 0 -20 V 20");
    var text7 = handle7.append('text')
        .text(formatDate(timeScale4.domain()[0]))
        .attr("transform", "translate(" + (-18) + " ," + (heightSlider / 2 - 22) + ")");
    var handle8 = svgSlider4.append("g")
        .attr("class", "handle");
    handle8.append("path")
        .attr("transform", "translate(0," + heightSlider / 2 + ")")
        .attr("d", "M 0 -20 V 20");
    var text8 = handle8.append('text')
        .text(formatDate(timeScale4.domain()[0]))
        .attr("transform", "translate(" + (-18) + " ," + (heightSlider / 2 - 22) + ")");
    handle7.attr('transform', 'translate(0,0)');
    handle8.attr('transform', 'translate(' + widthSlider + ",0)");
    // ================= FINE SLIDER GIORNO 7/7/2017 =======================
    // =========================FINE SLIDERS ===================================


    // =============================INIT INFO N ATTACK ============================
    day1 = data.links.filter(function (d) {
        return d.Timestamp.slice(0, -6) === "4/7/2017"
    });
    day2 = data.links.filter(function (d) {
        return d.Timestamp.slice(0, -6) === "5/7/2017"
    });
    day3 = data.links.filter(function (d) {
        return d.Timestamp.slice(0, -6) === "6/7/2017"
    });
    day4 = data.links.filter(function (d) {
        return d.Timestamp.slice(0, -6) === "7/7/2017"
    });

    d3.select("#day1").html(day1.length + " / <b>" + day1.length + "</b>");
    d3.select("#day2").html(day2.length + " / <b>" + day2.length + "</b>");
    d3.select("#day3").html(day3.length + " / <b>" + day3.length + "</b>");
    d3.select("#day4").html(day4.length + " / <b>" + day4.length + "</b>");
    // ====================FINE INIT INFO N ATTACK ============================
    //====================================== BAR CHART =============================
    var widthBar = 200;
    var heightBar = 20;
    var svgWidthBar = 390;
    var svgHeightBar = 100;

    var tooltipBar = d3.select('body').append('div')
        .style('opacity', 0)
        .attr('class', 'd3-tip');
    //==================================FINE BAR CHART =============================
    // ========================== DRAWING GRAPH ================================
    var edges = [],
        nodeSelected = new Set();
    var widthGRAPH = 730,
        heightGRAPH = 500;
    // create the svg on
    var svgGRAPH = d3.select("#graph").append("svg")
        .attr("width", widthGRAPH)
        .attr("height", heightGRAPH);
    var tooltipLink,  // FINESTRA SU LINK
        tooltipNode,  // FINESTRA SU NODI
        node,
        link,
        textElements;
    var simulation = d3.forceSimulation(data.nodes)
        .force('forceX', d3.forceX(function (d) {
            if (d.id === "205.174.165.73sx")
                return 500;
            if (d.id === "205.174.165.73dx")
                return 500;
            if (d.group === '1')
                return 250;
            if (d.group === '2')
                return 750;
        }).strength(1))
        .force("forceY", d3.forceY((d => (d.id === '205.174.165.73sx' || d.id === '205.174.165.73dx') ? 1 : 0)).strength(0.0011))
        .force('collision', d3.forceCollide().radius((d => (d.id === '205.174.165.73sx' || d.id === '205.174.165.73dx') ? 0 : 21)))
        .force("charge", d3.forceManyBody().strength((d => (d.id === '205.174.165.73sx' || d.id === '205.174.165.73dx') ? 5 : 0)).distanceMin(1).distanceMax(800))
        .force('center', d3.forceCenter(widthGRAPH / 2, heightGRAPH / 2))
        .force("link", d3.forceLink().distance(800).strength(0).id(function (d) {
            return d.id;
        }))
        .alphaTarget(0).on("tick", ticked);

    simulation.nodes(data.nodes).on("tick", ticked);
    // ==================FINE DICHIARAZIONI GRAPH =============================
    // ===================== DICHIARAZIONI LEGEND =============================
    var heightLegend = 500,
        widthLegend = 80,
        marginLegend = {top: 20, right: 60, bottom: 20, left: 2},
        canvas,
        ctx,
        legendscale,
        image,
        legendaxis,
        svgLegend,
        c;
    // ==============  FINE DICHIARAZIONI LEGEND ==============================
    // ================= DICHIARAZIONI CPA ====================================
    var marginCPA = {top: 30, right: 0, bottom: 10, left: 0},
        widthCPA = 1074 - marginCPA.left - marginCPA.right,
        heightCPA = 500 - marginCPA.top - marginCPA.bottom;
    var x = d3.scaleBand().rangeRound([0, widthCPA]).padding(.1),
        y = {},
        dragging = {},
        line = d3.line(),
        Range = [];
    var svgCPA = d3.select("#PCA").append("svg")
        .attr("width", widthCPA)
        .attr("height", heightCPA + marginCPA.top + marginCPA.bottom)
        .append("g")
        .attr("transform", "translate(" + 70 + "," + 28 + ")");
    for (var i = 0; i <= heightCPA * 20; i = i + 20) {
        Range.push(i);
    }

    // ================= FINE DICHIARAZIONI CPA ==================================

    function initGraph() {
        //declaration of the tooltipLink (extra info on over)
        tooltipLink = d3.select('body').append('div')
            .style('opacity', 0)
            .attr('class', 'd3-tip');

        tooltipNode = d3.select('body').append('div')
            .style('opacity', 0)
            .attr('class', 'd3-tip');

        //declaration of the link of the network
        link = svgGRAPH.append("g")
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
                handleFocusStrokeOnEdge(d);
            })
            .on('mouseout', function () {
                tooltipLink.transition().duration(150)
                    .style('opacity', 0);
                handleMouseOutEdge();
                handleOutFocusStroke();
                if (!brushEmpty())
                    brush_parallel_chart()
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
        node = svgGRAPH.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(data.nodes)
            .enter().append("circle")
            .attr("r", (d => (d.id === '205.174.165.73sx') ? 30 : 14))
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
                nodeSelected.add(d3.select(this)._groups[0][0].__data__.id);
                handleSelectedNode(nodeSelected);
                if (!brushEmpty())
                    brush_parallel_chart()
            })
            .on('dblclick', function () {
                d3.select(this).transition().duration(200).style("stroke", "black");
                nodeSelected.delete(d3.select(this)._groups[0][0].__data__.id);
                handleSelectedNode(nodeSelected);
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
                tooltipNode.transition().duration(150)
                    .style('opacity', 0);
                handleMouseOutNode();
            });

        //declaration of the text (ip) of the node
        textElements = svgGRAPH.append("g")
            .attr("class", "texts")
            .selectAll("text")
            .data(data.nodes)
            .enter().append("text")
            .text(function (node) {
                if (node.id === "205.174.165.73sx")
                    return "";
                return node.id.slice(0, -2)
            })
            .attr("font-size", 15)
            .attr("text-anchor", function (d) {
                if (d.id === "205.174.165.73dx")
                    return "middle";
                else {
                    if (d.group == "1") return "end"; else return "start";
                }
            })
            // riflette gli indirizzi IP a destra e sinistra
            .attr("dx", function (d) {
                if (d.group == "1") return -25; else return 25;
            })
            .attr("dy", function (d) {
                if (d.id === "205.174.165.73dx") return -38; else return 5;
            });

        // starting the simulation
        simulation
            .nodes(data.nodes);

        simulation.force("link")
            .links(data.links);
    }

    initGraph();


    d3.selectAll(".custom-control-input").on("change", update);
    update();

    function update() {
        var checkedValue = [];
        d3.selectAll('.custom-control-input').each(function () {
            cb = d3.select(this);
            if (cb.property("checked")) {
                checkedValue.push(cb.property("value"));
            }
        });
        if (checkedValue.length === 0) {
            newData = data.links;
        }
        selection1 = d3.brushSelection(d3.select(".brush1").node());
        selection2 = d3.brushSelection(d3.select(".brush2").node());
        selection3 = d3.brushSelection(d3.select(".brush3").node());
        selection4 = d3.brushSelection(d3.select(".brush4").node());

        if (selection1 == null) {
            selection1 = [0, widthSlider - 0.2];
        }
        if (selection2 == null) {
            selection2 = [0, widthSlider - 0.2];
        }
        if (selection3 == null) {
            selection3 = [0, widthSlider - 0.2];
        }
        if (selection4 == null) {
            selection4 = [0, widthSlider - 0.2];
        }
        //console.log(selectionLegend);

        newData = data.links.filter(function (d) {
            return checkedValue.includes(d.Timestamp.slice(0, -6)) && ((new Date(moment(d.Timestamp, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm'))) >= timeScale1.invert(selection1[0]) && ((new Date(moment(d.Timestamp, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm')))) <= timeScale1.invert(selection1[1]))
                || checkedValue.includes(d.Timestamp.slice(0, -6)) && (((new Date(moment(d.Timestamp, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm'))) >= (timeScale2.invert(selection2[0]))) && ((new Date(moment(d.Timestamp, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm'))) <= (timeScale2.invert(selection2[1]))))
                || checkedValue.includes(d.Timestamp.slice(0, -6)) && (((new Date(moment(d.Timestamp, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm'))) >= (timeScale3.invert(selection3[0]))) && ((new Date(moment(d.Timestamp, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm'))) <= (timeScale3.invert(selection3[1]))))
                || checkedValue.includes(d.Timestamp.slice(0, -6)) && (((new Date(moment(d.Timestamp, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm'))) >= (timeScale4.invert(selection4[0]))) && ((new Date(moment(d.Timestamp, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm'))) <= (timeScale4.invert(selection4[1]))));
        });

        // =============================UPDATE INFO N ATTACK ============================
        UPday1 = newData.filter(function (d) {
            return d.Timestamp.slice(0, -6) === "4/7/2017"
        });
        UPday2 = newData.filter(function (d) {
            return d.Timestamp.slice(0, -6) === "5/7/2017"
        });
        UPday3 = newData.filter(function (d) {
            return d.Timestamp.slice(0, -6) === "6/7/2017"
        });
        UPday4 = newData.filter(function (d) {
            return d.Timestamp.slice(0, -6) === "7/7/2017"
        });

        d3.select("#day1").html(UPday1.length + " / <b>" + day1.length + "</b>");
        d3.select("#day2").html(UPday2.length + " / <b>" + day2.length + "</b>");
        d3.select("#day3").html(UPday3.length + " / <b>" + day3.length + "</b>");
        d3.select("#day4").html(UPday4.length + " / <b>" + day4.length + "</b>");
        // ====================FINE UPDATE INFO N ATTACK ============================

        // EVENT LISTENER SLIDER 1 DATA 4/7/2017
        if (checkedValue.includes("4/7/2017")) {
            d3.select("#svgcontroller1").transition().duration(200).style("opacity", "1");
            d3.select("#barchartDay1").style("opacity", "1");
            selection1 = d3.brushSelection(d3.select(".brush1").node());
            if (selection1 == null)
                selection1 = [0, widthSlider - 0.2];
            handle1.attr('transform', 'translate(' + selection1[0] + ",0)");
            text1.text(formatDate(timeScale1.invert(selection1[0])));
            handle2.attr('transform', 'translate(' + selection1[1] + ",0)");
            text2.text(formatDate(timeScale1.invert(selection1[1])));
        } else {
            d3.select("#svgcontroller1").transition().duration(200).style("opacity", "0");
            d3.select("#barchartDay1").transition().duration(200).style("opacity", "0");
        }
        // EVENT LISTENER SLIDER 2 DATA 5/7/2017
        if (checkedValue.includes("5/7/2017")) {
            d3.select("#svgcontroller2").transition().duration(200).style("opacity", "1");
            d3.select("#barchartDay2").transition().duration(200).style("opacity", "1");
            selection2 = d3.brushSelection(d3.select(".brush2").node());
            if (selection2 == null)
                selection2 = [0, widthSlider - 0.2];
            handle3.attr('transform', 'translate(' + selection2[0] + ",0)");
            text3.text(formatDate(timeScale1.invert(selection2[0])));
            handle4.attr('transform', 'translate(' + selection2[1] + ",0)");
            text4.text(formatDate(timeScale1.invert(selection2[1])));
        } else {
            d3.select("#svgcontroller2").transition().duration(200).style("opacity", "0");
            d3.select("#barchartDay2").transition().duration(200).style("opacity", "0");
        }
        // EVENT LISTENER SLIDER 3 DATA 5/7/2017
        if (checkedValue.includes("6/7/2017")) {
            d3.select("#svgcontroller3").transition().duration(200).style("opacity", "1");
            d3.select("#barchartDay3").transition().duration(200).style("opacity", "1");
            selection3 = d3.brushSelection(d3.select(".brush3").node());
            if (selection3 == null)
                selection3 = [0, widthSlider - 0.2];
            handle5.attr('transform', 'translate(' + selection3[0] + ",0)");
            text5.text(formatDate(timeScale1.invert(selection3[0])));
            handle6.attr('transform', 'translate(' + selection3[1] + ",0)");
            text6.text(formatDate(timeScale1.invert(selection3[1])));
        } else {
            d3.select("#svgcontroller3").transition().duration(200).style("opacity", "0");
            d3.select("#barchartDay3").transition().duration(200).style("opacity", "0");
        }
        // EVENT LISTENER SLIDER 4 DATA 7/7/2017
        if (checkedValue.includes("7/7/2017")) {
            d3.select("#svgcontroller4").transition().duration(200).style("opacity", "1");
            d3.select("#barchartDay4").transition().duration(200).style("opacity", "1");
            selection4 = d3.brushSelection(d3.select(".brush4").node());
            if (selection4 == null)
                selection4 = [0, widthSlider - 0.2];
            handle7.attr('transform', 'translate(' + selection4[0] + ",0)");
            text7.text(formatDate(timeScale4.invert(selection4[0])));
            handle8.attr('transform', 'translate(' + selection4[1] + ",0)");
            text8.text(formatDate(timeScale4.invert(selection4[1])));
        } else {
            d3.select("#svgcontroller4").transition().duration(200).style("opacity", "0");
            d3.select("#barchartDay4").transition().duration(200).style("opacity", "0");
        }

        // se non è lo step iniziale eseguo queste funzioni
        if (step === 1) {
            buildMapPacket(newData);
            scalePacket(NumberDeliveredPackets);
            updateGraph(newData);
        }
        step = 1;
        updateLegend();
        updateCPA();

        updateScatterplot();

        attackPackets(newData);
        updateChartDay1();
        updateChartDay2();
        updateChartDay3();
        updateChartDay4();

        function updateGraph(newData) {
            var edges = [];

            d3.selectAll(".d3-tip").remove();

            //declaration of the tooltipLink (extra info on over)
            tooltipLink = d3.select('body').append('div')
                .style('opacity', 0)
                .attr('class', 'd3-tip');

            tooltipNode = d3.select('body').append('div')
                .style('opacity', 0)
                .attr('class', 'd3-tip');

            node = node.data(data.nodes, function (d) {
                return d.id;
            });

            node = node.data(data.nodes, function (d) {
                return d.id;
            });
            node.exit().remove();
            node = node.enter().append("circle").merge(node)
                .attr("r", (d => (d.id === '205.174.165.73sx') ? 30 : 14))
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
                });

            textElements = textElements.data(data.nodes, function (d) {
                return d.id
            });
            textElements.exit().remove();
            textElements = textElements.enter().append("text").merge(textElements);

            link = link.data(newData, function (d) {
                return d.source.id + "-" + d.target.id;
            });
            link.exit().remove();
            link = link.enter().append("line").merge(link)
                .on('mousemove', function (d) {
                    tooltipLink.transition().duration(150)
                        .style('opacity', 1);
                    tooltipLink.html(contentLinkTip(d))
                        .style('left', (d3.event.pageX + 50) + 'px')
                        .style('top', (d3.event.pageY) + 'px');
                    handleMouseMoveEdge(d);
                    handleFocusStrokeOnEdge(d);
                })
                .on('mouseout', function () {
                    tooltipLink.transition().duration(150)
                        .style('opacity', 0);
                    handleMouseOutEdge();
                    handleOutFocusStroke();
                    if (!brushEmpty())
                        brush_parallel_chart()
                })
                .attr("stroke-width", function (d) {
                    return scalePackets(transferPackets[d.source.id + d.target.id]);
                })
                .attr("display", function (d) {
                    if (edges.findIndex(x => (x.source == d.source && x.target == d.target)) <= -1) {
                        edges.push(d);
                        return "block";
                    } else {
                        return "none";
                    }
                });

            // starting the simulation
            simulation.nodes(data.nodes);
            simulation.force("link").links(newData);
            simulation.alpha(0).restart();
        }

        handleSelectedNode(nodeSelected);

        function updateLegend() {
            d3.selectAll(".legendGraph").remove();

            canvas = d3.select("#legend")
                .style("height", heightLegend + "px")
                .style("width", widthLegend + "px")
                .style("position", "relative")
                .append("canvas")
                .attr("height", heightLegend - marginLegend.top - marginLegend.bottom)
                .attr("width", 1)
                .style("height", (heightLegend - marginLegend.top - marginLegend.bottom) + "px")
                .style("width", (widthLegend - marginLegend.left - marginLegend.right) + "px")
                .style("border", "1px solid #000")
                .style("position", "absolute")
                .style("top", "20px")
                .style("left", "20px")
                .node();

            ctx = canvas.getContext("2d");
            legendscale = d3.scaleLinear()
                .range([1, heightLegend - marginLegend.top - marginLegend.bottom])
                .domain(colorScalePackets.domain());

            image = ctx.createImageData(1, heightLegend);
            d3.range(heightLegend).forEach(function (i) {
                c = d3.rgb(colorScalePackets(legendscale.invert(i)));
                image.data[4 * i] = c.r;
                image.data[4 * i + 1] = c.g;
                image.data[4 * i + 2] = c.b;
                image.data[4 * i + 3] = 255;
            });
            ctx.putImageData(image, 0, 0);

            legendaxis = d3.axisRight()
                .scale(legendscale)
                .tickSize(5)
                .ticks(15);

            svgLegend = d3.select("#legend")
                .append("svg")
                .attr("height", (heightLegend) + "px")
                .attr("width", (widthLegend) + "px")
                .style("position", "absolute")
                .style("left", "20px")
                .style("top", "0px");


            brushLegend = d3.brushY()
                .extent([[0, 0], [widthLegend - marginLegend.left - marginLegend.right, heightLegend]])
                .on("start brush end", filterView);

            svgLegend.append("g")
                .attr("class", "brushLegend")
                .attr("transform", "translate(" + (0) + "," + (marginLegend.top) + ")")
                .call(brushLegend);

            svgLegend
                .append("g")
                .attr("class", "axis")
                .attr("transform", "translate(" + (widthLegend - marginLegend.left - marginLegend.right + 3) + "," + (marginLegend.top) + ")")
                .call(legendaxis)
                .attr("class", "legendGraph");

        }

        function updateCPA() {
            //===== remove the previous prova =========
            d3.selectAll(".selected").remove();
            d3.selectAll(".notSelected").remove();
            d3.selectAll(".backpath").remove();
            d3.selectAll(".dimension").remove();
            // =============== update the cpa ==================
            x.domain(dimensions = d3.keys(newData[0]).filter(function (d) {
                if ((d == "id") || (d == "index") || (d == "Timestamp") || (d == "FlowDuration") || (d == "TotalBackwardPackets") || (d == "TotalLenghtOfBwdPackets")) {
                    return false;
                }
                return y[d] = d3.scaleOrdinal()
                    .domain(d3.extent(newData, function (p) {
                        if (d == "source" || d == "target") {
                            return +p[d]["id"];
                        }
                        return +p[d];
                    }))
                    .range(Range);
            }));


            extents = dimensions.map(function (p) {
                return [0, 0];
            });

            // Add grey background lines for context.
            background = svgCPA.append("g")
                .attr("class", "background")
                .selectAll("path")
                .data(newData)
                .enter().append("path")
                .attr("class", "backpath")
                .attr("d", path);
            // Add blue selected lines for focus.

            notSelected = svgCPA.append("g")
                .attr("class", "notEvidence")
                .selectAll("path")
                .data(newData)
                .enter().append("path")
                .attr("class", "notSelected")
                .attr("d", path)
                .on('mouseover', function () {
                    handleFocusStroke(d3.select(this)._groups[0][0].__data__);
                    handleMouseMoveEdge(d3.select(this)._groups[0][0].__data__);
                })
                .on('mouseout', function () {
                    d3.select(this).transition().duration(100).style("stroke-width", "1px");
                    handleOutFocusStroke();
                    handleMouseOutEdge();
                    if (!brushEmpty())
                        brush_parallel_chart()
                });

            selected = svgCPA.append("g")
                .attr("class", "evidence")
                .selectAll("path")
                .data(newData)
                .enter().append("path")
                .attr("class", "selected")
                .attr("d", path)
                .on('mouseover', function () {
                    handleFocusStroke(d3.select(this)._groups[0][0].__data__);
                    handleMouseMoveEdge(d3.select(this)._groups[0][0].__data__);
                })
                .on('mouseout', function () {
                    handleOutFocusStroke();
                    handleMouseOutEdge();
                    if (!brushEmpty())
                        brush_parallel_chart()
                });

            // Add a group element for each dimension.
            var g = svgCPA.selectAll(".dimension")
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
                        dragging[d] = Math.min(widthCPA, Math.max(0, d3.event.x));
                        selected.attr("d", path);
                        notSelected.attr("d", path);
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
                        transition(selected).attr("d", path);
                        transition(notSelected).attr("d", path);
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
                    d3.select(this).call(d3.axisLeft(y[d])
                        .ticks(12)
                        .tickSize(9)
                        .tickPadding(7));
                })
                //text does not show up because previous line breaks somehow
                .append("text")
                .style("text-anchor", "middle")
                .attr("y", -12)
                .style("font-size", "13px")
                .text(function (d) {
                    return d;
                });

            // Add and store a brush for each axis.
            g.append("g")
                .attr("class", "brush")
                .each(function (d) {
                    d3.select(this).call(y[d].brush = d3.brushY().extent([[-8, 0], [8, height]]).on("brush start", brushstart).on("brush", brush_parallel_chart));
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

// Returns the path for a given prova point.
            function path(d) {
                return line(dimensions.map(function (p) {
                    if (p == "source" || p == "target")
                        return [position(p), y[p](d[p]["id"].slice(0, -2))];
                    return [position(p), y[p](d[p])];
                }));
            }

            function brushstart() {
                d3.event.sourceEvent.stopPropagation();
            }
        }

        function updateChartDay1() {
            d3.selectAll(".barday1").remove();
            bindedDay1 = d3.entries(attackDay1);
            xScaleDay1 = d3.scaleLinear().domain([0, UPday1.length]).range([0, widthBar]);
            yScaleDay1 = d3.scaleBand()
                .range([svgHeightBar, 0])
                .domain(bindedDay1.map(function (d) {
                    return d.key;
                }))
                .padding(0.2);
            // SVG
            barDay1 = d3.select('#barchartDay1').append('svg')
                .attr("width", svgWidthBar).attr('height', svgHeightBar)
                .attr("class", "barday1");

            barLegenday1 = d3.axisTop()
                .scale(xScaleDay1)
                .tickPadding(8)
                .tickSize(5)
                .ticks(3);

            barDay1.append("g")
                .attr("class", "x axis")
                .call(barLegenday1)
                .attr('transform', 'translate(80,30)');

            // CHART AREA
            valsDay1 = barDay1.append('g').attr('transform', 'translate(60,0)')
                .attr('width', widthBar).attr("height", heightBar);

            function initChartDay1(data) {
                // DATA BIND
                chartDay1 = valsDay1.selectAll('rect').data(data);
                // ENTER
                chartDay1.enter().append('rect')
                    .attr("width", function (d) {
                        return xScaleDay1(d.value);
                    })
                    .attr("height", 10)
                    .attr('x', 20).attr('y', function (d) {
                    return yScaleDay1(d.key) + 25;
                })
                    .attr("fill", "#007BBF")
                    .attr("width", function (d) {
                        return xScaleDay1(d.value)
                    })
                    .on('mousemove', function (d) {
                        tooltipBar.style("left", d3.event.pageX - 50 + "px")
                            .style("top", d3.event.pageY - 70 + "px")
                            .style("opacity", "1")
                            .html((d.key) + ": " + (d.value));
                    })
                    .on('mouseout', function () {
                        tooltipBar.style("opacity", "0");
                    });

                // DATA BIND
                keyDay1 = valsDay1.selectAll('text.key').data(data);
                // ENTER
                keyDay1.enter().append("text").attr("class", "key")
                    .attr("x", 0)
                    .attr("y", function (d) {
                        return yScaleDay1(d.key) + 20;
                    })
                    .attr('dy', 16)
                    .attr("text-anchor", "end")
                    .text(function (d) {
                        return d.key;
                    });

                // UPDATE
                keyDay1.text(function (d) {
                    return d.key
                });
            }

            initChartDay1(bindedDay1);

        }

        function updateChartDay2() {
            d3.selectAll(".barday2").remove();
            var bindedDay2 = d3.entries(attackDay2);
            var xScaleDay2 = d3.scaleLinear().domain([0, UPday2.length]).range([0, widthBar]);
            var yScaleDay2 = d3.scaleBand()
                .range([svgHeightBar, 0])
                .domain(bindedDay2.map(function (d) {
                    return d.key;
                }))
                .padding(0.2);
            // SVG
            var barDay2 = d3.select('#barchartDay2').append('svg')
                .attr("width", svgWidthBar).attr('height', svgHeightBar)
                .attr("class", "barday2");

            var barLegenday2 = d3.axisTop()
                .scale(xScaleDay2)
                .tickPadding(8)
                .tickSize(5)
                .ticks(3);

            barDay2.append("g")
                .attr("class", "x axis")
                .call(barLegenday2)
                .attr('transform', 'translate(80,30)');


            // CHART AREA
            var valsDay1 = barDay2.append('g').attr('transform', 'translate(60,0)')
                .attr('width', widthBar).attr("height", heightBar);

            function initChartDay1(data) {
                // DATA BIND
                var chartDay1 = valsDay1.selectAll('rect').data(data);
                // ENTER
                chartDay1.enter().append('rect')
                    .attr("width", function (d) {
                        return xScaleDay2(d.value);
                    })
                    .attr("height", 10)
                    .attr('x', 20).attr('y', function (d) {
                    return yScaleDay2(d.key) + 20;
                })
                    .attr("fill", "#007BBF")
                    .attr("width", function (d) {
                        return xScaleDay2(d.value)
                    }).on('mousemove', function (d) {
                    tooltipBar.style("left", d3.event.pageX - 50 + "px")
                        .style("top", d3.event.pageY - 70 + "px")
                        .style("opacity", "1")
                        .html((d.key) + ": " + (d.value));
                })
                    .on('mouseout', function () {
                        tooltipBar.style("opacity", "0");
                    });


                // DATA BIND
                var keyDay1 = valsDay1.selectAll('text.key').data(data);
                // ENTER
                keyDay1.enter().append("text").attr("class", "key")
                    .attr("x", 0)
                    .attr("y", function (d) {
                        return yScaleDay2(d.key) + 20;
                    })
                    .attr('dy', 16)
                    .attr("text-anchor", "end")
                    .text(function (d) {
                        return d.key;
                    });

                // UPDATE
                keyDay1.text(function (d) {
                    return d.key
                });
            }

            initChartDay1(bindedDay2);

        }

        function updateChartDay3() {
            d3.selectAll(".barday3").remove();
            var bindedDay3 = d3.entries(attackDay3);
            var xScaleDay3 = d3.scaleLinear().domain([0, UPday3.length]).range([0, widthBar]);
            var yScaleDay3 = d3.scaleBand()
                .range([svgHeightBar, 0])
                .domain(bindedDay3.map(function (d) {
                    return d.key;
                }))
                .padding(0.2);
            // SVG
            var barDay3 = d3.select('#barchartDay3').append('svg')
                .attr("width", svgWidthBar).attr('height', svgHeightBar)
                .attr("class", "barday2");//.style('border','1px solid')

            var barLegenday3 = d3.axisTop()
                .scale(xScaleDay3)
                .tickPadding(8)
                .tickSize(5)
                .ticks(3);

            barDay3.append("g")
                .attr("class", "x axis")
                .call(barLegenday3)
                .attr('transform', 'translate(80,30)');


            // CHART AREA
            var valsDay3 = barDay3.append('g').attr('transform', 'translate(60,0)')
                .attr('width', widthBar).attr("height", heightBar);

            function initChartDay3(data) {
                // DATA BIND
                var chartDay3 = valsDay3.selectAll('rect').data(data);
                // ENTER
                chartDay3.enter().append('rect')
                    .attr("width", function (d) {
                        return xScaleDay3(d.value);
                    })
                    .attr("height", 20)
                    .attr('x', 10).attr('y', function (d) {
                    return yScaleDay3(d.key) + 20;
                })
                    .attr("fill", "#007BBF")
                    .attr("width", function (d) {
                        return xScaleDay3(d.value)
                    })
                    .on('mousemove', function (d) {
                        tooltipBar.style("left", d3.event.pageX - 50 + "px")
                            .style("top", d3.event.pageY - 70 + "px")
                            .style("opacity", "1")
                            .html((d.key) + ": " + (d.value));
                    })
                    .on('mouseout', function () {
                        tooltipBar.style("opacity", "0");
                    });

                // DATA BIND
                var keyDay3 = valsDay3.selectAll('text.key').data(data);
                // ENTER
                keyDay3.enter().append("text").attr("class", "key")
                    .attr("x", 0)
                    .attr("y", function (d) {
                        return yScaleDay3(d.key) + 20;
                    })
                    .attr('dy', 16)
                    .attr("text-anchor", "end")
                    .text(function (d) {
                        return d.key;
                    });

                // UPDATE
                keyDay3.text(function (d) {
                    return d.key
                });
            }

            initChartDay3(bindedDay3);

        }

        function updateChartDay4() {
            d3.selectAll(".barday4").remove();
            var bindedDay4 = d3.entries(attackDay4);
            var xScaleDay4 = d3.scaleLinear().domain([0, UPday4.length]).range([0, widthBar]);
            var yScaleDay4 = d3.scaleBand()
                .range([svgHeightBar, 0])
                .domain(bindedDay4.map(function (d) {
                    return d.key;
                }))
                .padding(0.2);
            // SVG
            var barDay4 = d3.select('#barchartDay4').append('svg')
                .attr("width", svgWidthBar).attr('height', svgHeightBar)
                .attr("class", "barday4");

            var barLegenday4 = d3.axisTop()
                .scale(xScaleDay4)
                .tickPadding(8)
                .tickSize(5)
                .ticks(3);

            barDay4.append("g")
                .attr("class", "x axis")
                .call(barLegenday4)
                .attr('transform', 'translate(80,30)');


            // CHART AREA
            var valsDay4 = barDay4.append('g').attr('transform', 'translate(60,0)')
                .attr('width', widthBar).attr("height", heightBar);

            function initChartDay4(data) {
                // DATA BIND
                var chartDay4 = valsDay4.selectAll('rect').data(data);
                // ENTER
                chartDay4.enter().append('rect')
                    .attr("width", function (d) {
                        return xScaleDay4(d.value);
                    })
                    .attr("height", 10)
                    .attr('x', 20).attr('y', function (d) {
                    return yScaleDay4(d.key) + 20;
                })
                    .attr("fill", "#007BBF")
                    .attr("width", function (d) {
                        return xScaleDay4(d.value)
                    })

                    .on('mousemove', function (d) {
                        tooltipBar.style("left", d3.event.pageX - 50 + "px")
                            .style("top", d3.event.pageY - 70 + "px")
                            .style("opacity", "1")
                            .html((d.key) + ": " + (d.value));
                    })
                    .on('mouseout', function () {
                        tooltipBar.style("opacity", "0");
                    });

                // DATA BIND
                var keyDay4 = valsDay4.selectAll('text.key').data(data);
                // ENTER
                keyDay4.enter().append("text").attr("class", "key")
                    .attr("x", 0)
                    .attr("y", function (d) {
                        return yScaleDay4(d.key) + 20;
                    })
                    .attr('dy', 16)
                    .attr("text-anchor", "end")
                    .text(function (d) {
                        return d.key;
                    });

                // UPDATE
                keyDay4.text(function (d) {
                    return d.key
                });
            }

            initChartDay4(bindedDay4);

        }

        function updateScatterplot() {

        }

    }

    function brush_parallel_chart() {
        for (var i = 0; i < dimensions.length; ++i) {
            if (d3.event.target == y[dimensions[i]].brush) {
                min = d3.event.selection[0];
                max = d3.event.selection[1];
                extents[i] = y[dimensions[i]].domain().filter(function (d) {
                    return (min <= y[dimensions[i]](d)) && (y[dimensions[i]](d) <= max)
                });
            }
        }
        notSelected.style("opacity", function (d) {
            return dimensions.every(function (p, i) {
                if (extents[i][0] == 0 && extents[i][0] == 0)
                    return true;
                if (p === "source" || p === "target") {
                    return extents[i].includes(d[p].id.slice(0, -2));
                } else {
                    return extents[i].includes(d[p]) || extents[i].includes(parseInt(d[p]));
                }
            }) ? "1" : "0";
        });
        if (nodeSelected.size != 0) {
            selected.style("opacity", function (d) {
                return dimensions.every(function (p, i) {
                    if (extents[i][0] == 0 && extents[i][0] == 0)
                        return true;
                    if (p === "source" || p === "target") {
                        return extents[i].includes(d[p].id.slice(0, -2)) && (nodeSelected.has(d.source.id) || (nodeSelected.has(d.target.id)));
                    } else {
                        return (extents[i].includes(d[p]) || extents[i].includes(parseInt(d[p]))) && (nodeSelected.has(d.source.id) || (nodeSelected.has(d.target.id)));
                    }
                }) ? "1" : "0";
            });
        }
    }

    function handleSelectedNode(nodes) {
        d3.select("#PCA").selectAll(".selected")
            .style("display", function (d) {
                if (nodes.has(d.source.id) || (nodes.has(d.target.id)))
                    return "block";
                else
                    return "none";
            });
        d3.select("#PCA").selectAll(".notSelected")
            .style("display", function (d) {
                if (nodes.has(d.source.id) || (nodes.has(d.target.id)))
                    return "none";
                else
                    return "block";
            });
    }

    function handleFocusStrokeOnEdge(edge) {
        d3.select("#PCA").selectAll(".notSelected")
            .style("opacity", function (d) {
                if (edge.source.id == d.source.id || edge.source.id == d.target.id)
                    return "1";
                else
                    return "0";
            })
            .style("stroke-width", "4px");
        d3.select("#PCA").selectAll(".selected")
            .style("opacity", function (d) {
                if (edge.source.id == d.source.id || edge.source.id == d.target.id)
                    return "1";
                else
                    return "0";
            })
            .style("stroke-width", "4px");
    }

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
        content += " <table align='center' id='tooltip'><tr><td>IP address Attacker:</td> <td>" + d.source.id.slice(0, -2) + "</td></tr>" +
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
            content += " <table align='center' id='tooltip'><tr><td>IP address:</td> <td>" + d.id.slice(0, -2) + "</td></tr>" +
                "<tr><td>N° malicious packages sent: </td><td align='left'>" + value + "</td></tr></table>";
        if (d.group === "2")
            content += " <table align='center' id='tooltip'><tr><td>IP address:</td> <td>" + d.id.slice(0, -2) + "</td></tr>" +
                "<tr><td>N° malicious packets delivered: </td><td align='left'>" + value + "</td></tr></table>";
        return content;
    }

    function filterView() {
        displayElements = [];
        selectionLegend1 = parseInt(legendscale.invert(d3.brushSelection(d3.select(".brushLegend").node())[0]));
        selectionLegend2 = parseInt(legendscale.invert(d3.brushSelection(d3.select(".brushLegend").node())[1]));
        console.log(selectionLegend1);
        for (var i = 0; i < data.nodes.length; i++) {
            if ((NumberSentPackets[data.nodes[i]["id"]] >= selectionLegend1 && NumberSentPackets[data.nodes[i]["id"]] <= selectionLegend2) || (NumberDeliveredPackets[data.nodes[i]["id"]] >= selectionLegend1 && NumberDeliveredPackets[data.nodes[i]["id"]] <= selectionLegend2) || (selectionLegend1 < 1 && (NumberDeliveredPackets[data.nodes[i]["id"]] == null || NumberSentPackets[data.nodes[i]["id"]] == null)))
                displayElements.push(data.nodes[i]["id"]);
        }
        handleFilterLegend(displayElements);
    }

    function handleFilterLegend(nodes) {
        d3.select("#graph").selectAll("circle")
            .style("display", function (d) {
                if (nodes.includes(d["id"]) !== false)
                    return "block";
                else
                    return "none"
            });
        edges = [];
        d3.select("#graph").selectAll("line")
            .style("display", function (d) {
                if (nodes.includes(d.source.id) && nodes.includes(d.target.id)) {
                    if (edges.findIndex(x => (x.source == d.source && x.target == d.target)) <= -1) {
                        edges.push(d);
                        return "block";
                    }
                } else {
                    return "none";
                }
            });

        d3.select("#graph").selectAll("text")
            .style("opacity", function (d) {
                if (nodes.includes(d.id))
                    return "1";
                else
                    return "0.1";
            });

        d3.select("#PCA").selectAll(".notSelected")
            .style("display", function (d) {
                if (nodes.includes(d.source.id) || nodes.includes(d.target.id))
                    return "block";
                else
                    return "none";
            })

    }
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
    d3.select("#graph").selectAll("line").transition().duration(150).style("opacity", "1");
    d3.select("#graph").selectAll("circle").transition().duration(150).style("opacity", "1");
}

function handleFocusStroke(stroke) {
    d3.select("#PCA").selectAll(".notSelected")
        .style("opacity", function (d) {
            if (d == stroke)
                return "1";
            else
                return "0";
        })
        .style("stroke-width", "3px");
    d3.select("#PCA").selectAll(".selected")
        .style("opacity", function (d) {
            if (d == stroke)
                return "1";
            else
                return "0";
        })
        .style("stroke-width", "3px");
}

function handleOutFocusStroke() {
    d3.select("#PCA").selectAll(".notSelected")
        .style("opacity", "1")
        .style("stroke-width", "1px");
    d3.select("#PCA").selectAll(".selected")
        .style("opacity", "1")
        .style("stroke-width", "1px");
}

function buildMapPacket(data) {
    NumberDeliveredPackets = [];
    NumberSentPackets = [];
    transferPackets = [];
    if (step === 1) {
        for (var i = 0; i < data.length; i++) {
            if (getAttackPackets(data[i].source.id) == null)
                NumberSentPackets[data[i].source.id] = parseInt(data[i].TotalFwdPackets);
            else
                NumberSentPackets[data[i].source.id] += parseInt(data[i].TotalFwdPackets);
            if (getTargetPackets(data[i].target.id) == null)
                NumberDeliveredPackets[data[i].target.id] = parseInt(data[i].TotalFwdPackets);
            else
                NumberDeliveredPackets[data[i].target.id] += parseInt(data[i].TotalFwdPackets);
            if (getTransferedPackets(data[i].source.id + data[i].target.id) == null)
                transferPackets[data[i].source.id + data[i].target.id] = parseInt(data[i].TotalFwdPackets);
            else
                transferPackets[data[i].source.id + data[i].target.id] += parseInt(data[i].TotalFwdPackets);
        }
    }
    if (step === 0) {
        for (var i = 0; i < data.length; i++) {
            if (getAttackPackets(data[i].source) == null)
                NumberSentPackets[data[i].source] = parseInt(data[i].TotalFwdPackets);
            else
                NumberSentPackets[data[i].source] += parseInt(data[i].TotalFwdPackets);
            if (getTargetPackets(data[i].target) == null)
                NumberDeliveredPackets[data[i].target] = parseInt(data[i].TotalFwdPackets);
            else
                NumberDeliveredPackets[data[i].target] += parseInt(data[i].TotalFwdPackets);
            if (getTransferedPackets(data[i].source + data[i].target) == null)
                transferPackets[data[i].source + data[i].target] = parseInt(data[i].TotalFwdPackets);
            else
                transferPackets[data[i].source + data[i].target] += parseInt(data[i].TotalFwdPackets);
        }
    }
}

function attackPackets(data) {
    attackDay1 = {};
    attackDay2 = {};
    attackDay3 = {};
    attackDay4 = {};
    for (var i = 0; i < data.length; i++) {
        if (data[i].Timestamp.slice(0, -6) === "4/7/2017") {
            if (getPackDay1(data[i].Label) == null) {
                attackDay1[data[i].Label] = 1;
            } else {
                attackDay1[data[i].Label] += 1;
            }
        }
        if (data[i].Timestamp.slice(0, -6) === "5/7/2017") {
            if (getPackDay2(data[i].Label) == null) {
                attackDay2[data[i].Label] = 1;
            } else {
                attackDay2[data[i].Label] += 1;
            }
        }
        if (data[i].Timestamp.slice(0, -6) === "6/7/2017") {
            if (getPackDay3(data[i].Label) == null) {
                attackDay3[data[i].Label] = 1;
            } else {
                attackDay3[data[i].Label] += 1;
            }
        }
        if (data[i].Timestamp.slice(0, -6) === "7/7/2017") {
            if (getPackDay4(data[i].Label) == null) {
                attackDay4[data[i].Label] = 1;
            } else {
                attackDay4[data[i].Label] += 1;
            }
        }


    }
}

// built the scale for the packets
function scalePacket() {
    max = 0;
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
    min = 999999999;
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

function getPackDay1(k) {
    return attackDay1[k];
}

function getPackDay2(k) {
    return attackDay2[k];
}

function getPackDay3(k) {
    return attackDay3[k];
}

function getPackDay4(k) {
    return attackDay4[k];
}

function getTransferedPackets(k) {
    return transferPackets[k];
}

function brushEmpty() {
    var empty = true;
    for (var i = 0; i < extents.length; i++) {
        for (var j = 0; j < 2; j++) {
            if (extents[i][j] != 0)
                return false;
        }
    }
    return empty
}

