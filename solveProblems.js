let x = 12345;

let sum = 0;

do {
    sum += x % 10;
    x = x / 10;
}while(x != 0)


console.log(sum)