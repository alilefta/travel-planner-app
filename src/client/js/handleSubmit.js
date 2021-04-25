import {fetchAllAPs} from './fetchAPIs'
import{searchedTripsData} from './dataHandle';

let searchedTrips = [];

// I reached to sending data from handlesubmit to dataHandle, and moved updateUI

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
                        searchedTrips.push(data);
                        return searchedTrips;
                    }else{
                        return null;
                    }
                }).then(d => {
                    // updateUI(d)
                    searchedTripsData(d);
                    
                }).catch(err => {
                    alert("Invalid query", err)
                })

                destination.value = '';
                date.value = '';
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