// imports
const express = require('express');
require('dotenv').config() // permet de cacher les donnée dans un autrs fichier .env
const bodyParser = require('body-parser')
const { Client } = require('pg');
const fs = require('fs');
require('dotenv').config();

// declarations
const app = express();
const port = 8000;
const client = new Client({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
});

client.connect();

//activation bodyparse pour JSON
app.use(bodyParser.json())


// routes
app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.get('/api/ticket', async (req, res) => {
    try {
        const data = await client.query('SELECT * FROM ticket');
        res.status(200).json({ status: "SUCCESS", data: data.rows });
    }
    catch (err) {
        res.status(404).json({ status: "Not Found", data: null });
        console.log(err.stack)
    }
});

app.get('/api/ticket/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const data = await client.query('SELECT * FROM ticket where id = $1', [id]);
        console.log(data.rowCount)

        if (data.rowCount > 0) {res.status(200).json({ status: "SUCCESS", data: data.rows });}
        
        else { res.status(404).json({status: "FAIL", data: null }) }
        
    }
    catch (err) {
        console.log(err.stack)
        res.status(404).json({ status: "Not Found", data: null });
    }
});

app.post('/api/ticket', async (req, res) => {
    console.log(req.body);

    try {
        const message = req.body.message;

        const data = await client.query('INSERT INTO ticket (message) VALUES ($1)', [message]);

        res.status(200).json({ status: "SUCCESS", data: data.rows });
    }
    catch (err) {
        console.log(err.stack);
        res.status(404).json({ status: "Not Found", data: null })
    }
});

app.delete('/api/ticket/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const data = await client.query('DELETE FROM ticket WHERE id = $1', [id]);

        res.status(200).json({ status: "SUCCESS", data: data.rows });
    }
    catch (err) {
        console.log(err.stack);
        res.status(404).json({ status: "Not Found", data: null })
    }
});
// ecoute le port 8000
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
