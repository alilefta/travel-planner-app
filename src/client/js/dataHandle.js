let storage = [];

const modal = (msg) => {
    const modal = document.querySelector("#modal");
    const messageEl = document.querySelector(".modal--message");
   
    messageEl.innerText = msg;

    modal.classList.add("modal--show")

    setTimeout(()=> {
        if(!modal.classList.contains("modal--show")){
            modal.classList.add("modal--show");

        }else{
            modal.classList.remove("modal--show");
        }
    }, 2000);
} 


window.addEventListener('DOMContentLoaded', ()=> {
    setTimeout(()=> {
        console.log(storage)
    }, 3000)
})


const searchedTripsData = (data) => {
    storage = [...data];
    // console.log(storage)
    updateUI(storage);
    return storage;
}
const getTripsList = () => {
    let tripsList;
    if(localStorage.getItem('trips-app-planner') === null ){
        tripsList = [];
    }else{
        tripsList = JSON.parse(localStorage.getItem('trips-app-planner'));
    }
    return tripsList;
}


const removeTrip = (id) => {
    // console.log(storage)

    let trips = getTripsList();

    trips = trips.filter(trip => {
        if(trip.id !== id){
            return trip;
        }
    });
    
    localStorage.setItem('trips-app-planner', JSON.stringify(trips));
    storage = storage.filter(e => {
        if(e.id !== id){
            return e;
        }
    });
    modal("Trip is removed");
    searchedTripsData(storage);
    
    return storage;
}

const saveTrip = (trip) => {
    let str = getTripsList();

    if(localStorage.getItem('trips-app-planner') === null){

        str.push(trip);

    }else{
        let check = JSON.parse(localStorage.getItem('trips-app-planner'));

        if(check.every(e => e.id !== trip.id)){
            
            str.push(trip);
            modal("Trip is saved");
        }else{
            modal("Trip is already saved");
        }
    }
    localStorage.setItem("trips-app-planner", JSON.stringify(str));


    // Check if it saves
    // checkIfTripSaved(trip);

}


const countDown = (date) => {
    let countDownDate = new Date(date).getTime();
    let now = new Date().getTime();
    let distance = countDownDate - now;
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    if (distance < 0) {
        return 0;
    }else{
        return days;
    }
}

const checkweather = (weather, date) => {
    if(countDown(date) <= 7){
        let x = `<div class="trip-weather">
                    <p>Trip weather is out of reach</p>
                </div>`;
        weather.data.map(e => {
            if(date == e.datetime){
                return x = `<div class="trip-weather">
                    <p>Typical weather is: </p>
                    <p>High: ${e.app_max_temp}°C, Low : ${e.app_min_temp}°C</p>
                    <p>${e.weather.description}</p>
                </div>`;
            }
        })
        return x
    }else{
        return `<div class="trip-weather"><p>Trip weather is out of reach</p></div>`;
    }
}

const handleTripControl = (trip) => {
    let saveBTN = document.querySelectorAll("#save-trip");
    let removeBTN = document.querySelectorAll("#delete-trip");
    // let notesBTN = document.querySelectorAll('#add-notes');

    if(saveBTN){
        saveBTN.forEach((btn) => {
            btn.addEventListener('click', (e)=> {
                // console.log(!storage.some(e=> e.id == idTrip))
                // if(!storage.some(e=> e.id == idTrip)){
                //     return storage.push(trip);
                // }
                let dataID = e.target.parentNode.parentNode.parentNode.dataset.id;
                if(dataID === trip.id){
                    storage.push(trip)
                    saveTrip(trip);
                }

                return storage;
            })
        });
    }
    // notesBTN.forEach(btn => {
    //     // Need notes input (text area) to appended to the current trip

    // })
    if(removeBTN){
        removeBTN.forEach(btn => {
            btn.addEventListener('click', (e)=> {
                let dataID = e.target.parentNode.parentNode.parentNode.dataset.id;
                if(dataID === trip.id){
                    removeTrip(trip.id);
                }
            })
        })
    }
}


const updateUI = async (trips) => {
    const tripContainer = document.querySelector('.trips-gallery');
    
    console.log(trips)

    if(document.querySelector('.my-trip')){
        document.querySelectorAll('.my-trip').forEach(e => e.remove());
    }

    if(trips.length !== 0){
        trips.map(trip => {
            let countdownDate = countDown(trip.date);
            const div = document.createElement('div');
            const removeNoTripsAvaliable = document.querySelector(".no-trip-info");
            if(removeNoTripsAvaliable){
                removeNoTripsAvaliable.remove();
            }
            div.classList.add("my-trip");
            div.dataset.id = trip.id;
            div.innerHTML = `
                <div class="left-side">
                    <p class="trip-gallery-heading">Going to: ${trip.destination}</p>
                    <p class="trip-gallery-date">Departure date: ${trip.date}</p>
                    <p>${trip.destination}, ${trip.location.countryName} trip is about ${countdownDate} days away</p>
                    <div class="left-trip-control">
                        <button id="save-trip">Save Trip</button>
                        <button id="delete-trip">Remove Trip</button>
                    </div>
                    ${checkweather(trip.weather, trip.date)}
                </div>
                <div class="right-side">
                    <img id="my-trip-img" src="${trip.images.hits[0].largeImageURL}" alt="${trip.destination}">
                    <div class="right-trip-control">
                        <button id="add-lodging-info">Add lodging info</button>
                        <button id="add-packing-info">Add packing info</button>
                        <button id="add-notes">Add notes</button>
                    </div>
                </div>`;
            tripContainer.appendChild(div);

            handleTripControl(trip, trip.id);
        })

    }
    
    else{
        const noTripElement = document.createElement('div');
        noTripElement.classList.add('no-trip-info')

        noTripElement.innerText = "Sorry, No trips found";
        tripContainer.appendChild(noTripElement);
    }

}


document.addEventListener("DOMContentLoaded", ()=> {
    let storageSavedItems = getTripsList();
    
    storage = [...storageSavedItems];
    if(storage.length === 0){
        storage = [];
    }
    updateUI(storage);
})

export {
    storage, updateUI, countDown, getTripsList, searchedTripsData
}