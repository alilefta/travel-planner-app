const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './../../dist')))

app.get('/', (req, res)=> {
    res.sendFile('./index.html')
});

const port = 8081;

app.listen(port, ()=> {
    console.log("Server is listening on port", port, "....")
});