const width = 1000;
const height = 500;
const padding = 60;

const svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json').then(data => {
    const baseTemp = data.baseTemperature;
    const dataset = data.monthlyVariance;

    const xScale = d3.scaleBand()
        .domain(dataset.map(d => d.year))
        .range([padding, width - padding])
        .padding(0.01);

    const yScale = d3.scaleBand()
        .domain(dataset.map(d => d.month))
        .range([height - padding, padding])
        .padding(0.01);

    const colorScale = d3.scaleSequential(d3.interpolateCool)
        .domain([d3.min(dataset, d => d.variance), d3.max(dataset, d => d.variance)]);

    const xAxis = d3.axisBottom(xScale)
        .tickValues(xScale.domain().filter(year => year % 10 === 0))
        .tickFormat(d3.format("d"));

    const yAxis = d3.axisLeft(yScale)
        .tickFormat(month => {
            const date = new Date(0);
            date.setUTCMonth(month - 1);
            return d3.timeFormat("%B")(date);
        });

    svg.append('g')
        .attr('id', 'x-axis')
        .attr('transform', `translate(0, ${height - padding})`)
        .call(xAxis);

    svg.append('g')
        .attr('id', 'y-axis')
        .attr('transform', `translate(${padding}, 0)`)
        .call(yAxis);

    svg.selectAll('.cell')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('class', 'cell')
        .attr('x', d => xScale(d.year))
        .attr('y', d => yScale(d.month))
        .attr('width', xScale.bandwidth())
        .attr('height', yScale.bandwidth())
        .attr('data-month', d => d.month)
        .attr('data-year', d => d.year)
        .attr('data-temp', d => baseTemp + d.variance)
        .style('fill', d => colorScale(d.variance))
        .on('mouseover', (event, d) => {
            d3.select('#tooltip')
                .style('opacity', 1)
                .html(`Year: ${d.year}<br>Month: ${d.month}<br>Temperature: ${(baseTemp + d.variance).toFixed(2)}℃<br>Variance: ${d.variance.toFixed(2)}℃`)
                .attr('data-year', d.year)
                .style('left', `${event.pageX + 5}px`)
                .style('top', `${event.pageY - 28}px`);
        })
        .on('mouseout', () => {
            d3.select('#tooltip')
                .style('opacity', 0);
        });

    const legend = svg.append('g')
        .attr('id', 'legend')
        .attr('transform', `translate(${width - padding * 2}, ${padding})`);

    const legendColors = d3.range(d3.min(dataset, d => d.variance), d3.max(dataset, d => d.variance), (d3.max(dataset, d => d.variance) - d3.min(dataset, d => d.variance)) / 10);

    legend.selectAll('rect')
        .data(legendColors)
        .enter()
        .append('rect')
        .attr('x', (d, i) => i * 30)
        .attr('y', 0)
        .attr('width', 30)
        .attr('height', 20)
        .style('fill', d => colorScale(d));
});
