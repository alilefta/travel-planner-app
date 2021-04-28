const fib = (q) => {
    let s1, s2;
    let sum = 0;
    for(let i = 0; i < q; i++){
        s1 = i;
        s2 = i + i;
        sum = sum + (s1 + s2);
        console.log(sum)
    }
}


fib(20);