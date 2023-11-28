const exrpess = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { fileURLToPath } = require('url');
const app = exrpess();
const port = 3000;

app.use(bodyParser.json());

const filePath = 'data.txt';

// let dataStore = [
//     {id: 1, data: 'Example of Data 1'},
//     {id: 2, data: 'Example of Data 2'}
// ];

//Routes and CRUD operations
app.listen(port, () => {
    console.log('Server is running on http://localhost:${port}');
});

//Read All Data
app.get('/api/data', async (req, res) => {
    try {
        const fileContent = await fs.promises.readFile(filePath, { encoding: 'utf8' });

        console.log(fileContent);
        const data = fileContent.split('\n').filter(Boolean).map(JSON.parse);
        if (!data) {
            return res.status(404).json({ error: 'Anni daya ID ty sahi de. ' });
        }
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error reading data from the file. ' });
    }
});

//Read Data by Id
app.get('/api/:id', async (req, res) => {
    const reqId = parseInt(req.params.id);
    try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        const data = fileContent.split('\n').filter(Boolean).map(JSON.parse);
        const reqData = data.find(x => x.id === reqId);
        if (!reqData) {
            return res.status(404).json({ error: 'Anni daya ID ty sahi de. ' });
        }
        res.json(reqData);
    } catch (error) {
        res.status(500).json({ error: 'Error reading data from the file. ' });
    }

});

//Create Data
app.post('/api/create-data', async (req, res) => {
    const { id, data } = req.body;
    if (!id || !data) {
        return res.status(400).json({ error: 'Both id and data is required. ' });
    }
    console.log({ id, data });
    try {
        const fileContent = await fs.promises.readFile(filePath, { encoding: 'utf8' });
        const existData = fileContent.split('\n').filter(Boolean).map(JSON.parse);

        existData.push({ id, data });
        await fs.promises.writeFile(filePath, existData.map(JSON.stringify).join('\n'), { encoding: 'utf8' });

        res.json({ success: true, message: 'Data created successfully!' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error writing data to the file.' });
    }
});

