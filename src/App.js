import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import { Slider, Button } from 'antd';
import './App.css';
import 'antd/dist/reset.css';

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

function App() {
  const [populationData, setPopulationData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(1950); // State เก็บปีที่เลือก
  const [autoplay, setAutoplay] = useState(false);

  useEffect(() => {
    async function fetchPopulationData() {
      try {
        const response = await axios.get(
          'https://populationsdatabase.vercel.app/population'
        );
        setPopulationData(response.data);
      } catch (error) {
        console.error('Error fetching population data:', error);
      }
    }
    fetchPopulationData();
  }, []);

  useEffect(() => {
    let interval;
    if (autoplay) {
      interval = setInterval(() => {
        if (selectedYear < Math.max(...uniqueYears)) {
          handleYearChange(selectedYear + 1);
        } else {
          setAutoplay(false); // หยุด autoplay เมื่อถึงปีสุดท้ายแล้ว
        }
      }, 500); // เปลี่ยนปีทุกๆ 0.5 วินาที
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [autoplay, selectedYear]);

  const handleYearChange = (year) => {
    setSelectedYear(year); // อัปเดต state เมื่อปีถูกเลือก
  };

  // Filter out unwanted country names
  const filteredPopulationData = populationData.filter((data) => {
    const countryName = data['Country'];
    return !(
      countryName.includes('High-income countries') ||
      countryName.includes('World') ||
      countryName.includes('Less developed regions') ||
      countryName.includes('Asia (UN)') ||
      countryName.includes('Less developed regions, excluding China') ||
      countryName.includes('Upper-middle-income countries') ||
      countryName.includes('More developed regions') ||
      countryName.includes('Lower-middle-income countries') ||
      countryName.includes('Europe (UN)') ||
      countryName.includes('Africa (UN)') ||
      countryName.includes('Least developed countries') ||
      countryName.includes('Latin America and the Caribbean (UN)') ||
      countryName.includes('Northern America (UN)') ||
      countryName.includes('Low-income countries') ||
      countryName.includes('Land-locked developing countries (LLDC)')
    );
  });

  // Filter duplicate countries and years from filtered data
  const uniqueCountries = [
    ...new Set(filteredPopulationData.map((data) => data['Country'])),
  ];
  const uniqueYears = [
    ...new Set(filteredPopulationData.map((data) => data['Year'])),
  ];

  // Create filtered chart data
  const filteredChartData = [];
  uniqueCountries.forEach((country) => {
    const countryData = { name: country };
    uniqueYears.forEach((year) => {
      const data = filteredPopulationData.find(
        (item) => item['Country'] === country && item['Year'] === year
      );
      if (data) {
        countryData[year] = data['Population'];
      } else {
        countryData[year] = 0;
      }
    });
    filteredChartData.push(countryData);
  });

  // Sort countries by population in selected year
  const sortedChartData = filteredChartData.sort(
    (a, b) => b[selectedYear] - a[selectedYear]
  );

  // Select only the top 10 countries
  const top10Countries = sortedChartData.slice(0, 12);

  const handlePlayButtonClick = () => {
    setAutoplay(!autoplay);
  };

  return (
    <div className='App'>
      <h1>Population growth per country 1950 to 2021</h1>
      <div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <BarChart
            width={1300}
            height={500}
            layout='vertical'
            data={top10Countries}
            margin={{ top: 5, right: 60, left: 30, bottom: 5 }}
          >
            <XAxis type='number' />
            <YAxis dataKey='name' type='category' />
            <CartesianGrid strokeDasharray='3 3' />
            <Tooltip
              labelFormatter={(label) => `Contry: ${label}`}
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
                  type: 'square',
                  color: '#82ca9d',
                },
              ]}
              formatter={() => {
                return `Year ${selectedYear} - Total Population: ${numberWithCommas(
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
              fill={['#82ca9d']}
              label={{
                position: 'right',
                formatter: numberWithCommas,
              }}
            />
          </BarChart>
        </div>
        <div className='slider-container'>
          <Button onClick={handlePlayButtonClick}>
            {autoplay ? 'Pause' : 'Play'}
          </Button>
          <Slider
            style={{ width: '100%' }} // ปรับความกว้างให้เต็มพื้นที่ที่มีอยู่
            min={Math.min(...uniqueYears)}
            max={Math.max(...uniqueYears)}
            step={1}
            value={selectedYear}
            onChange={handleYearChange}
            tooltipVisible
            className='slider_markers'
            marks={uniqueYears.reduce((acc, year) => {
              acc[year] = year;
              return acc;
            }, {})}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
