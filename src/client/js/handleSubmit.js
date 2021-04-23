import {fetchAllAPs} from './fetchAPIs'
import{storeData} from './dataHandle';
const handleSubmit = () => {
    const tripsForm = document.querySelector("#trips-form");
    let allTrips = [];

    if(tripsForm){
        tripsForm.addEventListener("submit", (e)=> {
            e.preventDefault();

            const destination = document.querySelector("#trips-form-destination");
            const date = document.querySelector("#trips-form-date");

            if(destination.value !== "" && date.value !== ""){
                fetchAllAPs(destination.value, date.value).then(data => {
                    allTrips.push(data);
                })
                destination.value = '';
                date.value = '';

                storeData(allTrips)
                
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