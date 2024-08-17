const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 5000;

const WINDOW_SIZE = 10;
const storedNumbers = [];

const fetchNumberFromAPI = async (numberId) => {
  try {
    // Replace with the actual third-party API URL
    const response = await axios.get(`http://localhost:3000/numbers/${numberId}`, { timeout: 500 });
    return response.data[Math.floor(Math.random() * response.data.length)];
  } catch (error) {
    return null; // Handle errors or timeouts gracefully
  }
};

app.get('/numbers/:numberId', async (req, res) => {
  const { numberId } = req.params;
  if (!['p', 'f', 'e', 'r'].includes(numberId)) {
    return res.status(400).json({ error: 'Invalid number ID. Must be "p", "f", "e", or "r".' });
  }

  const number = await fetchNumberFromAPI(numberId);
  if (number !== null && !storedNumbers.includes(number)) {
    if (storedNumbers.length >= WINDOW_SIZE) {
      storedNumbers.shift(); // Remove the oldest number
    }
    storedNumbers.push(number); // Add the new number
  }

  const average = storedNumbers.length > 0 ? storedNumbers.reduce((a, b) => a + b, 0) / storedNumbers.length : 0;

  res.json({
    numbersBefore: [...storedNumbers],
    fetchedNumber: number,
    numbersAfter: [...storedNumbers],
    average,
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
