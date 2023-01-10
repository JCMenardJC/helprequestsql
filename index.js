// imports
const express = require('express');
require('dotenv').config() // permet de cacher les donnée dans un autrs fichier .env
const bodyParser = require('body-parser')
const { Client } = require('pg');
const fs = require('fs');

// declarations
const app = express();
const port = 8000;
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'HelpRequest',
    password: 'BriefsSimplon@2023',
    port: 5432,
});

client.connect();

//activation bodyparse pour JSON
app.use(bodyParser.json())


// routes
app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.get('/ticket', async (req, res) => {
    try {
        const data = await client.query('SELECT * FROM ticket');
        res.status(200).json({ status: "SUCCESS", data: data.rows });
    }
    catch (err) {
        res.status(404).json({ status: "Not Found", data: undefined });
        console.log(err.stack)
    }
});

app.get('/ticket/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const data = await client.query('SELECT * FROM ticket where id = $1', [id]);

        res.status(200).json({ status: "SUCCESS", data: data.rows });
    }
    catch (err) {
        console.log(err.stack)
        res.status(404).json({ status: "Not Found", data: undefined });
    }
});

app.post('/ticket', async (req, res) => {
    console.log(req.body);

    try {
        const message = req.body.message;

        const data = await client.query('INSERT INTO ticket (message) VALUES ($1)', [message]);

        res.status(200).json({ status: "SUCCESS", data: data.rows });
    }
    catch (err) {
        console.log(err.stack);
        res.status(404).json({ status: "Not Found", data: undefined })
    }
});

app.delete('/ticket/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const data = await client.query('DELETE FROM ticket WHERE id = $1', [id]);

        res.status(200).json({ status: "SUCCESS", data: data.rows });
    }
    catch (err) {
        console.log(err.stack);
        res.status(404).json({ status: "Not Found", data: undefined })
    }
});
// ecoute le port 8000
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
