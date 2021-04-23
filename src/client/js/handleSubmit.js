import {countDown} from './countDownDate';
import{geoNamesApi} from './geoNamesAPI';

const handleSubmit = () => {
    const tripsForm = document.querySelector("#trips-form");
    const info = [];
    if(tripsForm){
        tripsForm.addEventListener("submit", (e)=> {
            e.preventDefault();

            const destination = document.querySelector("#trips-form-destination");
            const date = document.querySelector("#trips-form-date");

            if(destination.value !== "" && date.value !== ""){
                info.push({destination: destination.value, date: date.value});
                destination.value = '';
                date.value = '';
            }
            // return info;
        })
        return info
    }
    
}



document.addEventListener('DOMContentLoaded', ()=> {
    console.log(handleSubmit());
});

export{
    handleSubmit
}