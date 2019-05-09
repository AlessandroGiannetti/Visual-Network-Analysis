// ======= Global variable declaration =======
var
    // ScalePack of packets for link dimension
    scalePackets,
    colorScalePackets,
    // NumberSentPackets key: [source]  value : total n° of packets
    NumberSentPackets = new Map(),
    // NumberDeliveredPackets key: [target]  value : total n° of packets
    NumberDeliveredPackets = new Map(),
    // transferedPackets key: [source+target]  value : total n° of packets
    transferPackets = new Map(),
    //SVG width and height
    width = 950,
    height = 805;
var data;
var step = 0;
var attackDay1 = new Map();
var attackDay2 = new Map();
var attackDay3 = new Map();
var attackDay4 = new Map();
var extents;
var MapPorts = new Map();
var Ports = [];
var PortSelected = [];
var resetCPA = false;
var select;
var resetLegend = false;
// ======= Fine Global variable declaration=======
// extraction of the dataset from the file
d3.json("miserables.json", function (error, JsonData) {
    if (error) throw error;
    data = JsonData;
    drawData();
});
totPackets = 0;

function drawData() {
    d3.selectAll().remove();

    drawSelect(true, data.links);

    // Node scatterplot without duplicates
    DOTdestination = new Map();
    SourceTarget = new Map();

    // ========================= SLIDERS ===================================
    var marginSlider = {top: 0, right: 13, bottom: 0, left: 112},
        widthSlider = 430 - marginSlider.left - marginSlider.right,
        heightSlider = 110 - marginSlider.bottom - marginSlider.top;
    var formatDate = d3.timeFormat('%H:%M');

    // ================= SLIDER 1 GIORNO 4/7/2017 =========================
    var timeScale1 = d3.scaleTime()
        .domain([new Date(moment("07/04/2017 01:00", 'MMDDYYYY HH:mm')), new Date(moment("07/04/2017 11:00", 'MMDDYYYY HH:mm'))])
        .range([0, widthSlider])
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
            .ticks(6)
            .tickSize(0)
            .tickPadding(45))
        .select(".domain")
        .select(function () {
            return this.parentNode.appendChild(this.cloneNode(true));
        })
        .attr("class", "halo");

    // add the X gridlines
    svgSlider1.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + heightSlider + ")")
        .call(make_x_gridlines(timeScale1)
            .tickSize(-heightSlider + 4)
            .tickFormat("").tickSizeOuter(0)
        );

    drawBoxPlotDay1();
    var brush1 = d3.brushX()
        .extent([[0, 0], [widthSlider, heightSlider]])
        .on("brush", upgradeDay1)
        .on("end", update);
    svgSlider1.append("g")
        .attr("class", "brush1")
        .style("opacity", "0")
        .on('dblclick', resetDay1)
        .call(brush1);
    var handle1 = svgSlider1.append("g")
        .attr("class", "handle");
    handle1.append("path")
        .attr("transform", "translate(0," + heightSlider / 2 + ")")
        .attr("d", "M 0 -40 V 35");
    var text1 = handle1.append('text')
        .text(formatDate(timeScale1.domain()[0]))
        .attr("transform", "translate(" + (-12) + " ," + (heightSlider / 2 - 45) + ")");
    var handle2 = svgSlider1.append("g")
        .attr("class", "handle");
    handle2.append("path")
        .attr("transform", "translate(0," + heightSlider / 2 + ")")
        .attr("d", "M 0 -40 V 35");
    var text2 = handle2.append('text')
        .text(formatDate(timeScale1.domain()[1]))
        .attr("transform", "translate(" + (-12) + " ," + (heightSlider / 2 - 45) + ")");
    handle1.attr('transform', 'translate(0,0)');
    handle2.attr('transform', 'translate(' + widthSlider + ",0)");

    // ================= FINE SLIDER GIORNO 4/7/2017 =========================

    // ====================== SLIDER GIORNO 5/7/2017 =========================
    var timeScale2 = d3.scaleTime()
        .domain([new Date(moment("07/05/2017 02:00", 'MMDDYYYY HH:mm')), new Date(moment("07/05/2017 12:00", 'MMDDYYYY HH:mm'))])
        .range([0, widthSlider])
        .clamp(true);
    var svgSlider2 = d3.select("#controller2").append("svg")
        .attr("width", widthSlider + marginSlider.left + marginSlider.right)
        .attr("height", heightSlider + marginSlider.top + marginSlider.bottom)
        .attr("id", "svgcontroller2")
        .append("g")
        .on('dblclick', resetDay2)
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
            .ticks(6)
            .tickSize(0)
            .tickPadding(45))
        .select(".domain")
        .select(function () {
            return this.parentNode.appendChild(this.cloneNode(true));
        })
        .attr("class", "halo");
    // add the X gridlines
    svgSlider2.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + heightSlider + ")")
        .call(make_x_gridlines(timeScale2)
            .tickSize(-heightSlider + 4)
            .tickFormat("").tickSizeOuter(0)
        );
    drawBoxPlotDay2();
    var brush2 = d3.brushX()
        .extent([[0, 0], [widthSlider, heightSlider]])
        .on("brush", upgradeDay2)
        .on("end", update);
    svgSlider2.append("g")
        .attr("class", "brush2")
        .style("opacity", "0")
        .call(brush2);
    var handle3 = svgSlider2.append("g")
        .attr("class", "handle");
    handle3.append("path")
        .attr("transform", "translate(0," + heightSlider / 2 + ")")
        .attr("d", "M 0 -40 V 35");
    var text3 = handle3.append('text')
        .text(formatDate(timeScale2.domain()[0]))
        .attr("transform", "translate(" + (-12) + " ," + (heightSlider / 2 - 45) + ")");
    var handle4 = svgSlider2.append("g")
        .attr("class", "handle");
    handle4.append("path")
        .attr("transform", "translate(0," + heightSlider / 2 + ")")
        .attr("d", "M 0 -40 V 35");
    var text4 = handle4.append('text')
        .text(formatDate(timeScale2.domain()[1]))
        .attr("transform", "translate(" + (-12) + " ," + (heightSlider / 2 - 45) + ")");
    handle3.attr('transform', 'translate(0,0)');
    handle4.attr('transform', 'translate(' + widthSlider + ",0)");


    // ================= FINE SLIDER GIORNO 5/7/2017 =========================
    // ====================== SLIDER GIORNO 6/7/2017 =========================
    var timeScale3 = d3.scaleTime()
        .domain([new Date(moment("07/06/2017 02:00", 'MMDDYYYY HH:mm')), new Date(moment("07/06/2017 12:00", 'MMDDYYYY HH:mm'))])
        .range([0, widthSlider])
        .clamp(true);
    var svgSlider3 = d3.select("#controller3").append("svg")
        .attr("width", widthSlider + marginSlider.left + marginSlider.right)
        .attr("height", heightSlider + marginSlider.top + marginSlider.bottom)
        .attr("id", "svgcontroller3")
        .append("g")
        .on('dblclick', resetDay3)
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
            .ticks(7)
            .tickSize(0)
            .tickPadding(45))
        .select(".domain")
        .select(function () {
            return this.parentNode.appendChild(this.cloneNode(true));
        })
        .attr("class", "halo");
    // add the X gridlines
    svgSlider3.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + heightSlider + ")")
        .call(make_x_gridlines(timeScale3)
            .tickSize(-heightSlider + 4)
            .tickFormat("").tickSizeOuter(0)
        );
    drawBoxPlotDay3();
    var brush3 = d3.brushX()
        .extent([[0, 0], [widthSlider, heightSlider]])
        .on("brush", upgradeDay3)
        .on("end", update);
    svgSlider3.append("g")
        .attr("class", "brush3")
        .style("opacity", "0")
        .call(brush3);
    var handle5 = svgSlider3.append("g")
        .attr("class", "handle");
    handle5.append("path")
        .attr("transform", "translate(0," + heightSlider / 2 + ")")
        .attr("d", "M 0 -40 V 35");
    var text5 = handle5.append('text')
        .text(formatDate(timeScale3.domain()[0]))
        .attr("transform", "translate(" + (-12) + " ," + (heightSlider / 2 - 45) + ")");
    var handle6 = svgSlider3.append("g")
        .attr("class", "handle");
    handle6.append("path")
        .attr("transform", "translate(0," + heightSlider / 2 + ")")
        .attr("d", "M 0 -40 V 35");
    var text6 = handle6.append('text')
        .text(formatDate(timeScale3.domain()[1]))
        .attr("transform", "translate(" + (-12) + " ," + (heightSlider / 2 - 45) + ")");
    handle5.attr('transform', 'translate(0,0)');
    handle6.attr('transform', 'translate(' + widthSlider + ",0)");


    // ================= FINE SLIDER GIORNO 6/7/2017 =========================
    // ====================== SLIDER GIORNO 7/7/2017 =========================

    var timeScale4 = d3.scaleTime()
        .domain([new Date(moment("07/07/2017 09:00", 'MMDDYYYY HH:mm')), new Date(moment("07/07/2017 17:00", 'MMDDYYYY HH:mm'))])
        .range([0, widthSlider])
        .clamp(true);


    var svgSlider4 = d3.select("#controller4").append("svg")
        .attr("width", widthSlider + marginSlider.left + marginSlider.right)
        .attr("height", heightSlider + marginSlider.top + marginSlider.bottom)
        .attr("id", "svgcontroller4")
        .append("g")
        .on('dblclick', resetDay4)
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
            .ticks(10)
            .tickSize(0)
            .tickPadding(45))
        .select(".domain")
        .select(function () {
            return this.parentNode.appendChild(this.cloneNode(true));
        })
        .attr("class", "halo");
    // add the X gridlines
    svgSlider4.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + heightSlider + ")")
        .call(make_x_gridlines(timeScale4)
            .tickSize(-heightSlider + 4)
            .tickFormat("").tickSizeOuter(0)
        );
    drawBoxPlotDay4();
    var brush4 = d3.brushX()
        .extent([[0, 0], [widthSlider, heightSlider]])
        .on("brush", upgradeDay4)
        .on("end", update);
    svgSlider4.append("g")
        .attr("class", "brush4")
        .style("opacity", "0")
        .call(brush4);
    var handle7 = svgSlider4.append("g")
        .attr("class", "handle");
    handle7.append("path")
        .attr("transform", "translate(0," + heightSlider / 2 + ")")
        .attr("d", "M 0 -40 V 35");
    var text7 = handle7.append('text')
        .text(formatDate(timeScale4.domain()[0]))
        .attr("transform", "translate(" + (-12) + " ," + (heightSlider / 2 - 45) + ")");
    var handle8 = svgSlider4.append("g")
        .attr("class", "handle");
    handle8.append("path")
        .attr("transform", "translate(0," + heightSlider / 2 + ")")
        .attr("d", "M 0 -40 V 35");
    var text8 = handle8.append('text')
        .text(formatDate(timeScale4.domain()[1]))
        .attr("transform", "translate(" + (-12) + " ," + (heightSlider / 2 - 45) + ")");
    handle7.attr('transform', 'translate(0,0)');
    handle8.attr('transform', 'translate(' + widthSlider + ",0)");


    function upgradeDay1() {
        // EVENT LISTENER SLIDER 1 DATA 4/7/2017
        selection1 = d3.brushSelection(d3.select(".brush1").node());
        handle1.attr('transform', 'translate(' + selection1[0] + ",0)");
        text1.text(formatDate(timeScale1.invert(selection1[0])));
        handle2.attr('transform', 'translate(' + selection1[1] + ",0)");
        text2.text(formatDate(timeScale1.invert(selection1[1])));
    }

    function upgradeDay2() {
        // EVENT LISTENER SLIDER 1 DATA 4/7/2017
        selection2 = d3.brushSelection(d3.select(".brush2").node());
        handle3.attr('transform', 'translate(' + selection2[0] + ",0)");
        text3.text(formatDate(timeScale2.invert(selection2[0])));
        handle4.attr('transform', 'translate(' + selection2[1] + ",0)");
        text4.text(formatDate(timeScale2.invert(selection2[1])));
    }

    function upgradeDay3() {
        // EVENT LISTENER SLIDER 1 DATA 4/7/2017
        selection3 = d3.brushSelection(d3.select(".brush3").node());
        handle5.attr('transform', 'translate(' + selection3[0] + ",0)");
        text5.text(formatDate(timeScale3.invert(selection3[0])));
        handle6.attr('transform', 'translate(' + selection3[1] + ",0)");
        text6.text(formatDate(timeScale3.invert(selection3[1])));
    }

    function upgradeDay4() {
        // EVENT LISTENER SLIDER 1 DATA 4/7/2017
        selection4 = d3.brushSelection(d3.select(".brush4").node());
        handle7.attr('transform', 'translate(' + selection4[0] + ",0)");
        text7.text(formatDate(timeScale4.invert(selection4[0])));
        handle8.attr('transform', 'translate(' + selection4[1] + ",0)");
        text8.text(formatDate(timeScale4.invert(selection4[1] - 0.1)));
    }

    function resetDay1() {
        selection1[0] = 0;
        selection1[1] = widthSlider;
        handle1.attr('transform', 'translate(' + selection1[0] + ",0)");
        text1.text(formatDate(timeScale1.invert(selection1[0])));
        handle2.attr('transform', 'translate(' + selection1[1] + ",0)");
        text2.text(formatDate(timeScale1.invert(selection1[1])));
    }

    function resetDay2() {
        selection2[0] = 0;
        selection2[1] = widthSlider;
        handle3.attr('transform', 'translate(' + selection2[0] + ",0)");
        text3.text(formatDate(timeScale2.invert(selection2[0])));
        handle4.attr('transform', 'translate(' + selection2[1] + ",0)");
        text4.text(formatDate(timeScale2.invert(selection2[1])));
    }

    function resetDay3() {
        selection3[0] = 0;
        selection3[1] = widthSlider;
        handle5.attr('transform', 'translate(' + selection3[0] + ",0)");
        text5.text(formatDate(timeScale3.invert(selection3[0])));
        handle6.attr('transform', 'translate(' + selection3[1] + ",0)");
        text6.text(formatDate(timeScale3.invert(selection3[1])));
    }

    function resetDay4() {
        selection4[0] = 0;
        selection4[1] = widthSlider;
        handle7.attr('transform', 'translate(' + selection4[0] + ",0)");
        text7.text(formatDate(timeScale4.invert(selection4[0])));
        handle8.attr('transform', 'translate(' + selection4[1] + ",0)");
        text8.text(formatDate(timeScale4.invert(selection4[1])));
    }

    function drawBoxPlotDay1() {

        // Compute summary statistics used for the box:
        var outlier = data.links.filter(function (d) {
            return ((new Date(moment(d.Timestamp, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm'))) >= timeScale1.invert(0) && ((new Date(moment(d.Timestamp, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm')))) <= timeScale1.invert(widthSlider))
        });

        g2 = new Map();
        for (var i = 0; i < outlier.length; i++) {
            if (g2.has(outlier[i].Timestamp) === false)
                g2.set(outlier[i].Timestamp, parseInt(outlier[i].TotalFwdPackets));
            else
                g2.set(outlier[i].Timestamp, g2.get(outlier[i].Timestamp) + parseInt(outlier[i].TotalFwdPackets));
        }
        g2 = new Map([...g2.entries()]);
        day1Dot = Array.from(g2.keys()).sort(function (a, b) {
            return new Date(a) - new Date(b);
        });
        colorScaleDay1 = d3.scaleSequential(d3.interpolateCool).domain([0, d3.max(Array.from(g2.values()))]);

        var i = 15;
        svgSlider1.selectAll(".dot")
            .data(day1Dot)
            //.data(newData)
            .enter().append("circle")
            .attr("class", "dotDay")
            .attr("r", 2.6)
            .attr("cy", function () {
                if (i >= 87)
                    i = 15;
                else
                    i += 7;
                return i;
            })
            .attr("cx", function (d) {
                return (timeScale1(new Date(moment(d, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm'))))
            })
            .style("fill", function (d) {
                return colorScaleDay1(g2.get(d))
            });

        continuous("#controller1", colorScaleDay1, 505, 427)


    }

    function drawBoxPlotDay2() {

// Compute summary statistics used for the box:
        var outlier = data.links.filter(function (d) {
            return ((new Date(moment(d.Timestamp, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm'))) >= timeScale2.invert(0) && ((new Date(moment(d.Timestamp, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm')))) <= timeScale2.invert(widthSlider))
        });

        g2 = new Map();
        for (var i = 0; i < outlier.length; i++) {
            if (g2.has(outlier[i].Timestamp) === false)
                g2.set(outlier[i].Timestamp, parseInt(outlier[i].TotalFwdPackets));
            else
                g2.set(outlier[i].Timestamp, g2.get(outlier[i].Timestamp) + parseInt(outlier[i].TotalFwdPackets));
        }
        g2 = new Map([...g2.entries()]);
        day2Dot = Array.from(g2.keys()).sort(function (a, b) {
            return new Date(a) - new Date(b);
        });
        colorScaleDay2 = d3.scaleSequential(d3.interpolateCool).domain([0, d3.max(Array.from(g2.values()))]);

        var i = 15;
        svgSlider2.selectAll(".dot")
            .data(day2Dot)
            //.data(newData)
            .enter().append("circle")
            .attr("class", "dotDay")
            .attr("r", 2.6)
            .attr("cy", function () {
                if (i >= 87)
                    i = 15;
                else
                    i += 6;
                return i;
            })
            .attr("cx", function (d) {
                return (timeScale2(new Date(moment(d, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm'))))
            })
            .style("fill", function (d) {
                return colorScaleDay2(g2.get(d))
            });

        continuous("#controller2", colorScaleDay2, 620, 427)
    }

    function drawBoxPlotDay3() {
        // Compute summary statistics used for the box:
        var outlier = data.links.filter(function (d) {
            return ((new Date(moment(d.Timestamp, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm'))) >= timeScale3.invert(0) && ((new Date(moment(d.Timestamp, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm')))) <= timeScale3.invert(widthSlider))
        });

        g2 = new Map();
        for (var i = 0; i < outlier.length; i++) {
            if (g2.has(outlier[i].Timestamp) === false)
                g2.set(outlier[i].Timestamp, parseInt(outlier[i].TotalFwdPackets));
            else
                g2.set(outlier[i].Timestamp, g2.get(outlier[i].Timestamp) + parseInt(outlier[i].TotalFwdPackets));
        }
        g2 = new Map([...g2.entries()]);
        day3Dot = Array.from(g2.keys()).sort(function (a, b) {
            return new Date(a) - new Date(b);
        });
        colorScaleDay3 = d3.scaleSequential(d3.interpolateCool).domain([0, d3.max(Array.from(g2.values()))]);

        var i = 15;
        svgSlider3.selectAll(".dot")
            .data(day3Dot)
            //.data(newData)
            .enter().append("circle")
            .attr("class", "dotDay")
            .attr("r", 2.6)
            .attr("cy", function () {
                if (i >= 87)
                    i = 15;
                else
                    i += 6;
                return i;
            })
            .attr("cx", function (d) {
                return (timeScale3(new Date(moment(d, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm'))))
            })
            .style("fill", function (d) {
                return colorScaleDay3(g2.get(d))
            });

        continuous("#controller3", colorScaleDay3, 735, 427)
    }

    function drawBoxPlotDay4() {
        // Compute summary statistics used for the box:
        var outlier = data.links.filter(function (d) {
            return ((new Date(moment(d.Timestamp, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm'))) >= timeScale4.invert(0) && ((new Date(moment(d.Timestamp, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm')))) <= timeScale4.invert(widthSlider))
        });

        g2 = new Map();
        for (var i = 0; i < outlier.length; i++) {
            if (g2.has(outlier[i].Timestamp) === false)
                g2.set(outlier[i].Timestamp, parseInt(outlier[i].TotalFwdPackets));
            else
                g2.set(outlier[i].Timestamp, g2.get(outlier[i].Timestamp) + parseInt(outlier[i].TotalFwdPackets));
        }
        g2 = new Map([...g2.entries()]);
        day4Dot = Array.from(g2.keys()).sort(function (a, b) {
            return new Date(a) - new Date(b);
        });
        colorScaleDay4 = d3.scaleSequential(d3.interpolateCool).domain([0, d3.max(Array.from(g2.values()))]);

        var i = 15;
        svgSlider4.selectAll(".dot")
            .data(day4Dot)
            //.data(newData)
            .enter().append("circle")
            .attr("class", "dotDay")
            .attr("r", 2.6)
            .attr("cy", function () {
                if (i >= 87)
                    i = 15;
                else
                    i += 7;
                return i;
            })
            .attr("cx", function (d) {
                return (timeScale4(new Date(moment(d, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm'))))
            })
            .style("fill", function (d) {
                return colorScaleDay4(g2.get(d))
            });

        continuous("#controller3", colorScaleDay3, 850, 427)

    }

    function make_x_gridlines(xAxis) {
        return d3.axisBottom(xAxis)
    }

    function continuous(selector_id, colorscale, top, left) {
        var legendheight = 120,
            legendwidth = 80,
            margin = {top: 10, right: 60, bottom: 10, left: 8};

        var canvas = d3.select(selector_id)
            .append("canvas")
            .attr("height", legendheight - margin.top - margin.bottom)
            .attr("width", 1)
            .style("height", (legendheight - margin.top - margin.bottom) + "px")
            .style("width", (legendwidth - margin.left - margin.right) + "px")
            .style("border", "1px solid #000")
            .style("position", "absolute")
            .style("top", (top) + "px")
            .style("left", (left) + "px")
            .node();

        var ctx = canvas.getContext("2d");

        var legendscale = d3.scaleLinear()
            .range([1, legendheight - margin.top - margin.bottom])
            .domain(colorscale.domain());

        // image data hackery based on http://bl.ocks.org/mbostock/048d21cf747371b11884f75ad896e5a5
        var image = ctx.createImageData(1, legendheight);
        d3.range(legendheight).forEach(function (i) {
            var c = d3.rgb(colorscale(legendscale.invert(i)));
            image.data[4 * i] = c.r;
            image.data[4 * i + 1] = c.g;
            image.data[4 * i + 2] = c.b;
            image.data[4 * i + 3] = 255;
        });
        ctx.putImageData(image, 0, 0);

        legendaxis = d3.axisRight()
            .scale(legendscale)
            .tickValues(legendscale.ticks(3).concat(legendscale.domain())).tickSize(4);

        var svg = d3.select(selector_id)
            .append("svg")
            .attr("height", (legendheight) + "px")
            .attr("width", (legendwidth) + "px")
            .style("position", "absolute")
            .style("left", (left - 2) + "px")
            .style("top", (top - 11) + "px");

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + (legendwidth - margin.left - margin.right + 3) + "," + (margin.top) + ")")
            .call(legendaxis);
    }

    // =============================== Legend Days =================================


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
    //====================================== BAR CHART =============================
    var widthBar = 235, heightBar = 20, svgWidthBar = 415, svgHeightBar = 115, tooltipBar;
    //==================================FINE BAR CHART =============================
    // ========================== DRAWING GRAPH ================================
    var edges = [], nodeSelected = new Set();
    var widthGRAPH = 670, heightGRAPH = 500;
    // create the svg on
    var svgGRAPH = d3.select("#graph").append("svg")
        .attr("width", widthGRAPH)
        .attr("height", heightGRAPH);
    var tooltipLink,  // FINESTRA SU LINK
        tooltipNode,  // FINESTRA SU NODI
        node, link, textElements;

    // GRAPH SIMULATION
    var simulation = d3.forceSimulation(data.nodes)
        .force('forceX', d3.forceX(function (d) {
            if (d.id === "205.174.165.73sx")
                return 660;
            if (d.id === "205.174.165.73dx")
                return 660;
            if (d.group === '1')
                return 410;
            if (d.group === '2')
                return 900;
        }).strength(1))
        .force('collision', d3.forceCollide().radius((d => (d.id === '205.174.165.73sx' || d.id === '205.174.165.73dx') ? 0 : 22)))
        .force("charge", d3.forceManyBody().strength((d => (d.id === '205.174.165.73sx' || d.id === '205.174.165.73dx') ? 5 : 0)).distanceMin(1).distanceMax(2000))
        .force('center', d3.forceCenter(widthGRAPH / 2 + 20, heightGRAPH / 2))
        .force("link", d3.forceLink().distance(900).strength(0).id(function (d) {
            return d.id;
        }))
        .alphaTarget(0);

    simulation.nodes(data.nodes).on("tick", ticked);
    // ==================FINE DICHIARAZIONI GRAPH =============================
    // ===================== DICHIARAZIONI LEGEND =============================
    var heightLegend = 500,
        widthLegend = 100,
        marginLegend = {top: 20, right: 80, bottom: 60, left: 2},
        canvas, ctx, legendscale, image, legendaxis, svgLegend, c, brushLegend;
    // ==============  FINE DICHIARAZIONI LEGEND ==============================
    // ================= DICHIARAZIONI CPA ====================================
    var marginCPA = {top: 28, right: 0, bottom: 8, left: 148},
        widthCPA = 1287 - marginCPA.left - marginCPA.right,
        heightCPA = 500 - marginCPA.top - marginCPA.bottom;
    var x = d3.scaleBand().rangeRound([0, widthCPA + 180]),
        y = {},
        dragging = {},
        line = d3.line();
    var svgCPA;


    // ================= FINE DICHIARAZIONI CPA ==================================

    // building the map packet
    buildMapPacket(data.links);
    // building the scale packet
    scalePacket();

    var LinkGraph = data.links.filter(function (d) {
        return LinkGraphPlot(d) === true
    });
    edges = [];

    function LinkGraphPlot(d) {
        if ((edges.findIndex(x => (x.source == d.source && x.target == d.target)) <= -1) && PortSelected.includes(d.DestinationPort) == true) {
            edges.push(d);
            return true;
        } else {
            return false;
        }
    }

    function initGraph() {

        //declaration of the tooltipLink (extra info on over)
        tooltipLink = d3.select('body').append('div')
            .style('display', "none")
            .attr('class', 'd3-tip');

        tooltipNode = d3.select('body').append('div')
            .style('display', "none")
            .attr('class', 'd3-tip');

        //declaration of the link of the network
        link = svgGRAPH.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(LinkGraph)
            .enter().append("line")
            .on('mousemove', function (d) {
                tooltipLink.transition().duration(150)
                    .style('display', "block");
                tooltipLink.html(contentLinkTip(d))
                    .style('left', (d3.event.pageX + 50) + 'px')
                    .style('top', (d3.event.pageY) + 'px');
                handleMouseMoveEdge(d);
                handleFocusStrokeOnEdge(d);
            })
            .on('mouseout', function () {
                tooltipLink.transition().duration(150)
                    .style('display', "none");
                handleMouseOutEdge();
                handleOutFocusStroke();
                focusDotOnTime(data.links);
            })
            .attr("stroke-width", function (d) {
                if (transferPackets.get(d.source + d.target) == null)
                    return 0;
                else
                    return scalePackets(transferPackets.get(d.source + d.target)[0]);
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
                    if (colorScalePackets(NumberSentPackets.get(d.id)) != null)
                        return colorScalePackets(NumberSentPackets.get(d.id));
                    else
                        return colorScalePackets(0);
                if (d.group === "2")
                    if (colorScalePackets(NumberDeliveredPackets.get(d.id)) != null)
                        return colorScalePackets(NumberDeliveredPackets.get(d.id));
                    else
                        return colorScalePackets(0);
            }).on("click", function (d) {
                d3.select(this).transition().duration(200).style("stroke", "orangered");
                nodeSelected.add(d3.select(this)._groups[0][0].__data__.id);
                handleSelectedNode(nodeSelected);
                FocusDotScatterPlot(nodeSelected);
                updateChartDay1();
                updateChartDay2();
                updateChartDay3();
                updateChartDay4();
                filterView();
            })
            .on('dblclick', function () {
                d3.select(this).transition().duration(200).style("stroke", "none");
                nodeSelected.delete(d3.select(this)._groups[0][0].__data__.id);
                handleSelectedNode(nodeSelected);
                UnfocusDotScatterPlot(nodeSelected);
                updateChartDay1();
                updateChartDay2();
                updateChartDay3();
                updateChartDay4();
                filterView();
            })
            .on('mouseover', function (d) {
                handleMouseOverNode(d3.select(this));
                tooltipNode.transition().duration(150)
                    .style('display', "block");
                tooltipNode.html(contentNodeTip(d))
                    .style('left', (d3.event.pageX + 50) + 'px')
                    .style('top', (d3.event.pageY) + 'px');
            })
            .on('mouseout', function () {
                tooltipNode.transition().duration(150)
                    .style('display', "none");
                handleMouseOutNode();
                handleOutFocusStroke();
                focusDotOnTime(data.links);
            });

        svgGRAPH.append("g")
            .append("text")
            .attr("class", "label")
            .attr("x", widthGRAPH / 4 - 53)
            .attr("y", 17)
            .style("text-anchor", "end")
            .style("font-size", "13px")
            .text("Sources");

        svgGRAPH.append("g")
            .append("text")
            .attr("class", "label")
            .attr("x", widthGRAPH / 2 + 28)
            .attr("y", 17)
            .style("text-anchor", "end")
            .style("font-size", "13px")
            .text("Firewall");

        svgGRAPH.append("g")
            .append("text")
            .attr("class", "label")
            .attr("x", widthGRAPH - 70)
            .attr("y", 17)
            .style("text-anchor", "end")
            .style("font-size", "13px")
            .text("Target");

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
                    return "begin";
                else {
                    if (d.group == "1") return "end"; else return "start";
                }
            })
            // riflette gli indirizzi IP a destra e sinistra
            .attr("dx", function (d) {
                if (d.group == "1") return -20; else return 20;
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

    // filtraggio punti scatterplot
    var DestinationScatterplot = data.links.filter(function (d) {
        return AddTargetPort(d) === true
    });

    // ======================== SCATTERPLOT ===============================
    var marginScatterPlot = {top: 12, right: 0, bottom: 35, left: 70},
        widthScatterPlot = 1080 - marginScatterPlot.left - marginScatterPlot.right,
        heightScatterPlot = 470 - marginScatterPlot.top - marginScatterPlot.bottom,
        ip_destinationPorts_packets = new Map(),
        xScatterPlot, yScatterPlot,
        xAxisScatterPlot, yAxisScatterPlot,
        IPAddress = new Set();

    // =============== Fine DICHIARAZIONE SCATTERPLOT =====================

    // =============================== TRIGGER UPDATE =======================
    d3.selectAll(".custom-control-input").on("change", update);
    update();

    function update() {
        var TargetPort = [];
        var SourceIP = [];
        var TargetIP = [];
        var TotalFwdPackets = [];
        var Label = [];

        showAllGraph();

        var checkedValue = [];
        d3.selectAll('.custom-control-input').each(function () {
            cb = d3.select(this);
            if (cb.property("checked")) {
                checkedValue.push(cb.property("value"));
            }
        });

        selection1 = d3.brushSelection(d3.select(".brush1").node());
        if (selection1 == null)
            selection1 = [0, widthSlider];
        selection2 = d3.brushSelection(d3.select(".brush2").node());
        if (selection2 == null)
            selection2 = [0, widthSlider];
        selection3 = d3.brushSelection(d3.select(".brush3").node());
        if (selection3 == null)
            selection3 = [0, widthSlider];
        selection4 = d3.brushSelection(d3.select(".brush4").node());
        if (selection4 == null)
            selection4 = [0, widthSlider];
        // filtraggio dei dati in base ai giorno e all'ora e alle porte selezionate
        newData = data.links.filter(function (d) {
            return (checkedValue.includes(d.Timestamp.slice(0, -6)) && ((new Date(moment(d.Timestamp, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm'))) >= timeScale1.invert(selection1[0]) && ((new Date(moment(d.Timestamp, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm')))) <= timeScale1.invert(selection1[1]))
                || checkedValue.includes(d.Timestamp.slice(0, -6)) && (((new Date(moment(d.Timestamp, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm'))) >= (timeScale2.invert(selection2[0]))) && ((new Date(moment(d.Timestamp, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm'))) <= (timeScale2.invert(selection2[1]))))
                || checkedValue.includes(d.Timestamp.slice(0, -6)) && (((new Date(moment(d.Timestamp, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm'))) >= (timeScale3.invert(selection3[0]))) && ((new Date(moment(d.Timestamp, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm'))) <= (timeScale3.invert(selection3[1]))))
                || checkedValue.includes(d.Timestamp.slice(0, -6)) && (((new Date(moment(d.Timestamp, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm'))) >= (timeScale4.invert(selection4[0]))) && ((new Date(moment(d.Timestamp, 'DDMMYYYY HH:mm').format('MM/DD/YYYY HH:mm'))) <= (timeScale4.invert(selection4[1]))))
            );
        });
        if (step === 1) {
            drawSelect(false, newData);
            d3.select("#port").on("dblclick", function () {
                drawSelect(true, data.links);
                update()
            });
        }
        newData = newData.filter(function (d) {
            return PortSelected.includes(d.DestinationPort)
        });


        // se non è lo step iniziale eseguo queste funzioni
        if (step === 1) {
            buildMapPacket(newData);
            scalePacket(NumberDeliveredPackets);
            updateGraph(newData);
        }
        step = 1;
        updateNumberOfAttack(newData);
        updateLegend();
        updateCPA(newData);
        updateScatterPlot(newData);
        attackPackets(newData);
        updateChartDay1();
        updateChartDay2();
        updateChartDay3();
        updateChartDay4();

        handleSelectedNode(nodeSelected);
        FocusDotScatterPlot(nodeSelected);
        focusDotOnTime(newData);

        function updateGraph() {

            LinkGraph = newData.filter(function (d) {
                return LinkGraphPlot(d) === true && PortSelected.includes(d.DestinationPort)
            });
            edges = [];

            d3.selectAll(".d3-tip").remove();

            //declaration of the tooltipLink (extra info on over)
            tooltipLink = d3.select('body').append('div')
                .style('display', "none")
                .attr('class', 'd3-tip');

            tooltipNode = d3.select('body').append('div')
                .style('display', "none")
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
                        if (colorScalePackets(NumberSentPackets.get(d.id)) != null)
                            return colorScalePackets(NumberSentPackets.get(d.id));
                        else
                            return colorScalePackets(0);
                    if (d.group === "2")
                        if (colorScalePackets(NumberDeliveredPackets.get(d.id)) != null)
                            return colorScalePackets(NumberDeliveredPackets.get(d.id));
                        else
                            return colorScalePackets(0);
                }).on("click", function () {
                    d3.select(this).transition().duration(200).style("stroke", "orangered");
                    nodeSelected.add(d3.select(this)._groups[0][0].__data__.id);
                    handleSelectedNode(nodeSelected);
                    FocusDotScatterPlot(nodeSelected);
                    filterView();
                    updateChartDay1();
                    updateChartDay2();
                    updateChartDay3();
                    updateChartDay4();
                })
                .on('dblclick', function () {
                    d3.select(this).transition().duration(200).style("stroke", "none");
                    nodeSelected.delete(d3.select(this)._groups[0][0].__data__.id);
                    handleSelectedNode(nodeSelected);
                    UnfocusDotScatterPlot(nodeSelected);
                    filterView();
                    updateChartDay1();
                    updateChartDay2();
                    updateChartDay3();
                    updateChartDay4();
                })
                .on('mouseover', function (d) {
                    handleMouseOverNode(d3.select(this));
                    tooltipNode.transition().duration(150)
                        .style('display', "block");
                    tooltipNode.html(contentNodeTip(d))
                        .style('left', (d3.event.pageX + 50) + 'px')
                        .style('top', (d3.event.pageY) + 'px');
                })
                .on('mouseout', function () {
                    tooltipNode.transition().duration(150)
                        .style('display', "none");
                    handleMouseOutNode();
                    handleOutFocusStroke();
                    focusDotOnTime(newData);
                    if (!brushEmpty())
                        brush_parallel_chart();
                });

            textElements = textElements.data(data.nodes, function (d) {
                return d.id
            });
            textElements.exit().remove();
            textElements = textElements.enter().append("text").merge(textElements);

            link = link.data(LinkGraph);
            link.exit().remove();
            link = link.enter().append("line").merge(link)
                .on('mousemove', function (d) {
                    tooltipLink.transition().duration(150)
                        .style('display', "block");
                    tooltipLink.html(contentLinkTip(d))
                        .style('left', (d3.event.pageX + 50) + 'px')
                        .style('top', (d3.event.pageY) + 'px');
                    handleMouseMoveEdge(d);
                })
                .on('mouseout', function () {
                    tooltipLink.transition().duration(150)
                        .style('display', "none");
                    handleMouseOutEdge();
                    handleOutFocusStroke();
                    focusDotOnTime(newData);
                    if (!brushEmpty())
                        brush_parallel_chart()
                })
                .attr("stroke-width", function (d) {
                    if (transferPackets.get(d.source.id + d.target.id) == null)
                        return 0;
                    else
                        return scalePackets(transferPackets.get(d.source.id + d.target.id)[0]);
                });

            // starting the simulation
            simulation.nodes(data.nodes);
            simulation.force("link").links(LinkGraph);
            simulation.alpha(0).restart();
        }

        function updateLegend() {
            d3.selectAll(".legendScale").remove();
            d3.selectAll(".canvas").remove();

            canvas = d3.select("#legend")
                .style("height", heightLegend + "px")
                .style("width", widthLegend + "px")
                .style("position", "relative")
                .append("canvas")
                .attr("height", heightLegend - marginLegend.top - marginLegend.bottom)
                .attr("width", 1)
                .attr("class", "canvas")
                .style("height", (heightLegend - marginLegend.top - marginLegend.bottom) + "px")
                .style("width", (widthLegend - marginLegend.left - marginLegend.right) + "px")
                .style("border", "1px solid #000")
                .style("position", "absolute")
                .style("top", "25px")
                .style("left", "30px")
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
                .tickValues(legendscale.ticks(7).concat(legendscale.domain()));


            svgLegend = d3.select("#legend")
                .append("svg")
                .attr("class", "legendScale")
                .attr("height", (heightLegend) + "px")
                .attr("width", (widthLegend) + "px")
                .style("position", "absolute")
                .style("left", "30px")
                .style("top", "5px")
                .on("dblclick", function () {
                    resetLegend = true;
                    filterView();
                });

            brushLegend = d3.brushY()
                .extent([[0, 0], [widthLegend - marginLegend.left - marginLegend.right, heightLegend - marginLegend.top - 20]])
                .on("brush", filterView);

            svgLegend.append("g")
                .attr("class", "brushLegend")
                .attr("transform", "translate(" + (0) + "," + (marginLegend.top) + ")")
                .call(brushLegend);

            svgLegend
                .append("g")
                .attr("transform", "translate(" + (widthLegend - marginLegend.left - marginLegend.right + 3) + "," + (marginLegend.top) + ")")
                .attr("class", "y axis")
                .call(legendaxis);

            svgLegend.append("g")
                .append("text")
                .attr("class", "label")
                .attr("x", widthLegend / 2 + 44)
                .attr("y", 12)
                .style("text-anchor", "end")
                .style("font-size", "13px")
                .text("N° Malicious Packages");
        }

        function updateNumberOfAttack(newData) {
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

            // UPDATE number of attack per day
            d3.select("#day").html((newData.length) + " / <b>" + (data.links.length) + "</b>" + " (Tot)");
            d3.select("#day1").html(UPday1.length + " / <b>" + day1.length + "</b>");
            d3.select("#day2").html(UPday2.length + " / <b>" + day2.length + "</b>");
            d3.select("#day3").html(UPday3.length + " / <b>" + day3.length + "</b>");
            d3.select("#day4").html(UPday4.length + " / <b>" + day4.length + "</b>");

        }

        function updateCPA() {
            //===== remove the previous data=========
            d3.selectAll(".cpa").remove();
            // =============== update the cpa ==================

            svgCPA = d3.select("#PCA").append("svg")
                .attr("class", "cpa")
                .attr("width", widthCPA)
                .attr("height", heightCPA + marginCPA.top + marginCPA.bottom)
                .call(d3.zoom().scaleExtent([1, 10]).on("zoom", function () {
                    d3.event.transform.x = Math.min(150, Math.max(d3.event.transform.x, widthCPA - widthCPA * d3.event.transform.k) + 130);
                    d3.event.transform.y = Math.min(28, Math.max(d3.event.transform.y, heightCPA - heightCPA * d3.event.transform.k) + 30);
                    svgCPA.attr("transform", d3.event.transform);
                })).on("dblclick.zoom", null)
                .append("g")
                .attr("transform", "translate(" + marginCPA.left + "," + marginCPA.top + ")");

            // prendere i dati da un json senza duplicati
            TargetPort = [];
            SourceIP = [];
            TargetIP = [];
            TotalFwdPackets = [];
            Label = [];

            for (var i = 0; i < newData.length; i++) {
                SourceIP.push(newData[i].source.id.slice(0, -2));
                TargetIP.push(newData[i].target.id.slice(0, -2));
                TargetPort.push(newData[i].DestinationPort);
                TotalFwdPackets.push(newData[i].TotalFwdPackets);
                Label.push(newData[i].Label);
            }

            SourceIP = SourceIP.sort(function (a, b) {
                return a - b;
            });

            TargetIP = TargetIP.sort(function (a, b) {
                return a - b;
            });
            TargetPort = TargetPort.sort(function (a, b) {
                return a - b;
            });
            TotalFwdPackets = TotalFwdPackets.sort(function (a, b) {
                return a - b;
            });
            Label = Label.sort(function (a, b) {
                return a - b;
            });

            x.domain(dimensions = d3.keys(newData[0]).filter(function (d) {
                if ((d == "id") || (d == "index") || (d == "SourcePort") || (d == "TotalFwdPackets") || (d == "Timestamp") || (d == "Protocol") || (d == "FlowDuration") || (d == "TotalBackwardPackets") || (d == "TotalLenghtOfFwdPackets") || (d == "TotalLenghtOfBwdPackets")) {
                    return false;
                }
                return y[d] = d3.scalePoint().domain(value(d)).range([0, heightCPA]);
            }));

            extents = dimensions.map(function () {
                return [0, 0];
            });

            function value(d) {
                switch (d) {
                    case "source":
                        return Array.from(SourceIP);
                    case "target":
                        return Array.from(TargetIP);
                    case "DestinationPort":
                        return Array.from(TargetPort);
                    case "Label":
                        return Array.from(Label);
                }
            }

            // Add grey background lines for context.
            background = svgCPA.append("g")
                .attr("class", "background")
                .selectAll("path")
                .data(newData)
                .enter().append("path")
                .attr("class", "backpath")
                .attr("d", path);

            // Add blue unselected lines
            notSelected = svgCPA.append("g")
                .attr("class", "notEvidence")
                .selectAll("path")
                .data(newData)
                .enter().append("path")
                .attr("class", "notSelected")
                .attr("d", path)
                .on('mouseover', function () {
                    handleFocusStroke(d3.select(this)._groups[0][0].__data__);
                })
                .on('mouseout', function () {
                    d3.select(this).transition().duration(100).style("stroke-width", "1px");
                    handleOutFocusStroke();
                    focusDotOnTime(newData);
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
                })
                .on('mouseout', function () {
                    handleOutFocusStroke();
                    focusDotOnTime(newData);
                    handleMouseOutEdge();
                    if (!brushEmpty())
                        brush_parallel_chart()
                });

            // Add a group element for each dimension.
            var g = svgCPA.selectAll(".dimension")
                .data(dimensions)
                .enter().append("g")
                .attr("class", "dimension")
                .on("dblclick", function () {
                    resetCPA = true;
                    brush_parallel_chart()
                })
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
                        .tickSize(7)
                        .tickPadding(7));
                })
                //text does not show up because previous line breaks somehow
                .append("text")
                .style("text-anchor", function (d) {
                    if (d === "Label")
                        return "begin";
                    else
                        return "middle";
                })
                .attr("y", -12)
                .style("font-size", "13px")
                .text(function (d) {
                    if (d === "source")
                        return "Source";
                    if (d === "target")
                        return "Target";
                    return d;
                });

            // Add and store a brush for each axis.
            g.append("g")
                .attr("class", "brush")
                .each(function (d) {
                    d3.select(this).call(y[d].brushCPA = d3.brushY().extent([[-8, 0], [8, heightCPA]]).on("brush start end", brushstart).on("brush", brush_parallel_chart));
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


        function updateScatterPlot(newData) {
            //==================================== INIT SCATTERPLOT =========================================
            d3.selectAll(".scatterPlot").remove();
            ip_destinationPorts_packets.clear();
            IPAddress.clear();
            DOTdestination.clear();
            FilteredPorts = [];

            // ==============================================================================================

            for (var i = 0; i < newData.length; i++) {
                if (ip_destinationPorts_packets.has(newData[i].target.id) === true) {
                    if (ip_destinationPorts_packets.get(newData[i].target.id).has(newData[i].DestinationPort) === true) {
                        value = ip_destinationPorts_packets.get(newData[i].target.id).get(newData[i].DestinationPort);
                        ip_destinationPorts_packets.get(newData[i].target.id).set(newData[i].DestinationPort, value + parseInt(newData[i].TotalFwdPackets));
                    } else {
                        ip_destinationPorts_packets.get(newData[i].target.id).set(newData[i].DestinationPort, parseInt(newData[i].TotalFwdPackets));
                    }
                } else {
                    ip_destinationPorts_packets.set(newData[i].target.id, new Map());
                    ip_destinationPorts_packets.get(newData[i].target.id).set(newData[i].DestinationPort, parseInt(newData[i].TotalFwdPackets));
                }
                FilteredPorts.push(newData[i].DestinationPort);

                IPAddress.add(newData[i].target.id.slice(0, -2));
            }

            var numberOfPacketsForPort = [];
            for (var [key, value] of ip_destinationPorts_packets) {
                numberOfPacketsForPort.push(d3.max(Array.from(value.values())));
            }

            // ==============================================================================================

            xScatterPlot = d3.scalePoint();
            yScatterPlot = d3.scalePoint();
            ScalePackPort = d3.scaleLinear().domain([0, d3.max(numberOfPacketsForPort)]).range([4, 11]);
            xAxisScatterPlot = d3.axisBottom(xScatterPlot);
            yAxisScatterPlot = d3.axisLeft(yScatterPlot);

            svgScatterPlot = d3.select("#scatterPlot").append("svg")
                .attr("class", "scatterPlot")
                .attr("width", widthScatterPlot + marginScatterPlot.left + marginScatterPlot.right)
                .attr("height", heightScatterPlot + marginScatterPlot.top + marginScatterPlot.bottom)
                .append("g")
                .attr("transform", "translate(" + marginScatterPlot.left + "," + marginScatterPlot.top + ")");

            tooltipScatterPlot = d3.select('body').append('div')
                .style('display', "none")
                .attr('class', 'd3-tip');

            xScatterPlot.domain(FilteredPorts.sort(function (a, b) {
                return a - b;
            })).range([0, widthScatterPlot]).padding(0.4);
            yScatterPlot.domain(Array.from(IPAddress).sort(function (a, b) {
                return a - b;
            })).range([heightScatterPlot, 0]).padding(0.4);

            // gridlines in x axis function
            function make_x_gridlines() {
                return d3.axisBottom(xScatterPlot)
            }

            // gridlines in y axis function
            function make_y_gridlines() {
                return d3.axisLeft(yScatterPlot)
            }

            // add the X gridlines
            svgScatterPlot.append("g")
                .attr("class", "grid")
                .attr("transform", "translate(0," + heightScatterPlot + ")")
                .call(make_x_gridlines()
                    .tickSize(-heightScatterPlot)
                    .tickFormat("").tickSizeOuter(0)
                );
            // add the Y gridlines
            svgScatterPlot.append("g")
                .attr("class", "grid")
                .call(make_y_gridlines()
                    .tickSize(-widthScatterPlot)
                    .tickFormat("").tickSizeOuter(0)
                );

            svgScatterPlot.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + heightScatterPlot + ")")
                .call(xAxisScatterPlot.tickSize(7).tickSizeOuter(0))
                .selectAll("text")
                .attr("y", -1)
                .attr("x", 4)
                .attr("dy", ".35em")
                .attr("transform", "rotate(90)")
                .style("text-anchor", "start");

            svgScatterPlot.append("g")
                .append("text")
                .attr("class", "label")
                .attr("x", widthScatterPlot)
                .attr("y", 419)
                .style("text-anchor", "end")
                .style("font-size", "13px")
                .text("Attacked Ports");

            svgScatterPlot.append("g")
                .attr("class", "y axis")
                .call(yAxisScatterPlot.tickSize(7).tickSizeOuter(0))
                .append("text")
                .attr("class", "label")
                .attr("y", -12)
                .attr("x", 17)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .style("font-size", "13px")
                .text("IP Address");

            // draw point DESTINATION PORT
            svgScatterPlot.selectAll(".dot")
                .data(DestinationScatterplot)
                //.data(newData)
                .enter().append("circle")
                .attr("class", "dotDestination")
                .attr("r", function (d) {
                    if (ip_destinationPorts_packets.has(d.target.id) === false || ip_destinationPorts_packets.get(d.target.id).has(d.DestinationPort) == false)
                        return 0;
                    else {
                        return Math.abs(ScalePackPort(ip_destinationPorts_packets.get(d.target.id).get(d.DestinationPort)));
                    }
                })
                .attr("cx", function (d) {
                    return xScatterPlot(d.DestinationPort);
                })
                .attr("cy", function (d) {
                    return yScatterPlot(d.target.id.slice(0, -2));
                })
                .style("fill", "#007bff")
                .on("mouseover", function (d) {
                    tooltipScatterPlot.style("left", d3.event.pageX - 50 + "px")
                        .style("top", d3.event.pageY - 70 + "px")
                        .style('display', "block")
                        .html("<span><b>IP:Port: </b> " + (d.target.id.slice(0, -2)) + ": " + (d.DestinationPort) + "</span><br> <span><b>Packets: </b>" + ip_destinationPorts_packets.get(d.target.id).get(d.DestinationPort) + "</span>");
                    handleFocusDotDestination(d);
                })
                .on("mouseout", function () {
                    tooltipScatterPlot.style('display', "none");
                    handleMouseOutEdge();
                    focusDotOnTime(newData);
                    handleOutFocusStroke();
                });
        }

        function brush_parallel_chart() {
            for (var i = 0; i < dimensions.length; ++i) {
                if (d3.event.target == y[dimensions[i]].brushCPA) {
                    min = d3.event.selection[0];
                    max = d3.event.selection[1];
                    extents[i] = y[dimensions[i]].domain().filter(function (d) {
                        return (min <= y[dimensions[i]](d)) && (y[dimensions[i]](d) <= max)
                    });
                }
            }

            if (resetCPA === true) {
                resetCPA = false;
                for (var i = 0; i < dimensions.length; ++i)
                    extents[i] = [0, 0];
            }
            if (nodeSelected.size !== 0) {
                selected.style("display", function (d) {
                    return dimensions.every(function (p, i) {
                        if (extents[i][0] === 0 && extents[i][0] === 0)
                            return (nodeSelected.has(d.source.id) || (nodeSelected.has(d.target.id)));
                        if (p === "source" || p === "target") {
                            return extents[i].includes(d[p].id.slice(0, -2)) && (nodeSelected.has(d.source.id) || (nodeSelected.has(d.target.id)));
                        } else {
                            return (extents[i].includes(d[p]) || extents[i].includes(parseInt(d[p]))) && (nodeSelected.has(d.source.id) || (nodeSelected.has(d.target.id)));
                        }
                    }) ? "block" : "none";
                });
            }
            notSelected.style("display", function (d) {
                return dimensions.every(function (p, i) {
                    if (extents[i][0] === 0 && extents[i][0] === 0)
                        return true;
                    if (p === "source" || p === "target") {
                        return extents[i].includes(d[p].id.slice(0, -2));
                    } else {
                        return extents[i].includes(d[p]) || extents[i].includes(parseInt(d[p]));
                    }
                }) ? "block" : "none";
            });
            filteredData = newData.filter(function (d) {
                return (extents[0].includes(d.source.id.slice(0, -2)) || (extents[0][0] === 0 && extents[0][1] === 0))
                    && (extents[2].includes(d.target.id.slice(0, -2)) || (extents[2][0] === 0 && extents[2][1] === 0))
                    && (extents[1].includes(d.DestinationPort) || extents[1].includes(parseInt(d.DestinationPort)) || (extents[1][0] === 0 && extents[1][1] === 0))
                    && (extents[3].includes(d.Label) || (extents[3][0] === 0 && extents[3][1] === 0));
            });

            showAllGraph();
            buildMapPacket(filteredData);
            scalePacket(NumberDeliveredPackets);
            updateGraph(filteredData);
            attackPackets(filteredData);
            updateLegend();
            updateNumberOfAttack(filteredData);
            updateChartDay1();
            updateChartDay2();
            updateChartDay3();
            updateChartDay4();

            updateScatterPlot(filteredData);
            FocusDotScatterPlot(nodeSelected);
            focusDotOnTime(filteredData);
        }
    }

    function drawSelect(init, data) {
        d3.selectAll(".dropdown.bootstrap-select.show-tick").remove();
        MapPorts = new Map();
        Ports = [];
        totPackets = 0;
        InsertedPort = 0;
        // Mappa con chiave le porte di destinazione e valore il totale dei pacchetti ricevuti
        for (var i = 0; i < data.length; i++) {
            totPackets += parseInt(data[i].TotalFwdPackets);
            if (MapPorts.has(data[i].DestinationPort) === false)
                MapPorts.set(data[i].DestinationPort, parseInt(data[i].TotalFwdPackets));
            else
                MapPorts.set(data[i].DestinationPort, MapPorts.get(data[i].DestinationPort) + parseInt(data[i].TotalFwdPackets));
        }
        // ordinamento della mappa in base al valore dei pacchetti
        MapPorts = new Map([...MapPorts.entries()].sort((a, b) => b[1] - a[1]));
        // array di tutte le porte di destinazione
        Ports = Array.from(MapPorts.keys());

        // ===================================== select multiplo sulle porte di destinazione ===========================

        select = d3.select('#portController')
            .append('select')
            .attr('class', 'selectpicker dropup')
            .attr('multiple', 'true')
            .attr('data-dropup-auto', 'false')
            .attr('data-live-search', 'true')
            .attr('data-live-search-placeholder', 'Search')
            .attr('title', "Filter Destination ports")
            .attr("data-header", "SELECT THE DESTINATION PORTS")
            .attr("data-max-options", "50")
            .attr('data-width', "424")
            .attr("height", "10")
            .on('change', FilterPorts);
        FilteredPort = [];
        select
            .selectAll('option')
            .data(Ports).enter()
            .append('option')
            .text(function (d) {
                return d;
            })
            .attr('data-subtext', function (d) {
                return ((MapPorts.get(d) / totPackets) * 100).toFixed(4) + '%';
            })
            .each(function (d) {
                if (init == true) {
                    InsertedPort += 1;
                    if (InsertedPort <= 47) {
                        PortSelected.push(d);
                        d3.select(this).attr("selected", "")
                    }
                } else {
                    if (PortSelected.includes(d) == true && Ports.includes(d)) {
                        d3.select(this).attr("selected", "");
                        FilteredPort.push(d)
                    }
                }
            });

        if (init == false) {
            PortSelected = (FilteredPort);
        }
        d3.select("#port").html("Selected ports: " + (PortSelected.length) + " / <b>" + (Ports.length) + "</b>");
        $('.selectpicker').selectpicker('refresh');

        // ========================================== Fine selezione multipla =====================
    }

    function updateChartDay1() {
        d3.selectAll(".barday1").remove();
        var chartDay1;
        var attackSelectedDay1 = newData.filter(function (d) {
            return ((nodeSelected.has(d.source.id) || nodeSelected.has(d.target.id)) && d.Timestamp.slice(0, -6) == "4/7/2017")
        });
        var valueAttackSelectedDay1 = new Map();
        attackDay1 = new Map([...attackDay1.entries()].sort((a, b) => a[1] - b[1]));
        bindedDay1 = Array.from(attackDay1);
        for (var i = 0; i < bindedDay1.length; i++) {
            valueAttackSelectedDay1.set(bindedDay1[i][0], 0);
        }
        for (var j = 0; j < attackSelectedDay1.length; j++) {
            valueAttackSelectedDay1.set(attackSelectedDay1[j].Label, valueAttackSelectedDay1.get(attackSelectedDay1[j].Label) + parseInt(attackSelectedDay1[j].TotalFwdPackets));
        }
        xScaleDay1 = d3.scaleLinear().domain([0, d3.max((Array.from(attackDay1.values())))]).range([0, widthBar]);
        var yScaleDay1 = d3.scalePoint()
            .range([svgHeightBar, 0])
            .domain(bindedDay1.map(function (d) {
                return d[0];
            }))
            .padding(1);
        // SVG
        var barDay1 = d3.select('#barchartDay1').append('svg')
            .attr("width", svgWidthBar).attr('height', svgHeightBar)
            .attr("class", "barday1");

        var barLegenday1 = d3.axisTop()
            .scale(xScaleDay1)
            .ticks(6)
            .tickSizeOuter(0);

        // gridlines in x axis function
        function make_x_gridlines() {
            return d3.axisBottom(xScaleDay1)
        }

        // add the X gridlines
        barDay1.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(129," + svgHeightBar + ")")
            .call(make_x_gridlines()
                .tickValues(xScaleDay1.ticks(5).concat(xScaleDay1.domain()))
                .tickSize(-svgHeightBar + 24).tickFormat("").tickSizeOuter(0)
            );

        barDay1.append("g")
            .attr("class", "x axis")
            .call(barLegenday1)
            .attr('transform', 'translate(130,25)');

        // CHART AREA
        var valsDay1 = barDay1.append('g').attr('transform', 'translate(125,10)')
            .attr('width', widthBar).attr("height", heightBar);

        tooltipBar = d3.select('body').append('div')
            .attr('class', 'd3-tip')
            .style('display', "none");


        // DATA BIND
        chartDay1 = valsDay1.selectAll('rect').data(bindedDay1);
        // ENTER
        chartDay1.enter().append('rect')
            .attr("width", function (d) {
                return xScaleDay1(d[1]);
            })
            .attr("height", 10)
            .attr('x', 5).attr('y', function (d) {
            return yScaleDay1(d[0]);
        })
            .attr("fill", "#007bff")
            .on('mousemove', function (d) {
                tooltipBar.style("left", d3.event.pageX - 50 + "px")
                    .style("top", d3.event.pageY - 70 + "px")
                    .style('display', "block")
                    .html("Total Packets" + "<b>&nbsp; --- &nbsp;</b>" + (d[0]) + ": " + "<b>" + (d[1]) + "</b>");
            })
            .on('mouseout', function () {
                tooltipBar.style('display', "none");
            });
        chartDay1.enter().append('text')
            .text(function (d) {
                value = "";
                if ((valueAttackSelectedDay1.get(d[0])) !== 0)
                    value += (valueAttackSelectedDay1.get(d[0])) + " | ";
                return value += (d[1] - valueAttackSelectedDay1.get(d[0]));
            })
            .attr('x', function (d) {
                return xScaleDay1((d[1])) + 8;
            })
            .attr('y', function (d) {
                return yScaleDay1(d[0]) + 8;
            })
            .style("font-size", "11px");

        chartDay1.enter().append('rect')
            .attr("width", function (d) {
                return xScaleDay1(valueAttackSelectedDay1.get(d[0]));
            })
            .attr("height", 10)
            .attr('x', 5).attr('y', function (d) {
            return yScaleDay1(d[0]);
        })
            .attr("fill", "orangered")
            .on('mousemove', function (d) {
                tooltipBar.style("left", d3.event.pageX - 50 + "px")
                    .style("top", d3.event.pageY - 70 + "px")
                    .style('display', "block")
                    .html("Total Packets" + "<b>&nbsp; --- &nbsp;</b>" + (d[0]) + ": " + "<b>" + (d[1]) + "</b>");
            })
            .on('mouseout', function () {
                tooltipBar.style('display', "none");
            });

        // DATA BIND
        var keyDay1 = valsDay1.selectAll('text.key').data(bindedDay1);
        // ENTER
        keyDay1.enter().append("text").attr("class", "key")
            .attr("x", 0)
            .attr("y", function (d) {
                return yScaleDay1(d[0]);
            })
            .attr('dy', 8)
            .attr("text-anchor", "end")
            .text(function (d) {
                return d[0];
            }).on('mousemove', function (d) {
            tooltipBar.style("left", d3.event.pageX - 50 + "px")
                .style("top", d3.event.pageY - 70 + "px")
                .style('display', "block")
                .html("Total Packets" + "<b>&nbsp; --- &nbsp;</b>" + (d[0]) + ": " + "<b>" + (d[1]) + "</b>");
        })
            .on('mouseout', function () {
                tooltipBar.style('display', "none");
            });

        // UPDATE
        keyDay1.text(function (d) {
            return d[0]
        });
    }

    function updateChartDay2() {
        d3.selectAll(".barday2").remove();
        var chartDay2;
        var attackSelectedDay2 = newData.filter(function (d) {
            return ((nodeSelected.has(d.source.id) || nodeSelected.has(d.target.id)) && d.Timestamp.slice(0, -6) == "5/7/2017")
        });
        var valueAttackSelectedDay2 = new Map();
        attackDay2 = new Map([...attackDay2.entries()].sort((a, b) => a[1] - b[1]));
        bindedDay2 = Array.from(attackDay2);
        xScaleDay2 = d3.scaleLinear().domain([0, d3.max((Array.from(attackDay2.values())))]).range([0, widthBar]);
        for (var i = 0; i < bindedDay2.length; i++) {
            valueAttackSelectedDay2.set(bindedDay2[i][0], 0);
        }
        for (var j = 0; j < attackSelectedDay2.length; j++) {
            valueAttackSelectedDay2.set(attackSelectedDay2[j].Label, valueAttackSelectedDay2.get(attackSelectedDay2[j].Label) + parseInt(attackSelectedDay2[j].TotalFwdPackets));
        }
        var yScaleDay2 = d3.scalePoint()
            .range([svgHeightBar, 0])
            .domain(bindedDay2.map(function (d) {
                return d[0];
            }))
            .padding(1);
        // SVG
        var barDay2 = d3.select('#barchartDay2').append('svg')
            .attr("width", svgWidthBar).attr('height', svgHeightBar)
            .attr("class", "barday2");

        var barLegenday2 = d3.axisTop()
            .scale(xScaleDay2)
            .ticks(5)
            .tickSizeOuter(0);

        // gridlines in x axis function
        function make_x_gridlines() {
            return d3.axisBottom(xScaleDay2)
        }

        // add the X gridlines
        barDay2.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(129," + svgHeightBar + ")")
            .call(make_x_gridlines()
                .tickValues(xScaleDay2.ticks(5).concat(xScaleDay2.domain()))
                .tickSize(-svgHeightBar + 24).tickFormat("").tickSizeOuter(0));

        barDay2.append("g")
            .attr("class", "x axis")
            .call(barLegenday2)
            .attr('transform', 'translate(130,25)');

        // CHART AREA
        var valsDay2 = barDay2.append('g').attr('transform', 'translate(125,10)')
            .attr('width', widthBar).attr("height", heightBar);

        tooltipBar = d3.select('body').append('div')
            .style('display', "none")
            .attr('class', 'd3-tip');

        // DATA BIND
        chartDay2 = valsDay2.selectAll('rect').data(bindedDay2);
        // ENTER
        chartDay2.enter().append('rect')
            .attr("width", function (d) {
                return xScaleDay2(d[1]);
            })
            .attr("height", 10)
            .attr('x', 5).attr('y', function (d) {
            return yScaleDay2(d[0]);
        })
            .attr("fill", "#007bff")
            .on('mousemove', function (d) {
                tooltipBar.style("left", d3.event.pageX - 50 + "px")
                    .style("top", d3.event.pageY - 70 + "px")
                    .style('display', "block")
                    .html("Total Packets" + "<b>&nbsp; --- &nbsp;</b>" + (d[0]) + ": " + "<b>" + (d[1]) + "</b>");
            })
            .on('mouseout', function () {
                tooltipBar.style('display', "none");
            });

        chartDay2.enter().append('text')
            .text(function (d) {
                value = "";
                if ((valueAttackSelectedDay2.get(d[0])) !== 0)
                    value += (valueAttackSelectedDay2.get(d[0])) + " | ";
                return value += (d[1] - valueAttackSelectedDay2.get(d[0]));
            })
            .attr('x', function (d) {
                return xScaleDay2((d[1])) + 8;
            })
            .attr('y', function (d) {
                return yScaleDay2(d[0]) + 8;
            })
            .style("font-size", "11px");

        chartDay2.enter().append('rect')
            .attr("width", function (d) {
                return xScaleDay2(valueAttackSelectedDay2.get(d[0]));
            })
            .attr("height", 10)
            .attr('x', 5).attr('y', function (d) {
            return yScaleDay2(d[0]);
        })
            .attr("fill", "orangered")
            .on('mousemove', function (d) {
                tooltipBar.style("left", d3.event.pageX - 50 + "px")
                    .style("top", d3.event.pageY - 70 + "px")
                    .style('display', "block")
                    .html("Total Packets" + "<b>&nbsp; --- &nbsp;</b>" + (d[0]) + ": " + "<b>" + (d[1]) + "</b>");
            })
            .on('mouseout', function () {
                tooltipBar.style('display', "none");
            });

        // DATA BIND
        var keyDay2 = valsDay2.selectAll('text.key').data(bindedDay2);
        // ENTER
        keyDay2.enter().append("text").attr("class", "key")
            .attr("x", 0)
            .attr("y", function (d) {
                return yScaleDay2(d[0]);
            })
            .attr('dy', 8)
            .attr("text-anchor", "end")
            .text(function (d) {
                return d[0];
            }).on('mousemove', function (d) {
            tooltipBar.style("left", d3.event.pageX - 50 + "px")
                .style("top", d3.event.pageY - 70 + "px")
                .style('display', "block")
                .html("Total Packets" + "<b>&nbsp; --- &nbsp;</b>" + (d[0]) + ": " + "<b>" + (d[1]) + "</b>");
        })
            .on('mouseout', function () {
                tooltipBar.style('display', "none");
            });

        // UPDATE
        keyDay2.text(function (d) {
            return d[0]
        });

    }

    function updateChartDay3() {
        d3.selectAll(".barday3").remove();
        var chartDay3;
        var attackSelectedDay3 = newData.filter(function (d) {
            return ((nodeSelected.has(d.source.id) || nodeSelected.has(d.target.id)) && d.Timestamp.slice(0, -6) == "6/7/2017")
        });
        var valueAttackSelectedDay3 = new Map();
        attackDay3 = new Map([...attackDay3.entries()].sort((a, b) => a[1] - b[1]));
        bindedDay3 = Array.from(attackDay3);
        xScaleDay3 = d3.scaleLinear().domain([0, d3.max((Array.from(attackDay3.values())))]).range([0, widthBar]);
        for (var i = 0; i < bindedDay3.length; i++) {
            valueAttackSelectedDay3.set(bindedDay3[i][0], 0);
        }
        for (var j = 0; j < attackSelectedDay3.length; j++) {
            valueAttackSelectedDay3.set(attackSelectedDay3[j].Label, valueAttackSelectedDay3.get(attackSelectedDay3[j].Label) + parseInt(attackSelectedDay3[j].TotalFwdPackets));
        }
        var yScaleDay3 = d3.scalePoint()
            .range([svgHeightBar, 0])
            .domain(bindedDay3.map(function (d) {
                return d[0];
            }))
            .padding(1);
        // SVG
        var barDay3 = d3.select('#barchartDay3').append('svg')
            .attr("width", svgWidthBar).attr('height', svgHeightBar)
            .attr("class", "barday2");//.style('border','1px solid')

        barLegenday3 = d3.axisTop()
            .scale(xScaleDay3)
            .ticks(5)
            .tickSizeOuter(0);

        // gridlines in x axis function
        function make_x_gridlines() {
            return d3.axisBottom(xScaleDay3)
        }

        // add the X gridlines
        barDay3.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(129," + svgHeightBar + ")")
            .call(make_x_gridlines()
                .tickValues(xScaleDay3.ticks(5).concat(xScaleDay3.domain()))
                .tickSize(-svgHeightBar + 24).tickFormat("").tickSizeOuter(0)
            );

        barDay3.append("g")
            .attr("class", "x axis")
            .call(barLegenday3)
            .attr('transform', 'translate(130,25)');

        // CHART AREA
        valsDay3 = barDay3.append('g').attr('transform', 'translate(125,10)')
            .attr('width', widthBar).attr("height", heightBar);

        tooltipBar = d3.select('body').append('div')
            .style('display', "none")
            .attr('class', 'd3-tip');
        // DATA BIND
        chartDay3 = valsDay3.selectAll('rect').data(bindedDay3);
        // ENTER
        chartDay3.enter().append('rect')
            .attr("width", function (d) {
                return xScaleDay3(d[1]);
            })
            .attr("height", 10)
            .attr('x', 5).attr('y', function (d) {
            return yScaleDay3(d[0]);
        })
            .attr("fill", "#007bff")
            .attr("width", function (d) {
                return xScaleDay3(d[1])
            })
            .on('mousemove', function (d) {
                tooltipBar.style("left", d3.event.pageX - 50 + "px")
                    .style("top", d3.event.pageY - 70 + "px")
                    .style('display', "block")
                    .html("Total Packets" + "<b>&nbsp; --- &nbsp;</b>" + (d[0]) + ": " + "<b>" + (d[1]) + "</b>");
            })
            .on('mouseout', function () {
                tooltipBar.style('display', "none");
            });

        chartDay3.enter().append('text')
            .text(function (d) {
                value = "";
                if ((valueAttackSelectedDay3.get(d[0])) !== 0)
                    value += (valueAttackSelectedDay3.get(d[0])) + " | ";
                return value += (d[1] - valueAttackSelectedDay3.get(d[0]));
            })
            .attr('x', function (d) {
                return xScaleDay3((d[1])) + 8;
            })
            .attr('y', function (d) {
                return yScaleDay3(d[0]) + 8;
            })
            .style("font-size", "11px");

        chartDay3.enter().append('rect')
            .attr("width", function (d) {
                return xScaleDay3(valueAttackSelectedDay3.get(d[0]));
            })
            .attr("height", 10)
            .attr('x', 5).attr('y', function (d) {
            return yScaleDay3(d[0]);
        })
            .attr("fill", "orangered")
            .on('mousemove', function (d) {
                tooltipBar.style("left", d3.event.pageX - 50 + "px")
                    .style("top", d3.event.pageY - 70 + "px")
                    .style('display', "block")
                    .html("Total Packets" + "<b>&nbsp; --- &nbsp;</b>" + (d[0]) + ": " + "<b>" + (d[1]) + "</b>");
            })
            .on('mouseout', function () {
                tooltipBar.style('display', "none");
            });

        // DATA BIND
        var keyDay3 = valsDay3.selectAll('text.key').data(bindedDay3);
        // ENTER
        keyDay3.enter().append("text").attr("class", "key")
            .attr("x", 0)
            .attr("y", function (d) {
                return yScaleDay3(d[0]);
            })
            .attr('dy', 8)
            .attr("text-anchor", "end")
            .text(function (d) {
                return d[0];
            }).on('mousemove', function (d) {
            tooltipBar.style("left", d3.event.pageX - 50 + "px")
                .style("top", d3.event.pageY - 70 + "px")
                .style('display', "block")
                .html("Total Packets" + "<b>&nbsp; --- &nbsp;</b>" + (d[0]) + ": " + "<b>" + (d[1]) + "</b>");
        })
            .on('mouseout', function () {
                tooltipBar.style('display', "none");
            });

        // UPDATE
        keyDay3.text(function (d) {
            return d[0]
        });

    }

    function updateChartDay4() {
        d3.selectAll(".barday4").remove();
        var attackSelectedDay4 = newData.filter(function (d) {
            return ((nodeSelected.has(d.source.id) || nodeSelected.has(d.target.id)) && d.Timestamp.slice(0, -6) == "7/7/2017")
        });
        var valueAttackSelectedDay4 = new Map();
        attackDay4 = new Map([...attackDay4.entries()].sort((a, b) => a[1] - b[1]));
        bindedDay4 = Array.from(attackDay4);
        xScaleDay4 = d3.scaleLinear().domain([0, d3.max((Array.from(attackDay4.values())))]).range([0, widthBar]);
        for (var i = 0; i < bindedDay4.length; i++) {
            valueAttackSelectedDay4.set(bindedDay4[i][0], 0);
        }
        for (var j = 0; j < attackSelectedDay4.length; j++) {
            valueAttackSelectedDay4.set(attackSelectedDay4[j].Label, valueAttackSelectedDay4.get(attackSelectedDay4[j].Label) + parseInt(attackSelectedDay4[j].TotalFwdPackets));
        }
        var yScaleDay4 = d3.scalePoint()
            .range([svgHeightBar, 0])
            .domain(bindedDay4.map(function (d) {
                return d[0];
            }))
            .padding(1);
        // SVG
        var barDay4 = d3.select('#barchartDay4').append('svg')
            .attr("width", svgWidthBar).attr('height', svgHeightBar)
            .attr("class", "barday4");

        var barLegenday4 = d3.axisTop()
            .scale(xScaleDay4)
            .ticks(5)
            .tickSizeOuter(0);

        // gridlines in x axis function
        function make_x_gridlines() {
            return d3.axisBottom(xScaleDay4)
        }

        // add the X gridlines
        barDay4.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(129," + svgHeightBar + ")")
            .call(make_x_gridlines()
                .tickValues(xScaleDay4.ticks(5).concat(xScaleDay4.domain()))
                .tickSize(-svgHeightBar + 24).tickFormat("").tickSizeOuter(0)
            );

        barDay4.append("g")
            .attr("class", "x axis")
            .call(barLegenday4)
            .attr('transform', 'translate(130,25)');

        // CHART AREA
        var valsDay4 = barDay4.append('g').attr('transform', 'translate(125,10)')
            .attr('width', widthBar).attr("height", heightBar);

        tooltipBar = d3.select('body').append('div')
            .style('display', "none")
            .attr('class', 'd3-tip');

        // DATA BIND
        var chartDay4 = valsDay4.selectAll('rect').data(bindedDay4);
        // ENTER
        chartDay4.enter().append('rect')
            .attr("width", function (d) {
                return xScaleDay4(d[1]);
            })
            .attr("height", 10)
            .attr('x', 5).attr('y', function (d) {
            return yScaleDay4(d[0]);
        })
            .attr("fill", "#007bff")
            .on('mousemove', function (d) {
                tooltipBar.style("left", d3.event.pageX - 50 + "px")
                    .style("top", d3.event.pageY - 70 + "px")
                    .style('display', "block")
                    .html("Total Packets" + "<b>&nbsp; --- &nbsp;</b>" + (d[0]) + ": " + "<b>" + (d[1]) + "</b>");
            })
            .on('mouseout', function () {
                tooltipBar.style('display', "none");
            });

        chartDay4.enter().append('text')
            .text(function (d) {
                value = "";
                if ((valueAttackSelectedDay4.get(d[0])) !== 0)
                    value += (valueAttackSelectedDay4.get(d[0])) + " | ";
                return value += (d[1] - valueAttackSelectedDay4.get(d[0]));
            })
            .attr('x', function (d) {
                return xScaleDay4((d[1])) + 8;
            })
            .attr('y', function (d) {
                return yScaleDay4(d[0]) + 8;
            })
            .style("font-size", "11px");

        chartDay4.enter().append('rect')
            .attr("width", function (d) {
                return xScaleDay4(valueAttackSelectedDay4.get(d[0]));
            })
            .attr("height", 10)
            .attr('x', 5).attr('y', function (d) {
            return yScaleDay4(d[0]);
        })
            .attr("fill", "orangered")
            .on('mousemove', function (d) {
                tooltipBar.style("left", d3.event.pageX - 50 + "px")
                    .style("top", d3.event.pageY - 70 + "px")
                    .style('display', "block")
                    .html("Total Packets" + "<b>&nbsp; --- &nbsp;</b>" + (d[0]) + ": " + "<b>" + (d[1]) + "</b>");
            })
            .on('mouseout', function () {
                tooltipBar.style('display', "none");
            });

        // DATA BIND
        var keyDay4 = valsDay4.selectAll('text.key').data(bindedDay4);
        // ENTER
        keyDay4.enter().append("text").attr("class", "key")
            .attr("x", 0)
            .attr("y", function (d) {
                return yScaleDay4(d[0]);
            })
            .attr('dy', 8)
            .attr("text-anchor", "end")
            .text(function (d) {
                return d[0];
            }).on('mousemove', function (d) {
            tooltipBar.style("left", d3.event.pageX - 50 + "px")
                .style("top", d3.event.pageY - 70 + "px")
                .style('display', "block")
                .html("Total Packets" + "<b>&nbsp; --- &nbsp;</b>" + (d[0]) + ": " + "<b>" + (d[1]) + "</b>");
        })
            .on('mouseout', function () {
                tooltipBar.style('display', "none");
            });

        // UPDATE
        keyDay4.text(function (d) {
            return d[0]
        });

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

    function FocusDotScatterPlot(nodes) {
        select = newData.filter(function (d) {
            return (nodes.has(d.source.id)) == true || (nodes.has(d.target.id)) == true
        });
        d3.select("#scatterPlot").selectAll("circle").transition().duration(200)
            .style("stroke", function (d) {
                for (var i = 0; i < select.length; i++) {
                    if (((d.source.id === select[i].source.id) && (d.target.id === select[i].target.id) || (select[i].DestinationPort === d.DestinationPort && select[i].target.id === d.target.id)))
                        return "orangered";
                }
            });
    }

    function UnfocusDotScatterPlot(nodes) {
        select = newData.filter(function (d) {
            return (nodes.has(d.source.id)) == true || (nodes.has(d.target.id)) == true
        });
        d3.select("#scatterPlot").selectAll("circle").transition().duration(200)
            .style("stroke-width", function (d) {
                for (var i = 0; i < select.length; i++) {
                    if (!((d.source.id === select[i].source.id) && (d.target.id === select[i].target.id) || (select[i].DestinationPort === d.DestinationPort && select[i].target.id === d.target.id)))
                        return "none";
                }
            });
        FocusDotScatterPlot(nodes);
    }

    function focusDotSelectedOnTime(nodes) {
        select = newData.filter(function (d) {
            return (nodes.has(d.source.id)) == true || (nodes.has(d.target.id)) == true
        });
        d3.selectAll(".dotDay").style("opacity", "0.3");
        d3.selectAll(".dotDay")
            .style("opacity", function (d) {
                for (var i = 0; i < select.length; i++) {
                    if ((d === select[i].Timestamp))
                        return "1";
                }
            });
    }

    function focusDotOnTime(nodes) {
        d3.selectAll(".dotDay").style("opacity", "0.3");
        d3.selectAll(".dotDay")
            .style("opacity", function (d) {
                for (var i = 0; i < nodes.length; i++) {
                    if ((d === nodes[i].Timestamp))
                        return "1";
                }
            });
    }

    function handleFocusDotDestination(edge) {
        d3.select("#graph").selectAll("line").transition().duration(200).style("opacity", function (d) {
            if (d.source.id === edge.source.id && d.target.id === edge.target.id)
                return "1";
            else
                return "0.1";
        });
        d3.select("#graph").selectAll("circle").transition().duration(200)
            .style("opacity", function (d) {
                if ((d.id === edge.source.id) || (d.id === edge.target.id))
                    return "1";
                else
                    return "0.1";
            });
        d3.select("#PCA").selectAll(".notSelected")
            .style("opacity", function (d) {
                if ((d.source.id === edge.source.id) && (d.target.id === edge.target.id) && edge.DestinationPort === d.DestinationPort)
                    return "1";
                else
                    return "0";
            })
            .style("stroke-width", "2px");
        d3.select("#PCA").selectAll(".selected")
            .style("opacity", function (d) {
                if ((d.source.id === edge.source.id) && (d.target.id === edge.target.id) && edge.DestinationPort === d.DestinationPort)
                    return "1";
                else
                    return "0";
            })
            .style("stroke-width", "2px");

        d3.select("#scatterPlot").selectAll("circle")
            .style("opacity", function (d) {
                if ((d.source.id === edge.source.id) && (d.target.id === edge.target.id) && (d.DestinationPort === edge.DestinationPort))
                    return "1";
                else
                    return "0"
            });

        select = newData.filter(function (d) {
            return ((d.source.id === edge.source.id) && (d.target.id === edge.target.id) && (d.DestinationPort === edge.DestinationPort))
        });

        d3.selectAll(".dotDay").style("opacity", "0.3");
        d3.selectAll(".dotDay")
            .style("opacity", function (d) {
                for (var i = 0; i < select.length; i++) {
                    if ((d === select[i].Timestamp))
                        return "1";
                }
            });
    }

    function handleFocusStrokeOnEdge(edge) {
        d3.select("#PCA").selectAll(".notSelected")
            .style("opacity", function (d) {
                if (edge.source.id == d.source.id && edge.target.id == d.target.id)
                    return "1";
                else
                    return "0";
            })
            .style("stroke-width", "2px");
        d3.select("#PCA").selectAll(".selected")
            .style("opacity", function (d) {
                if (edge.source.id == d.source.id && edge.target.id == d.target.id)
                    return "1";
                else
                    return "0";
            })
            .style("stroke-width", "2px");

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
            });
        select = newData.filter(function (d) {
            return d.source.id === circle._groups[0][0].__data__.id || d.target.id === circle._groups[0][0].__data__.id
        });
        d3.select("#scatterPlot").selectAll("circle").transition().duration(200)
            .style("opacity", function (d) {
                for (var i = 0; i < select.length; i++) {
                    if ((nodes.indexOf(d.source.id) > -1) && (nodes.indexOf(d.target.id) > -1) || (select[i].DestinationPort === d.DestinationPort && select[i].target.id === d.target.id))
                        return "1";
                    else
                        return "0.2"
                }
            });
        d3.select("#PCA").selectAll(".notSelected")
            .style("opacity", function (d) {
                if (d.source.id === circle._groups[0][0].__data__.id || d.target.id === circle._groups[0][0].__data__.id)
                    return "1";
                else
                    return "0";
            })
            .style("stroke-width", "3px");
        d3.select("#PCA").selectAll(".selected")
            .style("opacity", function (d) {
                if (d.source.id === circle._groups[0][0].__data__.id || d.target.id === circle._groups[0][0].__data__.id)
                    return "1";
            })
            .style("stroke-width", "3px");
        select = newData.filter(function (d) {
            return (d.source.id === circle._groups[0][0].__data__.id || d.target.id === circle._groups[0][0].__data__.id)
        });

        d3.selectAll(".dotDay").style("opacity", "0.3");
        d3.selectAll(".dotDay")
            .style("opacity", function (d) {
                for (var i = 0; i < select.length; i++) {
                    if ((d === select[i].Timestamp))
                        return "1";
                }
            });
    }

    function handleMouseOutNode() {
        d3.select("#graph").selectAll("line").transition().duration(200).style("opacity", "1");
        d3.select("#graph").selectAll("circle").transition().duration(200).style("opacity", "1");
        d3.select("#scatterPlot").selectAll("circle").transition().duration(200).style("opacity", "1");
    }

    function handleMouseMoveEdge(edge) {
        d3.select("#graph").selectAll("line").transition().duration(200).style("opacity", function (d) {
            if (d.source.id === edge.source.id && d.target.id === edge.target.id)
                return "1";
            else
                return "0.1";
        });
        d3.select("#graph").selectAll("circle").transition().duration(200)
            .style("opacity", function (d) {
                if ((d.id === edge.source.id) || (d.id === edge.target.id))
                    return "1";
                else
                    return "0.1";
            });
        d3.select("#scatterPlot").selectAll("circle")
            .style("opacity", function (d) {
                if (((d.source.id === edge.source.id) && (d.target.id === edge.target.id)))
                    return "1";
                else
                    return "0.2"
            });
        d3.select("#PCA").selectAll(".notSelected")
            .style("opacity", function (d) {
                if ((d.source.id === edge.source.id) && (d.target.id === edge.target.id))
                    return "1";
                else
                    return "0";
            })
            .style("stroke-width", "2px");
        d3.select("#PCA").selectAll(".selected")
            .style("opacity", function (d) {
                if ((d.source.id === edge.source.id) && (d.target.id === edge.target.id))
                    return "1";
                else
                    return "0";
            })
            .style("stroke-width", "2px");
        select = newData.filter(function (d) {
            return (d.source.id === edge.source.id) && (d.target.id === edge.target.id)
        });

        d3.selectAll(".dotDay").style("opacity", "0.3");
        d3.selectAll(".dotDay")
            .style("opacity", function (d) {
                for (var i = 0; i < select.length; i++) {
                    if ((d === select[i].Timestamp))
                        return "1";
                }
            });
    }

    function handleMouseOutEdge() {
        d3.select("#graph").selectAll("line").transition().duration(150).style("opacity", "1");
        d3.select("#graph").selectAll("circle").transition().duration(150).style("opacity", "1");
        d3.select("#scatterPlot").selectAll("circle").transition().duration(200).style("opacity", "1");
    }

    function handleFocusStroke(stroke) {
        d3.select("#graph").selectAll("line").transition().duration(200).style("opacity", function (d) {
            if (d.source.id === stroke.source.id && d.target.id === stroke.target.id)
                return "1";
            else
                return "0.1";
        });
        d3.select("#graph").selectAll("circle").transition().duration(200)
            .style("opacity", function (d) {
                if ((d.id === stroke.source.id) || (d.id === stroke.target.id))
                    return "1";
                else
                    return "0.1";
            });
        d3.select("#PCA").selectAll(".notSelected")
            .style("opacity", function (d) {
                if (d == stroke)
                    return "1";
                else
                    return "0";
            })
            .style("stroke-width", "2px");
        d3.select("#PCA").selectAll(".selected")
            .style("opacity", function (d) {
                if (d == stroke)
                    return "1";
                else
                    return "0";
            })
            .style("stroke-width", "2px");
        d3.select("#scatterPlot").selectAll("circle")
            .style("opacity", function (d) {
                if ((d.source.id === stroke.source.id) || (d.source.id === stroke.target.id))
                    return "1";
                else
                    return "0.2"
            });
        select = newData.filter(function (d) {
            return (d.source.id === stroke.source.id) || (d.source.id === stroke.target.id)
        });

        d3.selectAll(".dotDay").style("opacity", "0.3");
        d3.selectAll(".dotDay")
            .style("opacity", function (d) {
                for (var i = 0; i < select.length; i++) {
                    if ((d === select[i].Timestamp))
                        return "1";
                }
            });
    }

    function handleOutFocusStroke() {
        d3.select("#PCA").selectAll(".notSelected")
            .style("opacity", "1")
            .style("stroke-width", "1px");
        d3.select("#PCA").selectAll(".selected")
            .style("opacity", "1")
            .style("stroke-width", "1px");
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

// content of the windows on link mouse over su grafo
    function contentLinkTip(d) {
        var content = "<h5 align='center'>LINK</h5>";
        content += " <table align='center' id='tooltip'><tr><td>IP address Attacker:</td> <td>" + d.source.id.slice(0, -2) + "</td></tr>" +
            "<tr><td> IP address Target:</td><td align='left'>" + d.target.id.slice(0, -2) + "</td></tr>" +
            "<tr><th>Tot N° of packets:</th> <td>" + transferPackets.get(d.source.id + d.target.id)[0] + "</td></tr>" +
            "<tr><td> Tot Length Fwd Packets:</td><td align='left'>" + transferPackets.get(d.source.id + d.target.id)[1] + "<b> Byte</b>" + "</td></tr></table>";
        return content;
    }

// content of the windows on node mouse over su grafo
    function contentNodeTip(d) {
        var value = 0;
        if (NumberSentPackets.has(d.id) !== false && d.group === "1")
            value = NumberSentPackets.get(d.id);
        if (NumberDeliveredPackets.has(d.id) !== false && d.group === "2")
            value = NumberDeliveredPackets.get(d.id);
        var content = "<h5 align ='center'>NODE</h5>";
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
        if (resetLegend == true) {
            selectionLegendBegin = parseInt(legendscale.invert(-121));
            selectionLegendEnd = parseInt(legendscale.invert(55795));
            resetLegend = false;
        } else {
            selectionLegendBegin = parseInt(legendscale.invert(d3.brushSelection(d3.select(".brushLegend").node())[0]));
            selectionLegendEnd = parseInt(legendscale.invert(d3.brushSelection(d3.select(".brushLegend").node())[1]));
        }

        for (var i = 0; i < data.nodes.length; i++) {

            if ((NumberSentPackets.get(data.nodes[i]["id"]) >= selectionLegendBegin && NumberSentPackets.get(data.nodes[i]["id"]) <= selectionLegendEnd))
                displayElements.push(data.nodes[i]["id"]);
            if (NumberDeliveredPackets.get(data.nodes[i]["id"]) >= selectionLegendBegin && NumberDeliveredPackets.get(data.nodes[i]["id"]) <= selectionLegendEnd)
                displayElements.push(data.nodes[i]["id"]);
        }
        handleFilterLegend(displayElements);
    }

    function handleFilterLegend(nodes) {
        d3.select("#graph").selectAll("line")
            .style("display", function (d) {
                if (nodes.includes(d.source.id) || nodes.includes(d.target.id))
                    return "block";
                else
                    return "none";
            });

        d3.select("#PCA").selectAll(".notSelected")
            .style("display", function (d) {
                if (nodes.includes(d.source.id) || nodes.includes(d.target.id))
                    return "block";
                else
                    return "none";
            });
        d3.select("#PCA").selectAll(".selected")
            .style("opacity", function (d) {
                if (nodes.includes(d.source.id) || nodes.includes(d.target.id))
                    return "1";
                else
                    return "0";
            });
        d3.select("#scatterPlot").selectAll(".dotDestination")
            .style("display", function (d) {
                if (nodes.includes(d.source.id) || nodes.includes(d.target.id))
                    return "block";
                else
                    return "none"
            });
    }

    function showAllGraph() {
        d3.select("#graph").selectAll("line").style("display", "block");
        d3.select("#graph").selectAll("circle").style("display", "block");
        d3.select("#graph").selectAll("text").style("display", "block");
    }

    function buildMapPacket(data) {
        NumberDeliveredPackets = new Map();
        NumberSentPackets = new Map();
        transferPackets = new Map();
        if (step === 1) {
            for (var i = 0; i < data.length; i++) {
                if (NumberSentPackets.has(data[i].source.id) === false)
                    NumberSentPackets.set(data[i].source.id, parseInt(data[i].TotalFwdPackets));
                else
                    NumberSentPackets.set(data[i].source.id, NumberSentPackets.get(data[i].source.id) + parseInt(data[i].TotalFwdPackets));
                if (NumberDeliveredPackets.has(data[i].target.id) === false)
                    NumberDeliveredPackets.set(data[i].target.id, parseInt(data[i].TotalFwdPackets));
                else
                    NumberDeliveredPackets.set(data[i].target.id, NumberDeliveredPackets.get(data[i].target.id) + parseInt(data[i].TotalFwdPackets));
                if (transferPackets.has(data[i].source.id + data[i].target.id) === false)
                    transferPackets.set(data[i].source.id + data[i].target.id, [parseInt(data[i].TotalFwdPackets), parseInt(data[i].TotalLenghtOfFwdPackets)]);
                else {
                    transferPackets.get(data[i].source.id + data[i].target.id)[0] = transferPackets.get(data[i].source.id + data[i].target.id)[0] + parseInt(data[i].TotalFwdPackets);
                    transferPackets.get(data[i].source.id + data[i].target.id)[1] = transferPackets.get(data[i].source.id + data[i].target.id)[1] + parseInt(data[i].TotalLenghtOfFwdPackets);
                }
            }
        }
        if (step === 0) {
            for (var i = 0; i < data.length; i++) {
                if (NumberSentPackets.has(data[i].source) === false)
                    NumberSentPackets.set(data[i].source, parseInt(data[i].TotalFwdPackets));
                else
                    NumberSentPackets.set(data[i].source, NumberSentPackets.get(data[i].source) + parseInt(data[i].TotalFwdPackets));
                if (NumberDeliveredPackets.has(data[i].target) === false)
                    NumberDeliveredPackets.set(data[i].target, parseInt(data[i].TotalFwdPackets));
                else
                    NumberDeliveredPackets.set(data[i].target, NumberDeliveredPackets.get(data[i].target) + parseInt(data[i].TotalFwdPackets));
                if (transferPackets.has(data[i].source + data[i].target) === false)
                    transferPackets.set(data[i].source + data[i].target, [parseInt(data[i].TotalFwdPackets), parseInt(data[i].TotalLenghtOfFwdPackets)]);
                else {
                    transferPackets.get(data[i].source + data[i].target)[0] = transferPackets.get(data[i].source + data[i].target)[0] + parseInt(data[i].TotalFwdPackets);
                    transferPackets.get(data[i].source + data[i].target)[1] = transferPackets.get(data[i].source + data[i].target)[1] + parseInt(data[i].TotalLenghtOfFwdPackets);
                }
            }
        }
    }

    function attackPackets(data) {
        attackDay1 = new Map();
        attackDay2 = new Map();
        attackDay3 = new Map();
        attackDay4 = new Map();
        for (var i = 0; i < data.length; i++) {
            switch (data[i].Timestamp.slice(0, -6)) {
                case "4/7/2017":
                    if (attackDay1.has(data[i].Label) === false)
                        attackDay1.set(data[i].Label, parseInt(data[i].TotalFwdPackets));
                    else
                        attackDay1.set(data[i].Label, attackDay1.get(data[i].Label) + parseInt(data[i].TotalFwdPackets));
                    break;
                case "5/7/2017":
                    if (attackDay2.has(data[i].Label) === false)
                        attackDay2.set(data[i].Label, parseInt(data[i].TotalFwdPackets));
                    else
                        attackDay2.set(data[i].Label, attackDay2.get(data[i].Label) + parseInt(data[i].TotalFwdPackets));
                    break;
                case "6/7/2017":
                    if (attackDay3.has(data[i].Label) === false)
                        attackDay3.set(data[i].Label, parseInt(data[i].TotalFwdPackets));
                    else
                        attackDay3.set(data[i].Label, attackDay3.get(data[i].Label) + parseInt(data[i].TotalFwdPackets));
                    break;
                case "7/7/2017":
                    if (attackDay4.has(data[i].Label) === false)
                        attackDay4.set(data[i].Label, parseInt(data[i].TotalFwdPackets));
                    else
                        attackDay4.set(data[i].Label, attackDay4.get(data[i].Label) + parseInt(data[i].TotalFwdPackets));
                    break;
            }
        }
    }

// built the scale for the packets
    function scalePacket() {
        var packets = [];
        max = d3.max(Array.from(NumberSentPackets.values()).concat(Array.from(NumberDeliveredPackets.values())));
        min = d3.min(Array.from(NumberSentPackets.values()).concat(Array.from(NumberDeliveredPackets.values())));
        colorScalePackets = d3.scaleSequential(d3.interpolateViridis).domain([0, max]);
        values = Array.from(transferPackets.values());
        for (var i = 0; i < values.length; i++) {
            packets.push(values[i][0]);
        }
        max = d3.max(packets);
        min = d3.min(packets);
        if (min == null)
            min = 0;
        if (max == null)
            max = 0;
        scalePackets = d3.scaleLinear().domain([0, max]).range([3, 27]);
    }

    function brushEmpty() {
        var empty = true;
        for (var i = 0; i < extents.length; i++) {
            for (var j = 0; j < 2; j++) {
                if (extents[i][j] !== 0)
                    return false;
            }
        }
        return empty
    }

    function FilterPorts() {
        PortSelected = [];
        raw = this.selectedOptions;
        for (var i = 0; i < raw.length; i++) {
            PortSelected.push(raw[i].__data__)
        }
        update()
    }

    function AddTargetPort(d) {
        if (DOTdestination.has(d.target.id.slice(0, -2)) === false) {
            DOTdestination.set(d.target.id.slice(0, -2), new Set());
            DOTdestination.get(d.target.id.slice(0, -2)).add(d.DestinationPort);
            return true;
        } else {
            if (DOTdestination.has(d.target.id.slice(0, -2))) {
                if (DOTdestination.get(d.target.id.slice(0, -2)).has(d.DestinationPort) === false) {
                    DOTdestination.get(d.target.id.slice(0, -2)).add(d.DestinationPort);
                    return true;
                } else {
                    return false;
                }
            }
        }
    }
}

