import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const AnimatedBarChart = ({ data, width, height, selectedYear }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // สร้าง scale ของแกน x และ y โดยใช้ข้อมูล data
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d[selectedYear])]) // ขอบเขตของข้อมูล
      .range([0, width]); // ขอบเขตของแกน x

    const yScale = d3
      .scaleBand()
      .domain(data.map((d) => d.name)) // ใช้ชื่อประเทศจากข้อมูล top10Countries
      .range([0, height]) // ขอบเขตของแกน y
      .padding(0.1);

    // สร้างแกน x และ y
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('.2s'));
    const yAxis = d3.axisLeft(yScale);

    // วาดแกน x
    svg.select('.x-axis').attr('transform', `translate(0, ${height})`).call(xAxis);

    // วาดแกน y
    svg.select('.y-axis').call(yAxis);

    // เพิ่มข้อความในแกน y
    svg
      .selectAll('.y-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'y-label')
      .attr('x', -10) // กำหนดตำแหน่งข้อความบนแกน y
      .attr('y', (d) => yScale(d.name) + yScale.bandwidth() / 2) // กำหนดตำแหน่งข้อความบนแกน y
      .attr('dy', '0.35em')
      .style('text-anchor', 'end')
      .text((d) => d.name);

    // สร้างกราฟแท่ง
    svg
      .selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('y', (d) => yScale(d.name))
      .attr('width', (d) => xScale(d[selectedYear]))
      .attr('height', yScale.bandwidth())
      .attr('fill', '#6047EC')
      .transition()
      .duration(1000)
      .attr('width', (d) => xScale(d[selectedYear]));
  }, [data]);

  console.log(selectedYear);
  return (
    <svg ref={svgRef} width={width} height={height}>
      <g className='x-axis' />
      <g className='y-axis' />
    </svg>
  );
};

export default AnimatedBarChart;
