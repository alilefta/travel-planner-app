import {fetchAllAPs} from './fetchAPIs'
import{searchedTripsData, storage} from './dataHandle';

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
                        storage.push(data);
                        return storage;
                    }else{
                        return null;
                    }
                }).then(d => {
                    searchedTripsData(d);
                    
                }).catch(err => {
                    alert("Invalid query", err);
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