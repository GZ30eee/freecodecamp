const width = 800;
const height = 400;
const padding = 40;

const svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json').then(data => {
    const xScale = d3.scaleTime()
        .domain([d3.min(data, d => new Date(d.Year - 1, 0, 1)), d3.max(data, d => new Date(d.Year + 1, 0, 1))])
        .range([padding, width - padding]);

    const yScale = d3.scaleTime()
        .domain([d3.min(data, d => new Date(1970, 0, 1, 0, d.Seconds)), d3.max(data, d => new Date(1970, 0, 1, 0, d.Seconds))])
        .range([height - padding, padding]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

    svg.append('g')
        .attr('id', 'x-axis')
        .attr('transform', `translate(0, ${height - padding})`)
        .call(xAxis);

    svg.append('g')
        .attr('id', 'y-axis')
        .attr('transform', `translate(${padding}, 0)`)
        .call(yAxis);

    svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', d => xScale(new Date(d.Year, 0, 1)))
        .attr('cy', d => yScale(new Date(1970, 0, 1, 0, d.Seconds)))
        .attr('r', 5)
        .attr('data-xvalue', d => d.Year)
        .attr('data-yvalue', d => new Date(1970, 0, 1, 0, d.Seconds))
        .on('mouseover', (event, d) => {
            d3.select('#tooltip')
                .style('opacity', 1)
                .html(`Year: ${d.Year}<br>Time: ${d.Time}`)
                .attr('data-year', d.Year)
                .style('left', `${event.pageX + 5}px`)
                .style('top', `${event.pageY - 28}px`);
        })
        .on('mouseout', () => {
            d3.select('#tooltip')
                .style('opacity', 0);
        });

    svg.append('text')
        .attr('id', 'legend')
        .attr('x', width - padding)
        .attr('y', padding)
        .attr('text-anchor', 'end')
        .text('Legend: Cyclist Data');
});
