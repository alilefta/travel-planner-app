import {weatherFuncAuth, weatherApi, weatherAPIcall} from './../weatherBitAPI';
const fetch = require('node-fetch');


jest.setTimeout(30000);
describe("GET key from Server to authenticate Weather API", () => {
  it('Check if it returns valid key', async () => {
        await fetch('http://localhost:8081/getWeatherKey')
        .then(data => data.json()).then(response => {
            expect(response).toHaveProperty("key")
        })
        .catch(e => expect(e).toMatch('error'));
    });
})


describe("Check if weather API works fine with correct API key", () => {
    it('Check if it returns object, correct weather information. eg: random info', async () => {
        return weatherFuncAuth().then(res => {
            let latitude = 51.5074;
            let longitude = 0.1278;
            let keyAuth = res.key;
            fetch(`https://api.weatherbit.io/v2.0/forecast/daily?&lat=${latitude}&lon=${longitude}&key=${keyAuth}&units=M&days=7`)
            .then(data => data.json()).then(response => {
                expect(response).toHaveProperty("city_name", "Abbey Wood")
            })
            .catch(e => expect(e).toMatch('error'));
        })
    });


})

describe("Check if Auth and fetch function works as expected", () => {
    it('check with randowm parameters', async () => {
        return weatherAPIcall("12", "10.2").then(data => expect(data).toHaveProperty('city_name', 'Shani'));
    });
})