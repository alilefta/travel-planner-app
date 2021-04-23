import {storeData} from './dataHandle'
const fetch = require('node-fetch');
const geoNamesApi = async (city) => {
    const response = await fetch(`http://api.geonames.org/searchJSON?formatted=true&q=${city}&maxRows=5&lang=es&username=alilefta`).then(res=>{
        if(res.ok == true){
            return res.json();
        }
    }).then(data => {
        const result = data.geonames[0];
        return {longitude: result.lng,
                latitude: result.lat,
                countryName: result.countryName,
                countryCode: result.countryCode
            }

    }).catch(err => {
        throw new Error("Error: "+ err);
    })

    return response;
}

const weatherFuncAuth = async () => {
    const response = fetch("http://localhost:8081/getWeatherKey").then(res=> {
        if(res.ok == true){
            return res.json();
        }else{
            throw new Error("There is an error with server");
        }
    }).then(data => data)
    .catch(err => {
        throw new Error(err);
    })
    return response;
}



const weatherApi = async (longitude, latitude, key) => {
    const response = fetch(`https://api.weatherbit.io/v2.0/forecast/daily?&lat=${latitude}&lon=${longitude}&key=${key}&units=M&days=7`).then(data => {
        if(data.ok == true){
            return data.json();
        }else{
            throw new Error("There is an internal server error or auth error");
        }
    })
    .then(data => data)
    .catch(err => {
        throw new Error(err);
    })

    return response;
    
}

// Auth and call Weather
const weatherAPIcall = (lng, lat) => {
    return weatherFuncAuth().then(key => weatherApi(lng, lat, key.key));
}

// Get IMAGES for the trip
const pixabayAPICall = async (query) => {
    let keyAuth = await fetch("http://localhost:8081/getPixabayKey").then(data => {
        if(data.ok === true){
            return data.json();
        }else{
            throw new Error("There is internal server Error");
        }
    }).then(data => data.key)
    .catch(err => {
        throw new Error(err);
    })
    
    const response = await fetch(`https://pixabay.com/api/?key=${keyAuth}&q=${query}&image_type=photo&pretty=true`).then(data => {
        if(data.ok === true){
            return data.json();
        }else{
            throw new Error("There is internal server Error");
        }
    }).then(data => data)
    .catch(err => {
        throw new Error(err);
    })
    return response;
}

const fetchAllAPs = async (dest, date)=> {
    const trip = {
        destination: dest,
        date: date
    };

    geoNamesApi(dest).then(locationInfo => {
        trip["location"] = locationInfo
        weatherAPIcall(locationInfo.longitude, locationInfo.latitude).then(weatherInfo => {
            trip["weather"] = weatherInfo;
            pixabayAPICall(dest).then(imageInfo => {
                trip["images"] = imageInfo;
            })
        })

        
    })
    return trip;

}

export {
    weatherFuncAuth, weatherApi, weatherAPIcall, pixabayAPICall, geoNamesApi, fetchAllAPs
}