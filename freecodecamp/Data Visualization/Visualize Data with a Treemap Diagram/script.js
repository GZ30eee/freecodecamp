const width = 1000;
const height = 600;
const padding = 60;

const svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

const datasetUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json';

d3.json(datasetUrl).then(data => {
    const root = d3.hierarchy(data)
        .eachBefore(d => d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name)
        .sum(d => d.value)
        .sort((a, b) => b.height - a.height || b.value - a.value);

    d3.treemap()
        .size([width, height])
        .paddingInner(1)
        (root);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const cell = svg.selectAll("g")
        .data(root.leaves())
        .enter().append("g")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);

    cell.append("rect")
        .attr("class", "tile")
        .attr("id", d => d.data.id)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("data-name", d => d.data.name)
        .attr("data-category", d => d.data.category)
        .attr("data-value", d => d.data.value)
        .attr("fill", d => color(d.data.category))
        .on("mouseover", (event, d) => {
            d3.select("#tooltip")
                .style("opacity", 1)
                .html(`Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value: ${d.data.value}`)
                .attr("data-value", d.data.value)
                .style("left", `${event.pageX + 5}px`)
                .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", () => {
            d3.select("#tooltip")
                .style("opacity", 0);
        });

    cell.append("text")
        .attr("class", "tile-text")
        .selectAll("tspan")
        .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
        .enter().append("tspan")
        .attr("x", 4)
        .attr("y", (d, i) => 13 + i * 10)
        .text(d => d);

    const legend = svg.append("g")
        .attr("id", "legend")
        .attr("transform", `translate(${width - padding * 2}, ${padding})`);

    const categories = root.leaves().map(nodes => nodes.data.category)
        .filter((category, index, self) => self.indexOf(category) === index);

    const legendItem = legend.selectAll(".legend-item")
        .data(categories)
        .enter().append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    legendItem.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", d => color(d));

    legendItem.append("text")
        .attr("x", 30)
        .attr("y", 15)
        .text(d => d);
});
