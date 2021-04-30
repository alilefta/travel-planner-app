import e from "express";

let storage = [];

const modal = (msg, type = 'success') => {
    const modal = document.querySelector("#modalNotify");
    const messageEl = document.querySelector(".modalNotify--message");
   
    messageEl.innerText = msg;
    modal.classList.add("modalNotify--show")
    
    if(type === 'danger'){
        modal.style.backgroundColor = "#d93d3d";
    }else if(type === 'warning'){
       modal.style.backgroundColor = "#d5c42b"
    }
    else{
        modal.style.backgroundColor = "#30ae65";
    }

    setTimeout(()=> {
        if(modal.classList.contains("modalNotify--show")){
            modal.classList.remove("modalNotify--show");

        }
    }, 3000);
} 

const searchedTripsData = (data) => {
    storage = [...data];
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
    modal("Trip is removed", 'success');
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
            modal("Trip is saved", 'success');
        }else{
            modal("Trip is already saved", 'warning');
        }
    }
    localStorage.setItem("trips-app-planner", JSON.stringify(str));

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
                    <p>Typical weather will be: </p>
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

const checkNotes = (trip) => {
    let x = '';
    if(trip.notes.length === 0){
        x = `<p class="noNotesFound">No trip notes ... </p>`
    }else{
        x = `<p class="waitingForNotes">Wait for notes ... </p>`
    }

    return x;
}

const addNotes = (note, id) => {
    const trips = getTripsList();    
    trips.map(e => {
        if(e.id === id){
            if(note !== ''){
                modal("Note added", "success");
                return e.notes.push(note);
            }
        }
    });
    localStorage.setItem("trips-app-planner", JSON.stringify(trips));

    storage.map(trip => {
        if(trip.id === id){
            if(note !== ''){
                modal("Note added", "success");
                return trip.notes.push(note);
            }
        }
    })
    console.log(storage)
}

const modalForNotes =(dataId) => {
    const trip = document.querySelector(`[data-id='${dataId}']`);
    const notesContainer = trip.querySelector('.trip-notes');
    const div = document.createElement('div');
    div.innerHTML = `<div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
                aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content ">
                <div class="modal-header ">
                    <h5 class="modal-title" id="exampleModalLongTitle">Write a note</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="notes-form">
                        <div class="form-group " >
                            <textarea class="form-control notes-text-input" id="exampleFormControlTextarea1" rows="3"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary userNotesBtn"  data-dismiss="modal">Add Note</button>
                </div>
            </div>
        </div>
    </div>`
    notesContainer.appendChild(div);

    const btn = trip.querySelector(".userNotesBtn");

    btn.addEventListener('click', () => {
        const txt = trip.querySelector('.notes-text-input');

        addNotes(txt.value, dataId);

        loadNotes();
        
        txt.value = '';
        return txt.value
    })
}

const handleTripControl = (trip) => {
    let saveBTN = document.querySelectorAll("#save-trip");
    let removeBTN = document.querySelectorAll("#delete-trip");
    let notesBTN = document.querySelectorAll('#add-notes');


    if(saveBTN){
        saveBTN.forEach((btn) => {
            btn.addEventListener('click', (e)=> {
                let dataID = e.target.parentNode.parentNode.parentNode.dataset.id;
                if(dataID === trip.id){
                    storage.push(trip)
                    saveTrip(trip);
                }

                return storage;
            })
        });
    }

    if(notesBTN){
        notesBTN.forEach(btn => {
            btn.addEventListener('click', (e) => {
                let tripId = e.target.parentNode.parentNode.parentNode.dataset.id;
                if(tripId === trip.id){
                    modalForNotes(tripId);
                }
            })
        })
    }

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


    if(document.querySelector('.my-trip')){
        document.querySelectorAll('.my-trip').forEach(e => e.remove());
    }
    if(document.querySelector('.trips-gallery h3')){
        document.querySelector('.trips-gallery h3').remove();
    }
    if(document.querySelector('.trips-gallery hr')){
        document.querySelector('.trips-gallery hr').remove();
    }


    const h3 = document.createElement("h3");
    const hr = document.createElement("hr");

    h3.innerText = "My Trips";

    tripContainer.appendChild(h3);
    tripContainer.appendChild(hr);


    if(trips.length !== 0){
        trips.map(trip => {
            console.log(trip)
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
                    ${checkweather(trip.weather, trip.date)}
                    <div class="trip-notes">
                        <p class="trip-notes-heading">Notes: </p>
                        <div class="trip-notes-content">
                            ${checkNotes(trip)}
                        </div>
                    </div>
                </div>
                <div class="right-side">
                    <img id="my-trip-img" src="${trip.images.hits[0].largeImageURL}" alt="${trip.destination}">
                    <div class="right-trip-control">
                        <button id="add-notes" type="button" class="btn" data-toggle="modal" data-target="#exampleModalCenter">Add notes</button>
                        <button id="save-trip">Save Trip</button>
                        <button id="delete-trip">Remove Trip</button>
                    </div>
                </div>`;
            tripContainer.appendChild(div);

            handleTripControl(trip, trip.id); //Run Buttons => save, remove, add notes
            loadNotes();
        });
    }
    
    else{
        const isTripFound = document.querySelector('.no-trip-info');

        if(isTripFound){
            isTripFound.remove();
        }
        const noTripElement = document.createElement('div');
        noTripElement.classList.add('no-trip-info')

        noTripElement.innerText = "Sorry, No trips found";
        tripContainer.appendChild(noTripElement);
    }

}

const loadNotes = () => {
    const tripsDOM = document.querySelectorAll('.my-trip');

    if(tripsDOM.length !== 0){

        tripsDOM.forEach(tripEl => {
            const tripsStore = getTripsList();

            tripsStore.map(trip => {
                if(trip.id === tripEl.dataset.id){
                    
                    if(trip.notes.length !== 0){
                        if(tripEl.querySelector('.noNotesFound')){
                            tripEl.querySelector('.noNotesFound').remove();
                        }
                        if(tripEl.querySelector('.waitingForNotes')){
                            tripEl.querySelector('.waitingForNotes').remove();
                        }
                    }
                    const container = tripEl.querySelector('.trip-notes-content');

                    trip.notes.map(note => {
                        const p = document.createElement('p');
                        p.classList.add('note-content-p');

                        p.innerText = note;

                        const a = document.createElement('a');
    
                        a.classList.add('removeNote');
                        a.href = "#";
                        a.innerText = 'X';
    
                        p.appendChild(a);
    
                        container.appendChild(p);
                    });
                }
            });
        });
        removeNoteBTN();
    }
}

// class Notes {
//     removeNotes = () => {

//     }
// }

const removeNoteBTN = () => {
    let trips = getTripsList();
    const removeBTNs = document.querySelectorAll('.removeNote');
    removeBTNs.forEach(btn => 
        btn.addEventListener('click', _=> {
        _.preventDefault();

        trips.map(trip => {
            if(trip.notes.length !== 0){
                return trip.notes = trip.notes.filter(note => {
                    if(_.target.parentNode.firstChild.data !== note){
                        return note;
                    }
                })
            }
        })
        
        localStorage.setItem("trips-app-planner", JSON.stringify(trips));
        


        storage.map(trip => {
            if(trip.notes.length !== 0){
                return trip.notes = trip.notes.filter(note => {
                    if(_.target.parentNode.firstChild.data !== note){
                        return note;
                    }
                })
            }else{
                
            }
            // checkNotes(trip);
            
        });
        modal('Note is removed', 'warning');
        searchedTripsData(storage);
        return storage;
    }));
}

// User Trips Menu
const userTrips = () => {
    let myTrips = getTripsList(); // Either [] or [{...}, {...}]
    document.querySelector("#trips-search").style.display = "none";

    document.querySelector(".trips-gallery").innerHTML = '';
    updateUI(myTrips);
}

document.querySelector(".my-trips-menu").addEventListener('click', _ => {
    _.preventDefault();
    userTrips();
});


const mainPage = () => {
    let trips = storage;
    updateUI(trips);
    document.querySelector("#trips-search").style.display = "flex";
}

document.querySelector(".main-menu").addEventListener('click', _ => {
    _.preventDefault();
    mainPage();
});



document.addEventListener("DOMContentLoaded", ()=> {
    let storageSavedItems = getTripsList();
    
    storage = [...storageSavedItems];
    if(storage.length === 0){
        storage = [];
    }
    updateUI(storage);
});

export {
    storage, updateUI, countDown, getTripsList, searchedTripsData, modal
}