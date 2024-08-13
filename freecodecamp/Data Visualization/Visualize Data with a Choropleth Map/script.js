const width = 1000;
const height = 600;
const padding = 60;

const svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

const educationDataUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
const countyDataUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';

Promise.all([d3.json(educationDataUrl), d3.json(countyDataUrl)]).then(([educationData, countyData]) => {
    const education = educationData;
    const counties = topojson.feature(countyData, countyData.objects.counties).features;

    const colorScale = d3.scaleThreshold()
        .domain([10, 20, 30, 40])
        .range(d3.schemeBlues[5]);

    svg.selectAll('.county')
        .data(counties)
        .enter()
        .append('path')
        .attr('class', 'county')
        .attr('d', d3.geoPath())
        .attr('data-fips', d => d.id)
        .attr('data-education', d => {
            const result = education.find(obj => obj.fips === d.id);
            return result ? result.bachelorsOrHigher : 0;
        })
        .attr('fill', d => {
            const result = education.find(obj => obj.fips === d.id);
            return result ? colorScale(result.bachelorsOrHigher) : colorScale(0);
        })
        .on('mouseover', (event, d) => {
            const result = education.find(obj => obj.fips === d.id);
            d3.select('#tooltip')
                .style('opacity', 1)
                .html(`County: ${result.area_name}, ${result.state}<br>Education: ${result.bachelorsOrHigher}%`)
                .attr('data-education', result.bachelorsOrHigher)
                .style('left', `${event.pageX + 5}px`)
                .style('top', `${event.pageY - 28}px`);
        })
        .on('mouseout', () => {
            d3.select('#tooltip')
                .style('opacity', 0);
        });

    const legend = svg.append('g')
        .attr('id', 'legend')
        .attr('transform', `translate(${width - padding * 2}, ${height / 2})`);

    const legendColors = [10, 20, 30, 40];

    legend.selectAll('rect')
        .data(legendColors)
        .enter()
        .append('rect')
        .attr('x', 0)
        .attr('y', (d, i) => i * 20)
        .attr('width', 20)
        .attr('height', 20)
        .style('fill', d => colorScale(d));

    legend.selectAll('text')
        .data(legendColors)
        .enter()
        .append('text')
        .attr('x', 30)
        .attr('y', (d, i) => i * 20 + 15)
        .text(d => `${d}%`);
});
