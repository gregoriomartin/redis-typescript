import * as net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const map = new Map<string, {
    value: string;
    expiresAt?: number; // timestamp in ms
}>();

setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of map) {
        if (entry.expiresAt && now > entry.expiresAt) {
            console.log(`Cleaning up expired key: ${key}`);
            map.delete(key);
        }
    }
}, 10);

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
                handleSetCommand(args, connection);
                break;
            case "GET":
                console.log("GET command received");
                const getKey: string = args[4];
                const getValue: string | undefined = map.get(getKey)?.value;
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


function handleSetCommand(args: string[], connection: net.Socket) {
    console.log("SET command received");

    const key: string = args[4];
    const value: string = args[6];

    let expiresAt: number | undefined = undefined;

    // Parse optional arguments
    for (let i = 8; i < args.length; i += 2) {
        const option = args[i]?.toUpperCase();
        if (!option) continue;

        switch (option) {
            case "PX":
                expiresAt = Date.now() + parseInt(args[i + 2]);
                break;
        }
    }

    map.set(key, { value, expiresAt });
    console.log(`Setting key: ${key}, value: ${value}, expiresAt: ${expiresAt}`);

    connection.write(`+OK\r\n`);
}

server.listen(6379, "127.0.0.1");
