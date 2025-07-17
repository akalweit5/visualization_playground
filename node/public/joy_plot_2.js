d3.tsv("data/multisample_plot_data_2.tsv", d3.autoType)
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

    // const color = d3
    //   .scaleOrdinal(d3.schemeCategory10) // Or use d3.schemeTableau10
    //   .domain(series.map((d) => d.sample));

    // const colorMap = new Map();
    // series.forEach((d) => {
    //   colorMap.set(d.sample, color(d.sample));
    // });

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
      .attr("fill", "lightgray") //(d) => colorMap.get(d.sample))
      // .attr("fill-opacity", 0.75)
      .attr("d", (d) => area(d.coverages));

    group
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("d", (d) => line(d.coverages));

    // Tooltip rendering
    const tooltip = d3.select("#tooltip");
    createTooltip(tooltip);

    const bisect = d3.bisector((d) => d).center;

    group.on("click", function (event, d) {
      const modalOverlay = d3.select("#modal-overlay");
      const modalContent = d3.select("#modal-content");
      modalContent.html(""); // Clear previous content

      createTooltip(tooltip);

      // Add header
      modalContent
        .append("div")
        .style("margin-bottom", "8px")
        .style("font-weight", "bold")
        .style("text-align", "center")
        .text(`Sample: ${d.sample}`);

      // Append graph
      const container = modalContent
        .append("div")
        .attr("id", "single_plot")
        .node();

      renderSingleCoveragePlot(d.sample, coverage, container);

      // Show modal
      modalOverlay.style("display", "flex");

      // Stop propagation to prevent immediate close
      event.stopPropagation();
    });

    group
      .on("mouseenter", function (event, d) {
        tooltip.style("opacity", 1);
      })
      .on("mousemove", function (event, d) {
        const [xm] = d3.pointer(event);
        const x0 = x.invert(xm);
        const i = bisect(position, x0);
        const pos = position[i];
        const cov = d.coverages[i];

        if (typeof cov !== "number") return;

        // Marker dot
        let marker = d3.select(this).select(".hover-dot");

        if (marker.empty()) {
          marker = d3
            .select(this)
            .append("circle")
            .attr("class", "hover-dot")
            .attr("r", 3)
            .attr("fill", "black");
        }

        marker.attr("cx", x(pos)).attr("cy", z(cov));

        tooltip
          .html(
            `<b>Sample:</b> ${d.sample}<br/><b>Position:</b> ${pos}<br/><b>Coverage:</b> ${cov}`
          )
          .style("left", event.pageX + 15 + "px")
          .style("top", event.pageY - 30 + "px");
      })
      .on("mouseleave", function () {
        tooltip.style("opacity", 0);
        d3.select(this).select(".hover-dot").remove();
      });

    document.getElementById("joy_plot").append(svg.node());

    // Helper: coverage line chart for a single sample
  })
  .catch((error) => {
    console.error("Error loading or processing data:", error);
  });

d3.select("#modal-overlay").on("click", function (event) {
  if (event.target.id === "modal-overlay") {
    d3.select("#modal-overlay").style("display", "none");
  }
});

function renderSingleCoveragePlot(sampleName, coverageData, targetElement) {
  const sampleData = coverageData
    .filter((d) => d.sample === sampleName)
    .sort((a, b) => d3.ascending(+a.position, +b.position));

  if (sampleData.length === 0) return;

  const width = 1250;
  const height = 600;
  const margin = { top: 20, right: 10, bottom: 40, left: 45 };

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

  // Horizontal grid lines (Y axis)
  svg
    .append("g")
    .attr("class", "grid y-grid")
    .attr("transform", `translate(${margin.left},0)`)
    .call(
      d3
        .axisLeft(y)
        .ticks(4)
        .tickSize(-width + margin.left + margin.right)
        .tickFormat("")
    );

  // Vertical grid lines (X axis)
  svg
    .append("g")
    .attr("class", "grid x-grid")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(
      d3
        .axisBottom(x)
        .ticks(5)
        .tickSize(-height + margin.top + margin.bottom)
        .tickFormat("")
    );

  // Line path
  svg
    .append("path")
    .datum(sampleData)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", line);

  // X axis with label
  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(5));

  svg
    .append("text")
    .attr("x", (width - margin.left - margin.right) / 2 + margin.left)
    .attr("y", height - 5)
    .attr("text-anchor", "middle")
    .attr("fill", "black")
    .attr("font-size", "14px")
    .text("Position");

  // Y axis with label
  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(4));

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -((height - margin.top - margin.bottom) / 2) - 20)
    .attr("y", 10)
    .attr("text-anchor", "middle")
    .attr("fill", "black")
    .attr("font-size", "14px")
    .text("Coverage");

  // Optional: style the grid lines (CSS)
  svg
    .selectAll(".grid line")
    .attr("stroke", "#ccc")
    .attr("stroke-dasharray", "2,2");

  svg.selectAll(".grid path").remove(); // Remove axis line for cleaner look

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
