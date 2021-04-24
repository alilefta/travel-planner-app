import {fetchAllAPs} from './fetchAPIs'
import{updateUI} from './dataHandle';

let allTrips = [];

const storeData = () => {
    // return updateUI(data)
}
const handleSubmit = () => {
    const tripsForm = document.querySelector("#trips-form");

    if(tripsForm){
        tripsForm.addEventListener("submit", (e)=> {
            e.preventDefault();

            const destination = document.querySelector("#trips-form-destination");
            const date = document.querySelector("#trips-form-date");

            if(destination.value !== "" && date.value !== ""){
                fetchAllAPs(destination.value, date.value).then(async data => {
                    if(data !== null){
                        allTrips.push(data);
                        return allTrips
                    }else{
                        return null;
                    }
                }).then(d => updateUI(d)).catch(err => {
                    alert("Invalid query", err)
                })

                destination.value = '';
                date.value = '';

                storeData(allTrips)
                // updateUI(allTrips);
                
            }
        })
    }
    
}




document.addEventListener('DOMContentLoaded', ()=> {
    handleSubmit();
});

export{
    handleSubmit
}