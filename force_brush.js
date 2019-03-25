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
// ======= Fine Global variable declaration=======

// extraction of the dataset from the file
d3.json("miserables.json", function (error, datas) {
    if (error) throw error;

    data = datas;


    // building the map packet
    buildMapPacket(data);
    // building the scale packet
    scalePacket(NumberDeliveredPackets);
    //drawing the graph network
    drawGraph(data);
    // drawing the cpa plot
    cpa = new drawCpa();
    // drawing the box plot
    drawBoxPlot(data);
    drawLegend();

    // ================ LISTENER ===================

    // ================ FINE LISTENER ===================
});

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

function drawCpa() {
    var marginSlider = {top: 50, right: 30, bottom: 50, left: 30},
        widthSlider = 440 - marginSlider.left - marginSlider.right,
        heightSlider = 150 - marginSlider.bottom - marginSlider.top;
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
            .tickPadding(12))
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
        .attr("transform", "translate(" + (-18) + " ," + (heightSlider / 2 - 25) + ")");
    var handle2 = svgSlider1.append("g")
        .attr("class", "handle");
    handle2.append("path")
        .attr("transform", "translate(0," + heightSlider / 2 + ")")
        .attr("d", "M 0 -20 V 20");
    var text2 = handle2.append('text')
        .text(formatDate(timeScale1.domain()[0]))
        .attr("transform", "translate(" + (-18) + " ," + (heightSlider / 2 - 25) + ")");
    handle1.attr('transform', 'translate(0,0)');
    handle2.attr('transform', 'translate(' + widthSlider + ",0)");
    // ================= FINE SLIDER GIORNO 4/7/2017 =========================


    // ================= SLIDER GIORNO 5/7/2017 =========================
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
            .tickPadding(12))
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
        .attr("transform", "translate(" + (-18) + " ," + (heightSlider / 2 - 25) + ")");
    var handle4 = svgSlider2.append("g")
        .attr("class", "handle");
    handle4.append("path")
        .attr("transform", "translate(0," + heightSlider / 2 + ")")
        .attr("d", "M 0 -20 V 20");
    var text4 = handle4.append('text')
        .text(formatDate(timeScale2.domain()[0]))
        .attr("transform", "translate(" + (-18) + " ," + (heightSlider / 2 - 25) + ")");
    handle3.attr('transform', 'translate(0,0)');
    handle4.attr('transform', 'translate(' + widthSlider + ",0)");
    // ================= FINE SLIDER GIORNO 5/7/2017 =========================


    // ================= SLIDER GIORNO 6/7/2017 ==============================
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
            .tickPadding(12))
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
        .attr("transform", "translate(" + (-18) + " ," + (heightSlider / 2 - 25) + ")");
    var handle6 = svgSlider3.append("g")
        .attr("class", "handle");
    handle6.append("path")
        .attr("transform", "translate(0," + heightSlider / 2 + ")")
        .attr("d", "M 0 -20 V 20");
    var text6 = handle6.append('text')
        .text(formatDate(timeScale3.domain()[0]))
        .attr("transform", "translate(" + (-18) + " ," + (heightSlider / 2 - 25) + ")");
    handle5.attr('transform', 'translate(0,0)');
    handle6.attr('transform', 'translate(' + widthSlider + ",0)");
    // ================= FINE SLIDER GIORNO 6/7/2017 =========================


    // ================= SLIDER GIORNO 7/7/2017 =========================
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
            .tickPadding(12))
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
        .attr("transform", "translate(" + (-18) + " ," + (heightSlider / 2 - 25) + ")");
    var handle8 = svgSlider4.append("g")
        .attr("class", "handle");
    handle8.append("path")
        .attr("transform", "translate(0," + heightSlider / 2 + ")")
        .attr("d", "M 0 -20 V 20");
    var text8 = handle8.append('text')
        .text(formatDate(timeScale4.domain()[0]))
        .attr("transform", "translate(" + (-18) + " ," + (heightSlider / 2 - 25) + ")");
    handle7.attr('transform', 'translate(0,0)');
    handle8.attr('transform', 'translate(' + widthSlider + ",0)");
    // ================= FINE SLIDER GIORNO 7/7/2017 =========================


    // ================= DRAWING CPA PLOT ====================================
    var margin = {top: 30, right: 200, bottom: 10, left: 265},
        width = 1800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scaleBand().rangeRound([0, width + 100]).padding(.1),
        y = {},
        dragging = {};

    var line = d3.line();

    var svg = d3.select("#PCA").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var Range = [];

    for (var i = 0; i <= height * 20; i = i + 20) {
        Range.push(i);
    }

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
            newData = []
        }

        selection1 = d3.brushSelection(d3.select(".brush1").node());
        selection2 = d3.brushSelection(d3.select(".brush2").node());
        selection3 = d3.brushSelection(d3.select(".brush3").node());
        selection4 = d3.brushSelection(d3.select(".brush4").node());

        if (selection1 == null)
            selection1 = [0, 380];
        if (selection2 == null)
            selection2 = [0, 380];
        if (selection3 == null)
            selection3 = [0, 380];
        if (selection4 == null)
            selection4 = [0, 380];

        newData = data.links.filter(function (d) {
            return checkedValue.includes(d.Timestamp.slice(0, -6)) && ((new Date(moment(d.Timestamp, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm'))) >= timeScale1.invert(selection1[0]) && ((new Date(moment(d.Timestamp, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm')))) <= timeScale1.invert(selection1[1]))
                || checkedValue.includes(d.Timestamp.slice(0, -6)) && (((new Date(moment(d.Timestamp, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm'))) >= (timeScale2.invert(selection2[0]))) && ((new Date(moment(d.Timestamp, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm'))) <= (timeScale2.invert(selection2[1]))))
                || checkedValue.includes(d.Timestamp.slice(0, -6)) && (((new Date(moment(d.Timestamp, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm'))) >= (timeScale3.invert(selection3[0]))) && ((new Date(moment(d.Timestamp, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm'))) <= (timeScale3.invert(selection3[1]))))
                || checkedValue.includes(d.Timestamp.slice(0, -6)) && (((new Date(moment(d.Timestamp, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm'))) >= (timeScale4.invert(selection4[0]))) && ((new Date(moment(d.Timestamp, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm'))) <= (timeScale4.invert(selection4[1]))));
        });

        // EVENT LISTENER SLIDER 1 DATA 4/7/2017
        if (checkedValue.includes("4/7/2017")) {
            d3.select("#svgcontroller1").style("opacity", "1");
            selection1 = d3.brushSelection(d3.select(".brush1").node());
            if (selection1 == null)
                selection1 = [0, 380];
            handle1.attr('transform', 'translate(' + selection1[0] + ",0)");
            text1.text(formatDate(timeScale1.invert(selection1[0])));
            handle2.attr('transform', 'translate(' + selection1[1] + ",0)");
            text2.text(formatDate(timeScale1.invert(selection1[1])));
            console.log(timeScale1.invert(selection1[0]));
        } else {
            d3.select("#svgcontroller1").transition().duration(200).style("opacity", "0");
        }
        // EVENT LISTENER SLIDER 2 DATA 5/7/2017
        if (checkedValue.includes("5/7/2017")) {
            d3.select("#svgcontroller2").style("opacity", "1");
            selection2 = d3.brushSelection(d3.select(".brush2").node());
            console.log(selection2);
            if (selection2 == null)
                selection2 = [0, 380];
            handle3.attr('transform', 'translate(' + selection2[0] + ",0)");
            text3.text(formatDate(timeScale1.invert(selection2[0])));
            handle4.attr('transform', 'translate(' + selection2[1] + ",0)");
            text4.text(formatDate(timeScale1.invert(selection2[1])));
        } else {
            d3.select("#svgcontroller2").transition().duration(200).style("opacity", "0");
        }
        // EVENT LISTENER SLIDER 3 DATA 5/7/2017
        if (checkedValue.includes("6/7/2017")) {
            d3.select("#svgcontroller3").style("opacity", "1");
            selection3 = d3.brushSelection(d3.select(".brush3").node());
            if (selection3 == null)
                selection3 = [0, 380];
            handle5.attr('transform', 'translate(' + selection3[0] + ",0)");
            text5.text(formatDate(timeScale1.invert(selection3[0])));
            handle6.attr('transform', 'translate(' + selection3[1] + ",0)");
            text6.text(formatDate(timeScale1.invert(selection3[1])));
        } else {
            d3.select("#svgcontroller3").transition().duration(200).style("opacity", "0");
        }
        // EVENT LISTENER SLIDER 4 DATA 7/7/2017
        if (checkedValue.includes("7/7/2017")) {
            d3.select("#svgcontroller4").style("opacity", "1");
            selection4 = d3.brushSelection(d3.select(".brush4").node());
            if (selection4 == null)
                selection4 = [0, 380];
            handle7.attr('transform', 'translate(' + selection4[0] + ",0)");
            text7.text(formatDate(timeScale4.invert(selection4[0])));
            handle8.attr('transform', 'translate(' + selection4[1] + ",0)");
            text8.text(formatDate(timeScale4.invert(selection4[1])));
        } else {
            d3.select("#svgcontroller4").transition().duration(200).style("opacity", "0");
        }


        var background;
        var foreground;

        d3.selectAll(".forepath").remove();
        d3.selectAll(".backpath").remove();
        d3.selectAll(".dimension").remove();

        x.domain(dimensions = d3.keys(newData[0]).filter(function (d) {
            if ((d == "id") || (d == "index") || (d == "Timestamp") || (d == "FlowDuration") || (d == "Protocol") || (d == "TotalBackwardPackets") || (d == "TotalLenghtOfBwdPackets")) {
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

        // Add grey background lines for context.
        background = svg.append("g")
            .attr("class", "background")
            .selectAll("path")
            .data(newData)
            .enter().append("path")
            .attr("class", "backpath")
            .attr("d", path);
        // Add blue foreground lines for focus.
        foreground = svg.append("g")
            .attr("class", "foreground")
            .selectAll("path")
            .data(newData)
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

    drawCpa.update = update;
}

function drawBoxPlot(data) {
    //TODO imlementare;
}
function handleSelectedNode(nodes) {
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
                return "0.3";
        });

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

// draw legend for the graph
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

