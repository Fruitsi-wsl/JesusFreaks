const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'pages'))); // Serve the 'pages' directory

const scheduleFilePath = path.join(__dirname, 'Json', 'scheduleData.json');

app.get('/get-schedule', (req, res) => {
    fs.readFile(scheduleFilePath, 'utf-8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading schedule data');
        } else {
            res.json(JSON.parse(data));
        }
    });
});

app.post('/save-schedule', (req, res) => {
    const scheduleData = req.body;
    fs.writeFile(scheduleFilePath, JSON.stringify(scheduleData, null, 2), (err) => {
        if (err) {
            res.status(500).json({ message: 'Error saving data', error: err });
        } else {
            res.status(200).json({ message: 'Data saved successfully' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
