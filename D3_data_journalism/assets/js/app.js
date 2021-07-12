var height = 600;
var width = 1000;
var XAxis = 'poverty'
// var test = parseFloat(d[XAxis])


// max with and max height

// margins
var margin = {
    top: 50,
    right: 50,
    bottom: 100,
    left: 100
};

// chart area minus margins
var chartHeight = height - margin.top - margin.bottom;
var chartWidth = width - margin.left - margin.right;

// create svg container
var svg = d3.select('#scatter').append('svg')
    .attr('height', height)
    .attr('width', width)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .attr('id', 'bar_chart');

var labelsGroup = svg.append('g')
    .attr('transform', `translate(${width / 2}, ${chartHeight + 20})`);


// Add Y axis label grouping
svg.append('g')
    .attr('transform', `translate(-25, ${chartHeight / 2}) rotate(-90)`)
    .append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('value', 'healthcare')
    .text(' Lacks Healthcare (%)');


// X axis label grouping
labelsGroup.append('text')
    .attr('x', 0)
    .attr('y', 20)
    .attr('value', 'poverty') // value to grab for event listener
    .text('In Poverty (%)');

// Define update functions that will be called when user selection is made
function xScale_update(data, XAxis) {
    /* Generate yScale based on selected value */

    var xLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[XAxis])])
        .range([0, chartWidth]);

    return xLinearScale
}

function renderAxes(newXScale, xAxis_g) {
    /*Update xAxis with new scale value */

    var bottomAxis = d3.axisBottom(newXScale);

    xAxis_g.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis_g;
}

function UpdateBars(circleGroup, newXScale) {
    /* function used for updating circles group by clicking on event listener */
    circleGroup
        .transition()
        .duration(1000)
        .attr('cx', d => newXScale(d[XAxis]));

    return;
}
d3.csv('/assets/data/data.csv')
    .then(function (health_poverty_data) {
        // console.log("***********total info****************")
        // console.log(health_poverty_data)
        // Y axis: Testing to see if there is a string vs integer
        var ymin = d3.min(health_poverty_data.map(d => parseFloat(d['healthcare'])));
        var ymax = d3.max(health_poverty_data.map(d => parseFloat(d['healthcare'])));
        var state_abbr = health_poverty_data.map(d => d.abbr);
        console.log("**********state_abbreviation*****************");
        console.log(state_abbr);
        



        var yScale = d3.scaleLinear()
            // .domain([0, d3.max(health_poverty_data.map(d => parseFloat(d['healthcare'])))])
            .domain([ymin, ymax])
            .range([chartHeight, 0]);

        // X axis: Testing to see if there is a string vs integer

        var xmin = d3.min(health_poverty_data, d => parseFloat(d[XAxis]))
        var xmax = d3.max(health_poverty_data, d => parseFloat(d[XAxis]))
  



        var xScale = d3.scaleLinear()
            // .domain([0, d3.max(health_poverty_data, d => parseFloat(d[XAxis]))])
            // .domain([0, d3.max(health_poverty_data, d => d[XAxis])])
            .domain([xmin, xmax])
            .range([0, chartWidth])

        // Create axes for Svg
        var yAxis_func = d3.axisLeft(yScale);
        var xAxis_func = d3.axisBottom(xScale);

        // set x to the bottom of the chart
        var xAxis_g = svg.append('g')
            .attr('id', 'xaxis')
            .attr('transform', `translate(0, ${chartHeight})`)
            .call(xAxis_func);

        // Assign YAxis to variable so we can update it later
        var yAxis_g = svg.append('g')
            .attr('id', 'yaxis')
            .call(yAxis_func);

        var checkP = health_poverty_data[0].poverty
        console.log("*********Testing Data***************")
        console.log(checkP)
        console.log(typeof (checkP))



        var circleGroup = svg.selectAll('circle')
            .data(health_poverty_data)
            .enter()
            // .append('g')
        circleGroup.append('circle')
            .attr('cx', d => xScale(parseFloat(d['poverty'])))
            .attr('cy', d => yScale(d['healthcare']))
            .attr('r', 8)
            .classed('moreInfo', true)
            // .attr('fill', d => [d['abbr']])
            .attr('fill', 'green')


        circleGroup.append("text")
            // We return the abbreviation to .text, which makes the text the abbreviation.
            .text(function(d) {
            return d.abbr;
            })
            .attr('dx', d => xScale(parseFloat(d['poverty'])))
            .attr("text-anchor", "middle") 
            .attr('alignment-baseline', 'middle')
            .attr('dy', d => yScale(d['healthcare']))
            .attr("class", "text_info")
            .style('font-size', 9)
            .attr('fill', 'white')


        
            circleGroup.on('mouseover', function(d, i){
                d3.select(this)
                .transition()
                .duration(300) 
                .attr('r', 10)
                .attr('fill', 'orange')

            })

            circleGroup.on('mouseout', function(){
                d3.select(this)
                .transition()
                .attr('r', 8)
                .attr('fill', 'blue')
                .style('font-size', 10)
                // .attr('text', d => d.abbr)
                // toolTip.style('display', 'none');

            })

                
             

    })