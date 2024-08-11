import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const BarChart = () => {
  const chartRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    // Fetch the data
    d3.json(
      "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
    ).then((data) => {
      const dataset = data.data;

      // Set up chart dimensions
      const margin = { top: 20, right: 20, bottom: 70, left: 70 };
      const width = 800 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      // Create SVG element
      const svg = d3
        .select(chartRef.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Create x and y scales
      const xScale = d3
        .scaleTime()
        .domain([
          new Date(d3.min(dataset, (d) => d[0])),
          new Date(d3.max(dataset, (d) => d[0])),
        ])
        .range([0, width]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(dataset, (d) => d[1])])
        .range([height, 0]);

      // Create x and y axes
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      svg
        .append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

      svg.append("g").attr("id", "y-axis").call(yAxis);

      // Create bars
      svg
        .selectAll(".bar")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("data-date", (d) => d[0])
        .attr("data-gdp", (d) => d[1])
        .attr("x", (d) => xScale(new Date(d[0])))
        .attr("y", (d) => yScale(d[1]))
        .attr("width", width / dataset.length)
        .attr("height", (d) => height - yScale(d[1]))
        .on("mouseover", showTooltip)
        .on("mouseout", hideTooltip);

      // Create tooltip
      const tooltip = d3.select(tooltipRef.current);

      function showTooltip(event, d) {
        const date = new Date(d[0]);
        const formattedDate = `${date.getFullYear()} Q${
          Math.floor(date.getMonth() / 3) + 1
        }`;

        tooltip
          .style("opacity", 0.9)
          .attr("data-date", d[0])
          .html(`${formattedDate}<br>$${d[1]} Billion`)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`);
      }

      function hideTooltip() {
        tooltip.style("opacity", 0);
      }
    });
  }, []);

  return (
    <div>
      <h1 id="title">United States GDP</h1>
      <svg ref={chartRef}></svg>
      <div id="tooltip" ref={tooltipRef}></div>
    </div>
  );
};

export default BarChart;
