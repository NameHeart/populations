import React from 'react';
import { XYPlot, XAxis, YAxis, LineSeries } from 'react-vis';
import 'react-vis/dist/style.css';

function LineChart({ data }) {
  return (
    <XYPlot width={800} height={500}>
      <XAxis />
      <YAxis />
      <LineSeries data={data} />
    </XYPlot>
  );
}

export default LineChart;
