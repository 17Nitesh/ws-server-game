// import { WebSocketServer } from "ws";
// import { Player } from "./classes/Player.js";
// import { Room } from "./classes/Room.js";
// import { generatePlayerId, generateRoomId } from "./helper/generateRandomCode.js";
// const wss = new WebSocketServer({ port: 8080 });

// const rooms = new Map();
// const room1 = new Room(abcd, "room1");
// rooms.set(room1.id, room1);

// wss.on("connection", (ws) => {
//     const playerId = generatePlayerId();
//     const player = new Player(playerId, ws);
//     ws.send(JSON.stringify({ type: "player-id", playerId }));
//     console.log("A new player connected with id:", playerId);
//     room1.addPlayer(player);

//     ws.on("message", (message) => {
//         const data = JSON.parse(message);

//         //     if (data.type === "create-room") {
//         //         let roomId;
//         //         do {
//         //             roomId = generateRoomId();
//         //         } while (rooms.has(roomId));
//         //         const room = new Room(roomId, data.name);
//         //         rooms.set(roomId, room);
//         //         room.addPlayer(player);
//         //         player.name = data.playerName;
//         //         player.send({ type: "room-created", roomId });
//         //         console.log(`Room created with id: ${roomId}`);
//         //     }

//         //     if (data.type === "join-room") {
//         //         const room = rooms.get(data.roomId);
//         //         if (room) {
//         //             room.addPlayer(player);
//         //             player.name = data.playerName;
//         //             player.send({ type: "room-joined", roomId: data.roomId });
//         //             console.log(`Player joined room with id: ${data.roomId}`);
//         //         } else {
//         //             player.send({ type: "room-not-found" });
//         //             console.log(`Room not found with id: ${data.roomId}`);
//         //         }
//         //     }

//         if (data.type === "move") {

//             console.log(data,)
//             if (player.roomId) {
//                 player.transform.x = data.position.x;
//                 player.transform.y = data.position.y;
//                 player.transform.z = data.position.z;
//                 player.transform.rotation = data.rotation;
//                 player.transform.scale = data.scale;

//                 const room = rooms.get(player.roomId);

//                 if (room) {
//                     room.broadcast({
//                         type: "update_position",
//                         playerId: player.id,
//                         position: player.transform
//                     }, player);
//                 }
//             }
//         }

//         if (data.type === "leave-room") {
//             const room = rooms.get(player.roomId);
//             if (room) {
//                 room.removePlayer(player);
//                 player.send({ type: "room-left" });
//                 console.log(`Player left room with id: ${player.roomId}`);
//             }
//         }
//     });

//     ws.on("close", () => {
//         console.log("A player disconnected");
//         rooms.delete(playerId)
//         console.log(rooms)
//     });
// });

// console.log("WebSocket server running on PORT: 8080");



// import { WebSocketServer } from "ws";
// import { Player } from "./classes/Player.js";
// import { Room } from "./classes/Room.js";
// import { generatePlayerId } from "./helper/generateRandomCode.js";

// const wss = new WebSocketServer({ port: 8080 });

// const rooms = new Map();
// const room1 = new Room("room1", "Kitchen");
// rooms.set(room1.id, room1);

// wss.on("connection", (ws) => {
//     const playerId = generatePlayerId();
//     const player = new Player(playerId, ws);

//     console.log(`New player connected: ${playerId}`);

//     // Assign player to the predefined room
//     room1.addPlayer(player);

//     // Send player ID and assigned character
//     const assignedCharacter = Object.keys(room1.character).find(key => room1.character[key] === playerId);
//     ws.send(JSON.stringify({ type: "player-id", playerId, character: assignedCharacter }));

//     ws.on("message", (message) => {
//         const data = JSON.parse(message);

//         if (data.type === "move") {
//             console.log(playerId, data);
//             if (player.roomId) {
//                 player.transform.x = data.position.x;
//                 player.transform.y = data.position.y;
//                 player.transform.z = data.position.z;

//                 const room = rooms.get(player.roomId);

//                 if (room) {
//                     room.broadcast({
//                         type: "update_position",
//                         character: assignedCharacter,
//                         position: player.transform
//                     }, player);
//                 }
//             }
//         }

//         if (data.type === "leave-room") {
//             const room = rooms.get(player.roomId);
//             if (room) {
//                 room.removePlayer(player);
//                 ws.send(JSON.stringify({ type: "room-left" }));
//                 console.log(`Player ${playerId} left room ${player.roomId}`);
//             }
//         }
//     });

//     ws.on("close", () => {
//         console.log(`Player ${playerId} disconnected`);
//         room1.removePlayer(player);
//     });
// });

// console.log("WebSocket server running on PORT: 8080")






// import { WebSocketServer } from "ws";
// import { Player } from "./classes/Player.js";
// import { Room } from "./classes/Room.js";
// import { generatePlayerId } from "./helper/generateRandomCode.js";

// const wss = new WebSocketServer({ port: 8080 });

// const rooms = new Map();
// const room1 = new Room("room1", "Kitchen");
// rooms.set(room1.id, room1);

// wss.on("connection", (ws) => {
//     const playerId = generatePlayerId();
//     const player = new Player(playerId, ws);
//     console.log(`New player connected: ${playerId}`);

//     room1.addPlayer(player);

//     const assignedCharacter = Object.keys(room1.character).find(key => room1.character[key] === playerId);
//     ws.send(JSON.stringify({ type: "player-id", playerId, character: assignedCharacter }));

//     ws.on("message", async (message) => {
//         try {
//             const data = JSON.parse(message);
//             handleMessage(player, data);
//         } catch (err) {
//             console.error("Invalid JSON received:", err);
//         }
//     });

//     ws.on("close", () => {
//         console.log(`Player ${playerId} disconnected`);
//         if (player.roomId) {
//             const room = rooms.get(player.roomId);
//             if (room) {
//                 room.removePlayer(player);
//                 room.broadcast({ type: "player-disconnected", playerId });
//             }
//         }
//     });
// });

// async function handleMessage(player, data) {
//     if (data.type === "move") {
//         if (player.roomId) {
//             player.transform = { ...data.position };

//             const room = rooms.get(player.roomId);
//             if (room) {
//                 room.broadcast({
//                     type: "update_position",
//                     character: Object.keys(room.character).find(key => room.character[key] === player.id),
//                     position: player.transform
//                 }, player);
//             }
//         }
//     }
// }

// console.log("WebSocket server running on PORT: 8080");
