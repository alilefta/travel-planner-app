const app = require('./server');
const port = 8081;

app.listen(port, ()=> {
    console.log("Server is listening on port", port, "....");
});
