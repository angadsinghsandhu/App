const htttp = require('http');
const app = require('./backend/app');
const debug = require('debug')("node-angular");
var tempPort = process.env.PORT || 3000;

// const server = htttp.createServer((req, res) => {
//     // res.
//     res.end('first response');
// });

const normalizePort = val => {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number 
        return port;
    }

    return false;
};

const onError = error => {
    if (error.syscall !== "listen") {
        throw error;
    }
    const bind = (typeof addr === "string") ? "pipe" + addr : "port " + port;

    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privlages");
            process.exit();
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit();
            break;
        default:
            throw error;
    }
};

const onListening = () => {
    const addr = server.address();
    const bind = (typeof addr === "string") ? "pipe" + addr : "port " + port;
    debug("listening on " + bind)
};

const port = normalizePort(tempPort);
app.set('port', port);

const server = htttp.createServer(app);
server.on("error", onError) //if error occurs
server.on("listening", onListening);    //if everything runs smoothly
server.listen(port);    //also to use default port provided by host