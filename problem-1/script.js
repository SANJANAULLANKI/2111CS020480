const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 5000;
const WINDOW_SIZE = 10; 
let windowCurrState = []; 
let windowPrevState = []; 

const fetchNumber = async (numberId) => {
    try {
        const response = await axios.get(`https://localhost:3000/numbers/${numberId}`, { timeout: 500 });
        return response.data; 
    } catch (error) {
        console.log("Error fetching number:", error.message);
        return null; 
    }
};
const updateWindowState = (newNumber) => {
    if (newNumber !== null && !windowCurrState.includes(newNumber)) {
        if (windowCurrState.length >= WINDOW_SIZE) {
            windowPrevState = [...windowCurrState]; 
            windowCurrState.shift(); 
        }
        windowCurrState.push(newNumber);
    }
};


const calculateAverage = () => {
    if (windowCurrState.length === 0) return 0;
    const sum = windowCurrState.reduce((a, b) => a + b, 0);
    return (sum / windowCurrState.length).toFixed(2);
};


app.get('/numbers/:numberId', async (req, res) => {
    const { numberId } = req.params;

    const validIds = ['p', 'f', 'e', 'r']; 
    if (!validIds.includes(numberId)) {
        return res.status(400).json({ error: 'Invalid number ID. Use p, f, e, or r.' });
    }

    const fetchedNumber = await fetchNumber(numberId);
    updateWindowState(fetchedNumber);

    const response = {
        windowPrevState,
        windowCurrState,
        numbers: windowCurrState,
        avg: calculateAverage(),
    };

    res.json(response);
});

app.listen(PORT, () => {
    console.log(`Average Calculator Microservice is running on port ${PORT}`);
});
