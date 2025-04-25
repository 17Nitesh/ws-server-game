import { WebSocketServer } from "ws";
import { Player } from "./classes/Player.js";
import { Room } from "./classes/Room.js";
import { generatePlayerId, generateRoomId } from "./helper/generateRandomCode.js";

const PORT = 8080
const wss = new WebSocketServer({ port: PORT });
const rooms = new Map();

const room1 = new Room("abcd", "room1");
rooms.set(room1.id, room1);

wss.on("connection", (ws) => {
    const playerId = generatePlayerId();
    const player = new Player(playerId, ws);
    ws.send(JSON.stringify({ type: "player-id", playerId }));
    console.log("A new player connected with id:", playerId);
    room1.addPlayer(player);
    room1.startGame();


    ws.on("message", (message) => {
        const data = JSON.parse(message);
        // console.log(data)

        if (data.type === "create-room") {
            let roomId;
            do {
                roomId = generateRoomId();
            } while (rooms.has(roomId));
            const room = new Room(roomId, data.name);
            rooms.set(roomId, room);
            room.addPlayer(player);
            player.name = data.playerName;
            player.send({ type: "room-created", roomId });
            console.log(`Room created with id: ${roomId}`);
        }

        if (data.type === "join-room") {
            const room = rooms.get(data.roomId);
            if (room) {
                room.addPlayer(player);
                player.name = data.playerName;
                player.send({ type: "room-joined", roomId: data.roomId });
                console.log(`Player joined room with id: ${data.roomId}`);
                // room.startGame();
            } else {
                player.send({ type: "room-not-found" });
                console.log(`Room not found with id: ${data.roomId}`);
            }
        }

        if (data.type === "move") {
            if (player.roomId) {
                player.transform.x = data.position.x;
                player.transform.y = data.position.y;
                player.transform.z = data.position.z;
                player.transform.rotation = data.rotation;
                player.transform.scale = data.scale;

                const room = rooms.get(player.roomId);

                if (room) {
                    const assignedCharacter = Object.keys(room.character).find(
                        key => room.character[key].playerId === player.id
                    );
                    // console.log("h")
                    room.broadcast({
                        type: "player-moved",
                        playerId: player.id,
                        position: player.transform,
                        character: assignedCharacter
                    }, p => p.id !== player.id);
                }
            }
        }
        if (data.type === "engage-machine") {
            console.log(data)
            if (player.roomId) {
                // const room = rooms.get(player.roomId);
                const room = room1;
                if (room) {
                    room.machineEngaged(data.machine, player);
                }
            }
        }
        if (data.type === "disengage-machine") {
            if (player.roomId) {
                console.log(data)
                // const room = rooms.get(player.roomId);
                const room = room1;
                if (room) {
                    room.machineDisengaged(data.machine, player);
                }
            }
        }
        if (data.type === "pickup") {
            if (player.roomId) {
                // const room = rooms.get(player.roomId);
                const room = room1;
                if (room) {
                    room.pickupItem(data.item, player);
                }
            }
        }

        if (data.type === "drop") {
            if (player.roomId) {
                // const room = rooms.get(player.roomId, player);
                const room = room1;
                if (room) {
                    room.dropItem(data.item, data.position, player);
                }
            }
        }
        // if (data.type === "submit-reciepe") {
        //     if (player.roomId) {
        //         // const room = rooms.get(player.roomId, player);
        //         const room = room1;
        //         if (room) {
        //             // room.submitReciepe(data.reciepe, player);
        //         }
        //     }
        // }
        if (data.type === "dispatch-item") {
            if (player.roomId) {
                const room = rooms.get(player.roomId);
                if (room) {
                    room.dispatchItem(data.item, player);
                }
            }
        }

    });

    ws.on("close", () => {
        console.log("A player disconnected");
        if (player.roomId) {
            const room = rooms.get(player.roomId);
            if (room) {
                room.removePlayer(player);
            }
        }
    });

});

console.log(`Server running on Port ${PORT}`)