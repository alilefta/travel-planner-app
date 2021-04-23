const countDown = (date) => {
    let countDownDate = new Date(date).getTime();

    let x = setInterval(function() {
    let now = new Date().getTime();
    let distance = countDownDate - now;
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));

    // document.getElementById("demo").innerHTML = days + "d ";

    // If the count down is finished, write some text
    if (distance < 0) {
        clearInterval(x);
        // document.getElementById("demo").innerHTML = "You passed the date";
        return " You missed the date!!! ";
    }else{
        return days;

    }
    }, 1000);
}

const updateUI = (trips) => {
    const tripContainer = document.querySelector('.trips-gallery');
    console.log(trips)
    if(trips){
        trips.map(trip => {
            const div = document.createElement('div');
            div.classList.add("my-trip");
            div.innerHTML = `
                <div class="left-side">
                    <p class="trip-gallery-heading">Going to: ${trip.destination}</p>
                    <p class="trip-gallery-date">Departure date: ${trip.date}</p>
                    <p>${trip.destination}, ${trip.location.countryName} trip is about <span class="trip-date-countDown>${countDown(trip.date)}</span> days away</p>
                    <div class="left-trip-control">
                        <button id="save-trip">Save Trip</button>
                        <button id="delete-trip">Remove Trip</button>
                    </div>
                    <div class="trip-weather">
                        <p>Typical weather is: </p>
                        <p>High: 30C, Low : 5C</p>
                        <p>Mostly Cloudy throughout the day</p>
                    </div>
        
                </div>
                <div class="right-side">
                    <img id="my-trip-img" src="https://cdn.pixabay.com/photo/2015/07/13/14/40/paris-843229_1280.jpg" alt="">
                    <div class="right-trip-control">
                        <button id="add-lodging-info">Add lodging info</button>
                        <button id="add-packing-info">Add packing info</button>
                        <button id="add-notes">Add notes</button>
                    
                    </div>
                </div>`;
        })
    }

}


const storeData = async (data) => {
    updateUI(data)
}

export {
    storeData
}