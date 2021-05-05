const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');
const { send } = require('process');
const app = express();

const projectData = {
};


dotenv.config();

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './../../dist')))


app.get('/', (req, res)=> {
    res.sendFile('./index.html')
});


app.post('/trips', (req, res)=> {
    projectData["trips"] = req.body;
    res.json(projectData);
});

app.get('/getWeatherKey', (req, res)=> {
    res.json({"key": process.env.WEATHER_API_KEY});
});

app.get('/getPixabayKey', (req, res)=> {
    res.json({"key": process.env.PIXABAY_API_KEY});
});

app.post('/helloWorld', (req, res) => {
    res.send("Hello World");
})



module.exports  = app;