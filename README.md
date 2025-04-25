
# Multiplayer Cooking Game Server

This project implements a multiplayer cooking game server using WebSocket. Players can join rooms, cook food, engage with machines, and dispatch orders.

## Features

### Room Management
- Players can create and join rooms.

### Character Assignment
- Each room has four cooking stations, and each player is assigned a cooking character.

### Game Logic
- The game runs with a countdown timer and random orders that players need to cook and deliver.

### Workstation Interaction
- Players can engage and disengage cooking machines (e.g., stove, chopping board, coffee machine).

### Item Pickup/Drop
- Players can pick up and drop items in the game.

## Project Structure

- **Player.js:** Defines the Player class and methods for sending messages, picking up and dropping items, and interacting with the game world.
  
- **Room.js:** Defines the Room class, managing players, machines, game state, orders, and the game timer.

- **server.js:** Initializes a WebSocket server, manages player connections, and handles room creation and joining.

- **helper/generateRandomCode.js:** Contains utility functions to generate random room and player IDs.

## Installation

### Clone the repository:
```bash
git clone https://github.com/yourusername/cooking-game-server.git
cd cooking-game-server
```

### Install dependencies:
Make sure you have Node.js installed. Then, run:
```bash
npm install
```

### Run the server:
Start the WebSocket server on port 8080:
```bash
npm start
```

This will start the WebSocket server on `ws://localhost:8080`.

## How to Play

### Creating a Room
- A player can create a new room by sending a `create-room` message with a room name.

Example:
```json
{
  "type": "create-room",
  "name": "Room Name"
}
```

### Joining a Room
- Players can join an existing room by sending a `join-room` message with the `roomId` and `playerName`.

Example:
```json
{
  "type": "join-room",
  "roomId": "abcd",
  "playerName": "Player 1"
}
```

### Character Assignment
- When a player joins a room, they are automatically assigned a character (e.g., `cook1`, `cook2`, etc.).

### Game Start
- The game automatically starts once all players are ready, and orders will be generated randomly.

### Machine Interaction
- Players can engage with machines (e.g., stove, chopping board) to cook food.

### Order Dispatch
- Players need to fulfill orders and dispatch them to earn points.

## WebSocket Message Types

### `create-room`
- **Request:** Creates a new room with a given name.
```json
{
  "type": "create-room",
  "name": "Room Name"
}
```

### `join-room`
- **Request:** Joins an existing room by `roomId` and assigns a `playerName`.
```json
{
  "type": "join-room",
  "roomId": "abcd",
  "playerName": "Player 1"
}
```

### `move`
- **Request:** Sends the player's new position (`x`, `y`, `z`) and rotation.
```json
{
  "type": "move",
  "position": { "x": 1, "y": 2, "z": 3 },
  "rotation": 90,
  "scale": 1
}
```

### `engage-machine`
- **Request:** Player engages a machine (e.g., stove, coffee machine).
```json
{
  "type": "engage-machine",
  "machine": "Stove1"
}
```

### `disengage-machine`
- **Request:** Player disengages from a machine.
```json
{
  "type": "disengage-machine",
  "machine": "Stove1"
}
```

### `pickup`
- **Request:** Player picks up an item (e.g., burger, salad).
```json
{
  "type": "pickup",
  "item": "burger"
}
```

### `drop`
- **Request:** Player drops an item at a specified position.
```json
{
  "type": "drop",
  "item": "burger",
  "position": { "x": 1, "y": 2, "z": 3 }
}
```

### `dispatch-item`
- **Request:** Player dispatches an item as part of an order.
```json
{
  "type": "dispatch-item",
  "item": "burger"
}
```

## Future Improvements

### Multiple Rooms
- The server can handle multiple rooms simultaneously, allowing for more players to join.

### Item Recipes
- Implement a system for players to combine ingredients into recipes before dispatching.

### UI Integration
- A front-end client can be developed to interact with this server for a complete multiplayer cooking experience.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
