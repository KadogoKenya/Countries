const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
const PORT = 3500;

app.get('/countries', async (req, res) => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
