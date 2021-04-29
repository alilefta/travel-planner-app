const fetch = require('node-fetch');


const geoNamesApi = async (city) => {
    const response = await fetch(`http://api.geonames.org/searchJSON?formatted=true&q=${city}&maxRows=5&lang=es&username=alilefta`).then(res=>{
        if(res.ok == true){
            return res.json();
        }
    }).then(data => {
        if(data.geonames.length > 0){
            const result = data.geonames[0];
            return {longitude: result.lng,
                    latitude: result.lat,
                    countryName: result.countryName,
                    countryCode: result.countryCode
                }
        }else{
            return null;
        }

    }).catch(err => {
        throw new Error("Error: "+ err);
    })

    return response;
}


// const countryInfo = async (countryName) => {
//     const response = await fetch(`https://restcountries.eu/rest/v2/name/${countryName}`).then(res=>{
//         if(res.ok == true){
//             return res.json();
//         }
//     }).then(data => {
//         return data;

//     }).catch(err => {
//         throw new Error("Error: "+ err);
//     })

//     return response;
// }

const weatherFuncAuth = async () => {
    const response = await fetch("http://localhost:8081/getWeatherKey").then(res=> {
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
    const response = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?&lat=${latitude}&lon=${longitude}&key=${key}&units=M&days=7`).then(data => {
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
    }).then(data => {
        if(data.hits.length !== 0){
            return data;
        }else{
            return {
                hits: [
                    {largeImageURL: "https://cdn.pixabay.com/photo/2017/06/08/17/32/not-found-2384304_1280.jpg"}
                ]
            }
        }
    })
    .catch(err => {
        throw new Error(err);
    })
    return response;
}

const fetchAllAPs = async (dest, date)=> {
    const trip = {
        id: new Date().getTime().toString(),
        destination: dest,
        date: date
    };
    let isNull = false;
    await geoNamesApi(dest).then(async locationInfo => {
        if(locationInfo === null){
            isNull = true;
        }else{
            trip["location"] = await locationInfo
            await weatherAPIcall(locationInfo.longitude, locationInfo.latitude).then(async (weatherInfo) => {
                trip["weather"] = await weatherInfo;
                await pixabayAPICall(dest).then(async imageInfo => {
                    trip["images"] = await imageInfo;
                })
            })
        }

        
    }).catch(err => {
        throw new Error(err)
    })
    if(isNull == true){
        return null;
    }
    return trip;
}


export {
    weatherFuncAuth, weatherApi, weatherAPIcall, pixabayAPICall, geoNamesApi, fetchAllAPs
}