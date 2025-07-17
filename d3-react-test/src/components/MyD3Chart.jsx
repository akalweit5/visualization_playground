import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const MyD3Chart = () => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (!d3Container.current) return;

    // Clear any existing content
    d3.select(d3Container.current).selectAll("*").remove();

    d3.tsv(process.env.PUBLIC_URL + "/data/30606-auto-cell-type.rmd.tsv", d3.autoType)
      .then(coverage => {
        const margin = { top: 30, right: 0, bottom: 10, left: 300 },
              barHeight = 25,
              width = 1250,
              height = Math.ceil((coverage.length + 0.1) * barHeight) + margin.top + margin.bottom;

        const x = d3.scaleLinear()
          .domain([0, d3.max(coverage, d => d.proportion_greater_than_specified_length)])
          .range([margin.left, width - margin.right]);

        const y = d3.scaleBand()
          .domain(d3.sort(coverage, d => -d.proportion_greater_than_specified_length).map(d => d.sample_id))
          .rangeRound([margin.top, height - margin.bottom])
          .padding(0.1);

        const format = x.tickFormat(20, "%");

        const svg = d3.create("svg")
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", [0, 0, width, height])
          .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;")
          .call(zoom);

        svg.append("g")
          .attr("class", "bars")
          .selectAll("rect")
          .data(coverage)
          .join("rect")
          .attr("x", x(0))
          .attr("y", d => y(d.sample_id))
          .attr("width", d => x(d.proportion_greater_than_specified_length) - x(0))
          .attr("height", y.bandwidth())
          .attr("fill", d => d.proportion_greater_than_specified_length < 0.9 ? "red" : "green");

        svg.append("g")
          .attr("fill", "white")
          .attr("class", "bar-labels")
          .attr("text-anchor", "end")
          .selectAll("text")
          .data(coverage)
          .join("text")
          .attr("x", d => x(d.proportion_greater_than_specified_length))
          .attr("y", d => y(d.sample_id) + y.bandwidth() / 2)
          .attr("dy", "0.35em")
          .attr("dx", -4)
          .style("font-size", "15px")
          .text(d => format(d.proportion_greater_than_specified_length))
          .call(text =>
            text.filter(d => x(d.proportion_greater_than_specified_length) - x(0) < 20)
              .attr("dx", +4)
              .attr("fill", "black")
              .attr("text-anchor", "start")
          );

        svg.append("g")
          .attr("transform", `translate(0,${margin.top})`)
          .attr("class", "x-axis")
          .call(d3.axisTop(x).ticks(width / 80, "%"))
          .call(g => g.select(".domain").remove())
          .selectAll("text").style("font-size", "15px");

        svg.append("g")
          .attr("transform", `translate(${margin.left},0)`)
          .attr("class", "y-axis")
          .call(d3.axisLeft(y).tickSizeOuter(0))
          .call(g => g.select(".domain").remove())
          .selectAll("text").style("font-size", "15px");

        function zoom(svg) {
          const extent = [[margin.left, margin.top], [width - margin.right, height - margin.bottom]];

          svg.call(d3.zoom()
            .scaleExtent([1, 8])
            .translateExtent(extent)
            .extent(extent)
            .on("zoom", zoomed));

          function zoomed(event) {
            const transform = event.transform;
            const newY = y.copy().range(y.range().map(d => transform.applyY(d)));
            const newX = x.copy().range(x.range().map(d => transform.applyX(d)));

            svg.selectAll("rect")
              .attr("y", d => newY(d.sample_id))
              .attr("height", newY.bandwidth());

            svg.select(".y-axis")
              .call(d3.axisLeft(newY).tickSizeOuter(0))
              .selectAll("text").style("font-size", "15px");

            svg.select(".x-axis")
              .call(d3.axisTop(newX).ticks(width / 80, "%"))
              .selectAll("text").style("font-size", "15px");

            svg.selectAll(".bar-labels").style("display", transform.k === 1 ? null : "none");
          }
        }

        d3Container.current.appendChild(svg.node());
      })
      .catch(error => {
        console.error("Error loading or processing data:", error);
      });

  }, []);

  return <div ref={d3Container} />;
};

export default MyD3Chart;
