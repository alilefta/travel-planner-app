import {fetchAllAPs} from './fetchAPIs'
import{searchedTripsData, storage, modal} from './dataHandle';

// Handle search form and collect data to send them to Data handle file
const handleSubmit = () => {
    const tripsForm = document.querySelector("#trips-form");

    if(tripsForm){
        tripsForm.addEventListener("submit", (e)=> {
            e.preventDefault();

            const destination = document.querySelector("#trips-form-destination");
            const date = document.querySelector("#trips-form-date");
            const endDate = document.querySelector("#trips-form-date-end");

            if(destination.value !== "" && date.value !== ""){
                fetchAllAPs(destination.value, date.value, endDate.value).then(async data => {
                    
                    if(data !== null){
                        storage.push(data);
                        return storage;
                    }else{
                        return null;
                    }
                }).then(d => {
                    searchedTripsData(d);
                    
                }).catch(() => {
                    modal("Invalid query", 'danger');
                });

                destination.value = '';
                date.value = '';
                endDate.value = '';
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