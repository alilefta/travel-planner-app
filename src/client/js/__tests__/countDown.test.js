import {countDown} from "./../countDownDate";

describe("Count down from a specifed date into current date", ()=> {
    it("Check if it works normally on 2023-05-03", () => {
        let countDownDate = new Date("2023-05-03").getTime();
        let x = setInterval(function() {
            let now = new Date().getTime();
            let distance = countDownDate - now;
            let days = Math.floor(distance / (1000 * 60 * 60 * 24));

            if (distance < 0) {
                clearInterval(x);
                return expect(days).toBeLessThan(0);
            }else{
                return expect(days).toBeGreaterThan(0);

            }
        }, 1000);
    })
})