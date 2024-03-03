const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

let pairs = [];
let responses = [];
let currentFileName = 'experiment_data.json';

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/storeData', express.json(), (req, res) => {
    // Assuming the experiment data is sent as JSON in the request body
    const experimentData = req.body;

    // Save data to responses array
    responses.push(experimentData);

    res.json({ success: true });
});

app.post('/saveToFile', (req, res) => {
    // Update the current file name (e.g., add a timestamp to make it unique)
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
    currentFileName = `experiment_data_${timestamp}.json`;

    // Assuming you want to save the data to the current file name
    const filePath = path.join(__dirname, currentFileName);

    fs.writeFile(filePath, JSON.stringify(responses), 'utf8', (err) => {
        if (err) {
            console.error('Error saving data to file:', err);
            res.status(500).json({ success: false, error: 'Error saving data to file' });
        } else {
            console.log('Data saved to file:', filePath);
            res.json({ success: true, filePath: currentFileName });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
