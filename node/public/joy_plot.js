// const tooltip = d3.select("body").append("div").attr("class", "tooltip");
// createTooltip(tooltip);

// d3.tsv("data/multisample_plot_data.tsv", d3.autoType).then(coverage => {
//   const position = Array.from(d3.group(coverage, d => +d.position).keys()).sort(d3.ascending);
//   const series = d3.groups(coverage, d => d.sample).map(([sample, coverages]) => {
//     const coverage = new Map(coverages.map(d => [+d.position, d.coverage]));
//     return { sample, coverages: position.map(d => coverage.get(d)) };
//   });

//   // Specify the chart’s dimensions.
//   const overlap = 8;
//   const width = 1700;
//   //   const height = series.length * 100;
//   const marginTop = 250;
//   const marginRight = 20;
//   const marginBottom = 50;
//   const marginLeft = 120;
//   const spacing = 4;
//   const height = marginTop + marginBottom + overlap * spacing * series.length;

//   // Create the scales.
//   const x = d3.scaleLinear()
//     .domain(d3.extent(position))
//     .range([marginLeft, width - marginRight]);

//   const y = d3.scalePoint()
//     .domain(series.map(d => d.sample))
//     .range([marginTop, height - marginBottom]);

//   const z = d3.scaleLinear()
//     .domain([0, d3.max(series, d => d3.max(d.coverages))]).nice()
//     .range([0, -200]);

//   // color randomizer
//   const colorMap = new Map();

//   series.forEach(d => {
//     // Use d3.color for valid color formatting, or generate hex colors
//     colorMap.set(d.sample, d3.interpolateRainbow(Math.random()));
//   });

//   // Create the area generator and its top-line generator.
//   const area = d3.area()
//     .curve(d3.curveBasis)
//     .defined(d => !isNaN(d))
//     .x((d, i) => x(position[i]))
//     .y0(0)
//     .y1(d => z(d));

//   const line = area.lineY1();

//   // Create the SVG container.
//   const svg = d3.create("svg")
//     .attr("width", width)
//     .attr("height", height)
//     .attr("viewBox", [0, 0, width, height])
//     .attr("style", "max-width: 100%; height: auto;");
//   //   .attr("style", "max-width: 100%; height: auto; border: 1px solid red;");

//   // Append the axes.
//   svg.append("g")
//     .attr("transform", `translate(0,${height - marginBottom})`)
//     .call(d3.axisBottom(x)
//       .ticks(width / 80)
//       .tickSizeOuter(0));

//   svg.append("g")
//     .attr("transform", `translate(${marginLeft},0)`)
//     .call(d3.axisLeft(y).tickSize(0).tickPadding(4))
//     .call(g => g.select(".domain").remove());

//   // x-axis label
//   svg.append("text")
//     .attr("text-anchor", "middle")
//     .attr("x", (width + marginLeft - marginRight) / 2)
//     .attr("y", height - 5) // slightly below the axis; adjust as needed
//     .text("Position"); // <-- change to your desired label

//   // Append a layer for each series.
//   const group = svg.append("g")
//     .selectAll("g")
//     .data(series)
//     .join("g")
//     .on("mouseenter", function (event, d) {
//       tooltip.transition().duration(200).style("opacity", 1);
//       tooltip.html(getTooltipContent(d));
//     })
//     .on("mousemove", function (event) {
//       s
//       tooltip
//         .style("left", (event.pageX + 10) + "px")
//         .style("top", (event.pageY - 20) + "px");
//     })
//     .on("mouseleave", function () {
//       tooltip.transition().duration(200).style("opacity", 0);
//     })
//     .attr("transform", d => `translate(0,${y(d.sample) + 1})`)
//     .attr("class", "sample-group")
//     .attr("data-sample", d => d.sample);

//   group.append("path")
//     .attr("fill", d => colorMap.get(d.sample))
//     .attr("fill-opacity", 0.5)
//     .attr("d", d => area(d.coverages));

//   group.append("path")
//     .attr("fill", "none")
//     .attr("stroke", "black")
//     .attr("d", d => line(d.coverages));

//   document.getElementById("joy_plot").append(svg.node());

// }).catch(error => {
//   console.error("Error loading or processing data:", error);
// });

// //attempting to add tooltips
// function getTooltipContent(d) {
//   return `<div id="single_plot"></div>`;
// }

// // Tooltip creation
// function createTooltip(el) {
//   el
//     .style("position", "absolute")
//     .style("pointer-events", "none")
//     .style("top", 0)
//     .style("opacity", 0)
//     .style("background", "white")
//     .style("border-radius", "5px")
//     .style("box-shadow", "0 0 10px rgba(0,0,0,.25)")
//     .style("padding", "10px")
//     .style("line-height", "1.3")
//     .style("font", "11px sans-serif");
// }

// function renderSingleCoveragePlot(sampleName, coverageData) {
//   // Filter the data for the given sample
//   const sampleData = coverageData
//     .filter(d => d.sample === sampleName)
//     .sort((a, b) => d3.ascending(+a.position, +b.position));

//   if (sampleData.length === 0) {
//     console.warn(`Sample "${sampleName}" not found.`);
//     return;
//   }

//   // Extract dimensions
//   const width = 1000;
//   const height = 400;
//   const margin = { top: 40, right: 30, bottom: 50, left: 60 };

//   // Scales
//   const x = d3.scaleLinear()
//     .domain(d3.extent(sampleData, d => +d.position))
//     .range([margin.left, width - margin.right]);

//   const y = d3.scaleLinear()
//     .domain([0, d3.max(sampleData, d => d.coverage)]).nice()
//     .range([height - margin.bottom, margin.top]);

//   // Line generator
//   const line = d3.line()
//     .x(d => x(+d.position))
//     .y(d => y(d.coverage))
//     .curve(d3.curveMonotoneX);

//   // Create SVG
//   const svg = d3.create("svg")
//     .attr("width", width)
//     .attr("height", height)
//     .attr("viewBox", [0, 0, width, height])
//     .attr("style", "max-width: 100%; height: auto;");

//   // X axis
//   svg.append("g")
//     .attr("transform", `translate(0,${height - margin.bottom})`)
//     .call(d3.axisBottom(x))
//     .append("text")
//     .attr("x", width / 2)
//     .attr("y", 40)
//     .attr("fill", "black")
//     .attr("text-anchor", "middle")
//     .text("Position");

//   // Y axis
//   svg.append("g")
//     .attr("transform", `translate(${margin.left},0)`)
//     .call(d3.axisLeft(y))
//     .append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("x", -height / 2)
//     .attr("y", -45)
//     .attr("fill", "black")
//     .attr("text-anchor", "middle")
//     .text("Coverage");

//   // Draw line
//   svg.append("path")
//     .datum(sampleData)
//     .attr("fill", "none")
//     .attr("stroke", "steelblue")
//     .attr("stroke-width", 2)
//     .attr("d", line);

//   // Append to DOM
//   document.getElementById("single_plot").innerHTML = ''; // clear previous
//   document.getElementById("single_plot").append(svg.node());
// }

d3.tsv("data/multisample_plot_data.tsv", d3.autoType)
  .then((coverage) => {
    const position = Array.from(
      d3.group(coverage, (d) => +d.position).keys()
    ).sort(d3.ascending);
    const series = d3
      .groups(coverage, (d) => d.sample)
      .map(([sample, coverages]) => {
        const coverageMap = new Map(
          coverages.map((d) => [+d.position, d.coverage])
        );
        return { sample, coverages: position.map((d) => coverageMap.get(d)) };
      });

    const overlap = 8;
    const width = 1700;
    const marginTop = 250;
    const marginRight = 20;
    const marginBottom = 50;
    const marginLeft = 120;
    const spacing = 4;
    const height = marginTop + marginBottom + overlap * spacing * series.length;

    const x = d3
      .scaleLinear()
      .domain(d3.extent(position))
      .range([marginLeft, width - marginRight]);

    const y = d3
      .scalePoint()
      .domain(series.map((d) => d.sample))
      .range([marginTop, height - marginBottom]);

    const z = d3
      .scaleLinear()
      .domain([0, d3.max(series, (d) => d3.max(d.coverages))])
      .nice()
      .range([0, -200]);

    const colorMap = new Map();
    series.forEach((d) => {
      colorMap.set(d.sample, d3.interpolateRainbow(Math.random()));
    });

    const area = d3
      .area()
      .curve(d3.curveBasis)
      .defined((d) => !isNaN(d))
      .x((d, i) => x(position[i]))
      .y0(0)
      .y1((d) => z(d));

    const line = area.lineY1();

    const svg = d3
      .create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(width / 80)
          .tickSizeOuter(0)
      );

    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).tickSize(0).tickPadding(4))
      .call((g) => g.select(".domain").remove());

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", (width + marginLeft - marginRight) / 2)
      .attr("y", height - 5)
      .text("Position");

    const group = svg
      .append("g")
      .selectAll("g")
      .data(series)
      .join("g")
      .attr("transform", (d) => `translate(0,${y(d.sample) + 1})`)
      .attr("class", "sample-group")
      .attr("data-sample", (d) => d.sample);

    group
      .append("path")
      .attr("fill", (d) => colorMap.get(d.sample))
      .attr("fill-opacity", 0.5)
      .attr("d", (d) => area(d.coverages));

    group
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("d", (d) => line(d.coverages));

    // Tooltip rendering
    const tooltip = d3.select("#tooltip");
    createTooltip(tooltip);

    group
      .on("mouseenter", function (event, d) {
        tooltip.transition().duration(100).style("opacity", 1);
        tooltip.html(""); // clear previous
        tooltip
          .style("left", `${event.pageX + 20}px`)
          .style("top", `${event.pageY - 20}px`);

        tooltip
          .append("div")
          .style("margin-bottom", "8px")
          .style("font-weight", "bold")
          .text(`Sample: ${d.sample}`);

        const subDiv = tooltip.append("div").attr("id", "single_plot");

        renderSingleCoveragePlot(d.sample, coverage, subDiv.node());
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", `${event.pageX + 20}px`)
          .style("top", `${event.pageY - 20}px`);
      })
      .on("mouseleave", function () {
        tooltip.transition().duration(200).style("opacity", 0);
      });

    document.getElementById("joy_plot").append(svg.node());

    // Helper: coverage line chart for a single sample
    function renderSingleCoveragePlot(sampleName, coverageData, targetElement) {
      const sampleData = coverageData
        .filter((d) => d.sample === sampleName)
        .sort((a, b) => d3.ascending(+a.position, +b.position));

      if (sampleData.length === 0) return;

      const width = 750;
      const height = 450;
      const margin = { top: 20, right: 10, bottom: 40, left: 60 };

      const x = d3
        .scaleLinear()
        .domain(d3.extent(sampleData, (d) => +d.position))
        .range([margin.left, width - margin.right]);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(sampleData, (d) => d.coverage)])
        .nice()
        .range([height - margin.bottom, margin.top]);

      const line = d3
        .line()
        .x((d) => x(+d.position))
        .y((d) => y(d.coverage))
        .curve(d3.curveMonotoneX);

      const svg = d3
        .create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("style", "display: block;");

      // X axis
      svg
        .append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(5))
        .append("text")
        .attr("x", (width - margin.left - margin.right) / 2 + margin.left)
        .attr("y", 30)
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .text("Position");

      // Y axis
      svg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(4))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -((height - margin.top - margin.bottom) / 2))
        .attr("y", -35)
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .text("Coverage");

      // Line path
      svg
        .append("path")
        .datum(sampleData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

      targetElement.appendChild(svg.node());
    }

    function createTooltip(el) {
      el.style("position", "absolute")
        .style("pointer-events", "none")
        .style("top", 0)
        .style("opacity", 0)
        .style("background", "white")
        .style("border-radius", "5px")
        .style("box-shadow", "0 0 10px rgba(0,0,0,.25)")
        .style("padding", "10px")
        .style("line-height", "1.3")
        .style("font", "11px sans-serif");
    }
  })
  .catch((error) => {
    console.error("Error loading or processing data:", error);
  });
