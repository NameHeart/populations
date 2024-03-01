import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Slider, Button } from 'antd';
import './App.css';
import 'antd/dist/reset.css';
import CustomBarChart from './CustomBarChart';
import RacingBarChart from './RacingBarChart';

function App() {
  const [populationData, setPopulationData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(1950);
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
          setAutoplay(false);
        }
      }, 200);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [autoplay, selectedYear]);

  const handleYearChange = (year) => {
    setSelectedYear(year);
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

  const uniqueCountries = [
    ...new Set(filteredPopulationData.map((data) => data['Country'])),
  ];
  const uniqueYears = [
    ...new Set(filteredPopulationData.map((data) => data['Year'])),
  ];

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

  const sortedChartData = filteredChartData.sort(
    (a, b) => b[selectedYear] - a[selectedYear]
  );

  const top10Countries = sortedChartData.slice(0, 12);

  const handlePlayButtonClick = () => {
    setAutoplay(!autoplay);
  };

  return (
    <div className='App'>
      <h1>Population growth per country 1950 to 2021</h1>
      <div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <RacingBarChart
            data={top10Countries}
            selectedYear={selectedYear}
            top10Countries={top10Countries}
            width={1200}
            height={500}
          />
        </div>
        <div className='slider-container'>
          <Button onClick={handlePlayButtonClick}>
            {autoplay ? 'Pause' : 'Play'}
          </Button>
          <Slider
            style={{ width: '100%' }}
            min={Math.min(...uniqueYears)}
            max={Math.max(...uniqueYears)}
            step={1}
            value={selectedYear}
            onChange={handleYearChange}
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
