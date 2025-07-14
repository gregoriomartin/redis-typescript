import * as net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const server: net.Server = net.createServer((connection: net.Socket) => {
    // Handle connection
    connection.on("data", (data: Buffer) => {
        const args = data.toString().split("\r\n");
        console.log("Args received: ", args);
        const command: string = args[2];
        console.log("Command: ", command);
        switch (command) {
            default:
            case "PING":
                console.log("PING command received");
                connection.write(`+PONG\r\n`);
                break;
            case "ECHO":
                console.log("ECHO command received");
                let str: string = args[4];
                connection.write(`$${str.length}\r\n${str}\r\n`);
                break;
        }
    });
});

server.listen(6379, "127.0.0.1");
