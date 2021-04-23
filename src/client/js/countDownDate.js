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
        console.log("You missed the date")
    }else{
        console.log(days+" days left")

    }
    }, 1000);
}

export{
    countDown
}