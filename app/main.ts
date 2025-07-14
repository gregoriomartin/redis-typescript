import * as net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const server: net.Server = net.createServer((connection: net.Socket) => {
    // Handle connection
    connection.on("data", (data: string) => {
        let command: string = data.trim().split(/\s+/)[0];
        switch (command) {
            default:
            case "PING":
                connection.write(`+PONG\r\n`);
                break;
            case "ECHO":
                let str: string = data.trim().split(/\s+/).slice(1).join(" ");
                connection.write(`$${str.length}+${str}\r\n`);
                break;
        }
    });
});

server.listen(6379, "127.0.0.1");
