const express = require('express');
const cors = require('cors');
const app = express();
const XLSX = require('xlsx');
const path = require('path');

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/population', async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'population-and-demography.csv');
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const populationData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    res.json(populationData);
  } catch (error) {
    console.error('Error fetching population data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = app;
