import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { select, scaleBand, scaleLinear, axisLeft, max, easeQuad } from 'd3';

function RacingBarChart({ data, selectedYear, width, height }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const svg = select(svgRef.current);
    if (!dimensions.width || !dimensions.height || !data || !selectedYear) return;

    // Sorting the data
    data.sort((a, b) => b[selectedYear] - a[selectedYear]);

    // Find the maximum population
    const maxPopulation = max(data, (d) => d[selectedYear]);

    // Adjust xScale to fit the maximum population
    const xScale = d3
      .scaleLinear()
      .domain([0, maxPopulation])
      .range([0, dimensions.width]);

    // Adjust yScale based on data length
    const yScale = scaleBand()
      .paddingInner(0.1)
      .domain(data.map((entry) => entry.name))
      .range([0, dimensions.height]);

    svg
      .selectAll('.bar')
      .data(data, (entry) => entry.name)
      .join(
        (enter) =>
          enter
            .append('rect')
            .attr('class', 'bar')
            .attr('x', 0)
            .attr('y', (entry) => yScale(entry.name))
            .attr('height', yScale.bandwidth())
            .attr('fill', (entry) => {
              if (entry[selectedYear] >= 500000000) {
                return '#7ef793';
              } else if (entry[selectedYear] >= 400000000) {
                return '#86eff5';
              } else if (entry[selectedYear] >= 300000000) {
                return '#d09afa';
              } else if (entry[selectedYear] >= 200000000) {
                return '#ffee5b';
              } else if (entry[selectedYear] >= 100000000) {
                return '#fb9948';
              } else {
                return '#e25449'; // Default color
              }
            })
            .call((enter) =>
              enter
                .transition()
                .duration(100)
                .ease(easeQuad)
                .attr('width', (entry) => xScale(entry[selectedYear]))
            ),
        (update) =>
          update.call((update) =>
            update
              .transition()
              .duration(100)
              .ease(easeQuad)
              .attr('x', 0)
              .attr('y', (entry) => yScale(entry.name))
              .attr('width', (entry) => xScale(entry[selectedYear]))
              .attr('fill', (entry) => {
                if (entry[selectedYear] >= 500000000) {
                  return '#7ef793';
                } else if (entry[selectedYear] >= 400000000) {
                  return '#86eff5';
                } else if (entry[selectedYear] >= 300000000) {
                  return '#d09afa';
                } else if (entry[selectedYear] >= 200000000) {
                  return '#ffee5b';
                } else if (entry[selectedYear] >= 100000000) {
                  return '#fb9948';
                } else {
                  return '#e25449'; // Default color
                }
              })
          ),
        (exit) =>
          exit.call((exit) =>
            exit
              .transition()
              .duration(100)
              .ease(d3.easeQuad)
              .attr('width', 20)
              .remove()
          )
      );

    // Draw the labels for y-axis
    svg
      .selectAll('.y-label')
      .data(data, (entry) => entry.name)
      .join('text')
      .attr('class', 'y-label')
      .attr('x', 0)
      .attr('y', (entry) => yScale(entry.name) + yScale.bandwidth() / 2 + 5)
      .text((entry) => entry.name)
      .style('font-size', '12px');

    // Draw the data labels for x-axis
    svg
      .selectAll('.data-label')
      .data(data)
      .join('text')
      .attr('class', 'data-label')
      .attr('x', (entry) => xScale(entry[selectedYear]) + 30)
      .attr('y', (entry) => yScale(entry.name) + yScale.bandwidth() / 2 + 5)
      .text((entry) => entry[selectedYear])
      .attr('fill', 'black')
      .attr('dominant-baseline', 'middle')
      .style('font-size', '12px');

    // Draw the x-axis
    const xAxis = d3.axisBottom(xScale).ticks(5);
    svg.select('.x-axis').call(xAxis);

    // Draw the y-axis
    const yAxis = axisLeft(yScale);
    svg.select('.y-axis').call(yAxis);

    // Display total population for the selected year
    displayTotalPopulation(svg, data, selectedYear, dimensions);
  }, [data, dimensions, selectedYear]);

  useEffect(() => {
    setDimensions({
      width: width,
      height: height,
    });
  }, [width, height]);

  // Function to display total population
  const displayTotalPopulation = (svg, data, selectedYear, dimensions) => {
    svg.selectAll('.total-population').remove(); // Remove previous total population text
    svg
      .append('text')
      .attr('class', 'total-population')
      .attr('x', dimensions.width - 10)
      .attr('y', dimensions.height - 10)
      .attr('text-anchor', 'end')
      .text(
        `  Total : ${d3.sum(data, (d) => d[selectedYear])} : Year (${selectedYear})`
      );
  };

  return (
    <div
      ref={wrapperRef}
      style={{
        marginBottom: '2rem',
        position: 'relative',
        width: width,
        height: height,
        margin: '20px',
      }}
    >
      <svg ref={svgRef}>
        <g className='x-axis' transform={`translate(0, ${dimensions.height})`} />
        <g className='y-axis' />
      </svg>
    </div>
  );
}

export default RacingBarChart;
