const fetch = require('node-fetch');
const geoNamesApi = async (city) => {
    const response = await fetch(`http://api.geonames.org/searchJSON?formatted=true&q=${city}&maxRows=5&lang=es&username=alilefta`).then(res=>{
        if(res.ok == true){
            return res.json();
        }else{
            throw new Error("There is an Error:"+ res.json());
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


export{
    geoNamesApi
}