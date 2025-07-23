import * as net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const map: Map<string, string> = new Map<string, string>();

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
            case "SET":
                console.log("SET command received");
                const key: string = args[4];
                const value: string = args[6];
                map.set(key, value);
                console.log(`Setting key: ${key}, value: ${value}`);
                // Here you would typically store the key-value pair in a database or in-memory store
                connection.write(`+OK\r\n`);
                break;
            case "GET":
                console.log("GET command received");
                const getKey: string = args[4];
                const getValue: string | undefined = map.get(getKey);
                if (getValue !== undefined) {
                    console.log(`Getting key: ${getKey}, value: ${getValue}`);
                    connection.write(`$${getValue.length}\r\n${getValue}\r\n`);
                } else {
                    console.log(`Key not found: ${getKey}`);
                    connection.write(`$-1\r\n`);
                }
                break;
        }
    });
});

server.listen(6379, "127.0.0.1");
