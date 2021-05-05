let storage = [];

const exchangeData = (data = null) => {
    let storageMigrated = [];
    if(data !== null){
        storageMigrated = [...data];
        fetch('http://localhost:8081/trips', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(storageMigrated)
        }).then(data => data.json()).then(data => console.log(data))
        .catch(err => {
            throw new Error(err);
        })
    }else{
        fetch('http://localhost:8081/trips').then(data => data.json()).then(data => console.log(data))
        .catch(err => {
            throw new Error(err);
        })
    }
    return storageMigrated.length > 0 ? storageMigrated: storage;
}

//Add modal notifications on user interaction with the page
const modal = (msg, type = 'success') => {
    const modal = document.querySelector("#modalNotify");
    const messageEl = document.querySelector(".modalNotify--message");
    
    if(messageEl){
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

    return msg;
} 

//Submitted data by form is added to global data storage, which then update the page on every change happens
const searchedTripsData = (data) => {
    storage = [...data];
    storage = storage.reduce((unique, currentValue) => {
        if(!unique.some(obj => obj.id === currentValue.id)) {
            unique.push(currentValue);
        }
        return unique;
    },[]);
    exchangeData(storage);
    updateUI(storage);
    return storage;
}

// Get data from LocalStorage
const getTripsList = () => {
    let tripsList;
    if(localStorage.getItem('trips-app-planner') === null ){
        tripsList = [];
    }else{
        tripsList = JSON.parse(localStorage.getItem('trips-app-planner'));
    }
    return tripsList;
}

// Remove trip from localStorage and global storage by an ID
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
// Save the trip to both LocalStorage and global storage
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

// Count down timer to calculate days between departure date and current date
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
// Check if the date provided by user is within 7 days of weather API data
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

// Check if trip has notes, Show them instantly, otherwise show a message to tell "No notes"  
const checkNotes = (trip) => {
    let x = '';
    if(trip.notes.length === 0){
        x = `<p class="noNotesFound">No trip notes ... </p>`
    }else{
        let f = '';
        storage.forEach(e => {
            e.notes.map(note => {
                return f += `<p class="note-content-p">${note}<a href="#" class="removeNote">Remove</a></p>`
            })
            x = f;
        });
    }


    return x;
}

// Add notes to trip by using unique ID to all of trip and note
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
    });

    

    searchedTripsData(storage);
    return storage;
}

// Rendering a form to show up to the user, used to get a note input
const modalForNotes =(dataId) => {
    const trip = document.querySelector(`[data-id='${dataId}']`);
    if(trip){
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
                        <button type="button" class="btn userNotesBtn"  data-dismiss="modal">Add Note</button>
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
        });
        return dataId;
    }else{
        return null;
    }
}

// Handle save, remove and add notes events of each trip
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
            });
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
        });
    }

    if(removeBTN){
        removeBTN.forEach(btn => {
            btn.addEventListener('click', (e)=> {
                let dataID = e.target.parentNode.parentNode.parentNode.dataset.id; 
                if(dataID === trip.id){
                    removeTrip(trip.id);
                }
            });
        });
    }
}

// Calculate length of a trip by calculating days between first date and last one
const checkDates = (trip) => {
    let date1 = new Date(trip.date);
    let date2 = new Date(trip.endDate);
    let differenceInTime = date2.getTime() - date1.getTime();
    var differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays;
}

// If a user provide a second date, show a DOM element to tell how many days a trip will take
// Otherwise show DOM element to tell if no end date was provided
const lengthOfTrip = (trip) => {
    let x = '';
    if(trip.endDate !== ''){
        x = `<p>Length of trip: ${checkDates(trip) > 0 ? checkDates(trip)+" days"  : "Outdated!!"}<p>`;
    }else{
        x = '<p>Length of trip: N/A</p>';
    }
    return x;
}


// Show a DOM element of the trip, its weather, image, notes and other info
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

    if(tripContainer){
        const h3 = document.createElement("h3");
        const hr = document.createElement("hr");
    
        h3.innerText = "My Trips";
    
        tripContainer.appendChild(h3);
        tripContainer.appendChild(hr);
        if(typeof trips === 'object'){
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
                            ${lengthOfTrip(trip)}
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
        }else{
            return undefined
        }
    }else{
        return null;
    }
}

// Rendering Notes as a DOM element
const loadNotes = () => {
    const tripsDOM = document.querySelectorAll('.my-trip');

    if(tripsDOM.length !== 0){

        tripsDOM.forEach(tripEl => {
            const tripsStore = getTripsList();
            // console.log(tripsStore)
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
                    if(container.querySelectorAll('.note-content-p').length !== 0){
                        container.querySelectorAll('.note-content-p').forEach(e => e.remove());
                    }
                    trip.notes.map(note => {
                        const p = document.createElement('p');
                        p.classList.add('note-content-p');

                        p.innerText = note;

                        const a = document.createElement('a');
    
                        a.classList.add('removeNote');
                        a.href = "#";
                        a.innerText = 'Remove';
    
                        p.appendChild(a);
    
                        container.appendChild(p);
                    });
                }
            });
        });
        removeNoteBTN();
    }
}

// Handling click on remove button, to remove a note from the storage
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
            }
            // checkNotes(trip);
            
        });
        modal('Note is removed', 'warning');
        searchedTripsData(storage);
        return storage;
    }));
}

// Handling the main navbar buttons
const basicFunctionality = () => {
    // User Trips Menu
    const userTrips = () => {
        let myTrips = getTripsList(); // Either [] or [{...}, {...}]
        document.querySelector("#trips-search").style.display = "none";
    
        document.querySelector(".trips-gallery").innerHTML = '';
        updateUI(myTrips);
    }
    

    const userMenuBTN = document.querySelector(".my-trips-menu");
    if(userMenuBTN){
        userMenuBTN.addEventListener('click', _ => {
            _.preventDefault();
            userTrips();
        });
    }


    const mainPage = () => {
        let trips = storage;
        searchedTripsData(trips)
        document.querySelector("#trips-search").style.display = "flex";
    }
    const mainMenuBTN = document.querySelector(".main-menu");
    if(mainMenuBTN){
        mainMenuBTN.addEventListener('click', _ => {
            _.preventDefault();
            mainPage();
        });
    }
}

// Invoking the navbar interactions function 
basicFunctionality();


// Automatically load trips when DOM is painted
document.addEventListener("DOMContentLoaded", ()=> {
    let storageSavedItems = getTripsList();
    
    storage = [...storageSavedItems];
    if(storage.length === 0){
        storage = [];
    }
    updateUI(storage);
});

export {
    storage, updateUI, countDown, getTripsList, searchedTripsData, modal, checkweather, checkNotes, modalForNotes, checkDates, lengthOfTrip
}