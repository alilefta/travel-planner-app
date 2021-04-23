const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

dotenv.config();

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './../../dist')))


app.get('/', (req, res)=> {
    res.sendFile('./index.html')
});

app.get('/getWeatherKey', (req, res)=> {
    res.json({"key": process.env.WEATHER_API_KEY});
});

app.get('/getPixabayKey', (req, res)=> {
    res.json({"key": process.env.PIXABAY_API_KEY});
});

const port = 8081;

app.listen(port, ()=> {
    console.log("Server is listening on port", port, "....")
});