import {geoNamesApi} from './../fetchAPIs';
const fetch = require('node-fetch');

describe("Geo names API to get Longitude, Latitude, Country", () => {
  it('check when successful call to API. Paris as an example', async () => {
      try{
          await fetch('http://api.geonames.org/searchJSON?formatted=true&q=paris&maxRows=5&lang=es&username=alilefta')
          .then(data => data.json()).then(response => {
              expect(response.geonames[0]).toHaveProperty('countryCode', 'FR');
          })
          .catch(e => expect(e).toMatch('error'));
      }
      catch(err){
          throw new Error(err)
      }
    });
    it('Check normal function invoking', async() => {
        return geoNamesApi('baghdad').then(data => expect(data).toHaveProperty("countryCode", "IQ"))
    })
})