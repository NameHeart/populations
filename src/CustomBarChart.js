import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const CustomBarChart = ({ data, selectedYear, top10Countries }) => {
  return (
    <BarChart
      width={1200}
      height={500}
      layout='vertical'
      data={data}
      margin={{ top: 5, right: 100, left: 30, bottom: 5 }}
    >
      <XAxis type='number' tickFormatter={numberWithCommas} />
      <YAxis dataKey='name' type='category' />
      <CartesianGrid strokeDasharray='3 3' />
      <Tooltip
        labelFormatter={(label) => `Country: ${label}`}
        formatter={(value) => [
          `Year: ${selectedYear}`,
          `Population: ${numberWithCommas(value)}`,
        ]}
      />
      <Legend
        payload={[
          {
            value: `Year ${selectedYear} - Total Population: ${numberWithCommas(
              top10Countries.reduce(
                (total, country) => total + country[selectedYear],
                0
              )
            )}`,
            type: 'circle',
          },
        ]}
        formatter={() => {
          return `Year ${selectedYear} / Total Population: ${numberWithCommas(
            top10Countries.reduce(
              (total, country) => total + country[selectedYear],
              0
            )
          )}`;
        }}
      />
      <Bar
        dataKey={selectedYear}
        stackId='a'
        fill={['#6047EC']}
        label={{
          position: 'right',
          formatter: numberWithCommas,
        }}
      />
    </BarChart>
  );
};

export default CustomBarChart;
