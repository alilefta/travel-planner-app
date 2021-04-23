const updateUI = (data) => {
    const tripContainer = document.querySelector('.trips-gallery');
    const div = document.createElement('div');
    div.classList.add("my-trip");
    div.innerHTML = `
        <div class="left-side">
            <p class="trip-gallery-heading">Going to: Paris</p>
            <p class="trip-gallery-date">Departure date: 22/4/2021</p>
            <p>Paris, France trip is about 222 days away</p>
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
}