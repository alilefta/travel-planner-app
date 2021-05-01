import {updateUI, modal, getTripsList, checkweather, checkNotes, modalForNotes, checkDates, lengthOfTrip} from './../dataHandle';


describe("DOM modal notifications", () => {
    it("Check if modal is running", () => {
        expect(modal("Hello World")).toBe("Hello World");
    })
})

describe("Get trips list from Local Storage", () => {
    it("Should returns array", () => {
        expect(getTripsList()).toEqual([])
    })
})


describe("Check weather if it less than 7 days or more, return DOM element as string", () => {
    it("Should returns string", () => {
        expect(checkweather([], "date")).toEqual("<div class=\"trip-weather\"><p>Trip weather is out of reach</p></div>")
    })
})

describe("Check notes if there are notes or note, and return DOM Element as string", () => {
    it("Should returns string", () => {
        let trip = {notes : ["Hello world"]}
        expect(checkNotes(trip)).toEqual("");
    })
})

describe("Modal for a form to get a notes", () => {
    it("Should returns string", () => {
        const el = document.querySelector(".my-trip");
        if(el){
            const id = el.dataset.id;
            expect(modalForNotes(id)).toEqual("");
        }
    })

    it("Should return null when no parameters provided", () => {
        expect(modalForNotes()).toEqual(null)
    })
})

describe("Check two Dates and return difference in days", () => {
    it("Should return a number 5", () => {
        let trip = {
            date: "2021-05-27",
            endDate: "2021-06-01",

        }
        expect(checkDates(trip)).toEqual(5);
    })
})


describe("Check length of a trip by calculating difference and returns a DOM element string", () => {
    it("Should return a string represent: length is 5 days", () => {
        let trip = {
            date: "2021-05-27",
            endDate: "2021-06-01",

        }
        expect(lengthOfTrip(trip)).toEqual("<p>Length of trip: 5 days<p>");
    })
})

describe("Should Update UI when call with an array", () => {
    it("No parameters provided", () => {
        updateUI().then(data => expect(data).toEqual(null));
    })

    it("Runs when trips is provided", () => {
        updateUI([]).then(data => expect(data).toEqual(null));
    })
})