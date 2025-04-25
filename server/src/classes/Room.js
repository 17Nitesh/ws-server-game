export class Room {
    constructor(roomId, name) {
        this.gameState = false;
        this.id = roomId;
        this.name = name;
        this.players = new Map();
        this.orders = [];
        this.defaultOrders = new Set(["burger", "salad", "soup", "pizza"]);
        this.character = {
            "cook1": { playerId: null, isReady: false, points: 0 },
            "cook2": { playerId: null, isReady: false, points: 0 },
            "cook3": { playerId: null, isReady: false, points: 0 },
            "cook4": { playerId: null, isReady: false, points: 0 }
        };
        this.workStation = {
            "Stove1": { isEngaged: false, player: null },
            "Stove2": { isEngaged: false, player: null },
            "ChoppingBoard1": { isEngaged: false, player: null },
            "ChoppingBoard2": { isEngaged: false, player: null },
            "DispatchTable": { isEngaged: false, player: null },
            // "trashCan1": { isEngaged: false, player: null },
            // "trashCan2": { isEngaged: false, player: null },
            "CoffeeMachine1": { isEngaged: false, player: null },
            // "iceCreamMachine": { isEngaged: false, player: null },
            // "mixer": { isEngaged: false, player: null }
        };
    }

    addPlayer(player) {
        if (this.players.has(player.id)) {
            player.send({ type: "already-in-room" });
            return;
        }
        if (this.players.size >= 4) {
            player.send({ type: "room-full" });
            return;
        }
        this.players.set(player.id, player);
        player.roomId = this.id;

        for (const key of Object.keys(this.character)) {
            if (this.character[key].playerId === null) {
                this.character[key].playerId = player.id;
                break;
            }
        }
        player.send({
            type: "room-joined",
            roomId: this.id,
            character: Object.keys(this.character).find(key => this.character[key].playerId === player.id)
        });
    }

    removePlayer(player) {
        this.players.delete(player.id);

        // Free the assigned character slot
        for (const key of Object.keys(this.character)) {
            if (this.character[key].playerId === player.id) {
                this.character[key].playerId = null;
                this.character[key].isReady = false;
                this.character[key].points = 0;
                break;
            }
        }

        // If no players are left, reset everything
        if (this.players.size === 0) {
            console.log(`All players have left. Resetting room: ${this.id}`);

            this.gameState = false;
            this.orders = []; // Remove all pending orders

            // Reset character states
            for (const key of Object.keys(this.character)) {
                this.character[key].playerId = null;
                this.character[key].isReady = false;
                this.character[key].points = 0;
            }

            // Reset workstation engagement
            for (const key of Object.keys(this.workStation)) {
                this.workStation[key].isEngaged = false;
                this.workStation[key].player = null;
            }
        }

        player.roomId = null;
    }


    broadcast(message, filterFn = (player) => true) {
        for (const player of this.players.values()) {
            if (filterFn(player)) {
                player.send(message);
            }
        }
    }

    machineEngaged(machine, player) {
        if (!this.workStation[machine]) {
            console.error(`Invalid machine: ${machine}`);
            return;
        }
        if (this.workStation[machine].isEngaged) {
            console.error(`Machine already engaged: ${machine}`);
            player.send({
                type: "machine-engage-error",
                msg: "the machine is already engaged"
            })
            return;
        }
        this.workStation[machine].isEngaged = true;
        this.workStation[machine].player = player;
        this.broadcast({
            type: "machine-engaged",
            machine: machine,
            player: player.id
        });
    }

    machineDisengaged(machine) {
        if (!this.workStation[machine]) {
            console.error(`Invalid machine: ${machine}`);
            return;
        }
        this.workStation[machine].isEngaged = false;
        this.workStation[machine].player = null;
    }

    scorePoint(player) {
        for (const key of Object.keys(this.character)) {
            if (this.character[key].playerId === player.id) {
                this.character[key].points += 295;
                this.broadcast({
                    type: "score-update",
                    character: key,
                    points: this.character[key].points
                });
                break;
            }
        }
    }

    pickupItem(item, player) {
        console.log(`${player.id} picked up ${item}.`);

        this.broadcast({
            type: "pickup",
            playerId: player.id,
            item: item,
        });
    }

    dropItem(item, position, player) {

        console.log(`${player.id} dropped ${item} at (${position.x}, ${position.y}, ${position.z})`);

        this.broadcast({
            type: "drop",
            playerId: player.id,
            item: item,
            position: position
        });
    }

    // submitRecipe(recipe, player) {
    //     console.log(`${player.id} submitted recipe: ${recipe}`);
    //     this.scorePoint(player);
    //     this.broadcast({
    //         type: "recipe-submitted",
    //         playerId: player.id,
    //         recipe: recipe
    //     });
    // }

    // dispatchItem(item, player) {
    //     console.log(`${player.id} is trying to dispatch ${item}`);

    //     // Check if the item is a valid order
    //     if (this.orders.includes(item)) {
    //         this.orders = this.orders.filter(o => o !== order);
    //         player.send({ type: "dispatch-success", item: item });
    //         this.scorePoint(player);

    //         // Broadcast order completion
    //         this.broadcast({
    //             type: "order-completed",
    //             playerId: player.id,
    //             item: item,
    //             orderDone: this.orders
    //         });

    //         console.log(`Order delivered: ${item} ✅`);
    //         this.scorePoint(player); // Reward player for successful dispatch
    //     } else {
    //         player.send({ type: "dispatch-failed", message: "Invalid order!" });
    //         console.log(`Failed dispatch: ${item} ❌`);
    //     }
    // }

    dispatchItem(item, player) {
        console.log(`${player.id} is trying to dispatch ${item}`);

        // Check if the item is a valid order
        if (this.orders.includes(item)) {
            this.orders = this.orders.filter(o => o !== item); // Use 'item' instead of 'order'
            player.send({ type: "dispatch-success", item: item });
            this.scorePoint(player);

            // Broadcast order completion
            this.broadcast({
                type: "order-completed",
                playerId: player.id,
                item: item,
                orderDone: this.orders
            });

            console.log(`Order delivered: ${item} ✅`);
            this.scorePoint(player); // Reward player for successful dispatch
        } else {
            player.send({ type: "dispatch-failed", message: "Invalid order!" });
            console.log(`Failed dispatch: ${item} ❌`);
        }
    }



    startGame() {
        if (this.gameState) {
            console.error(`Game already started in room: ${this.id}`);
            return;
        }
        this.gameState = true;
        const assignedPlayers = Object.values(this.character).filter(slot => slot.playerId !== null);
        // const allReady = assignedPlayers.length === 4 && assignedPlayers.every(slot => slot.isReady);
        const allReady = true;

        if (allReady) {
            this.broadcast({ type: "game-started", time: 120000 });
            console.log(`Game started in room: ${this.id}`);

            const totalTime = 120000; // 2 minutes in milliseconds
            let timeRemaining = totalTime;

            // Send initial game time update
            // this.broadcast({ type: "game-starting", time: totalTime });

            // 🔹 Countdown Timer
            const countdownInterval = setInterval(() => {
                if (this.gameState === false) {
                    clearInterval(countdownInterval);
                    return;
                }
                timeRemaining -= 1000;
                this.broadcast({ type: "game-time-update", time: timeRemaining });

                if (timeRemaining <= 0) {
                    clearInterval(countdownInterval);
                }
            }, 1000);

            // Order Management
            const orderInterval = setInterval(() => {
                if (this.gameState === false) {
                    clearInterval(orderInterval);
                    return;
                }
                if (this.orders.length < 3) { // Limit active orders to 3
                    const orderList = Array.from(this.defaultOrders); // Convert Set to Array
                    const newOrder = orderList[Math.floor(Math.random() * orderList.length)];

                    if (!newOrder) return; // Safety check to avoid pushing undefined

                    this.orders.push(newOrder);
                    this.broadcast({ type: "new-order", order: newOrder });

                    console.log(this.orders);

                    // Remove order after 20 seconds if not completed
                    setTimeout(() => {
                        if (this.orders.includes(newOrder)) {
                            this.orders = this.orders.filter(o => o !== newOrder); // Corrected variable reference
                            console.log(`Order expired: ${newOrder}`);
                        }
                    }, 20000);
                }


            }, 5000); // New order every 5 seconds

            // 🔹 End Game Logic
            setTimeout(() => {
                clearInterval(countdownInterval);
                clearInterval(orderInterval); // Stop generating new orders

                // Calculate total points
                const totalPoints = Object.values(this.character)
                    .map(c => c.points)
                    .reduce((acc, points) => acc + points, 0);

                this.broadcast({
                    type: "game-ended",
                    message: "Game ended",
                    points: totalPoints
                });

                console.log(`Game ended in room: ${this.id}, Total Points: ${totalPoints}`);
                this.gameState = false;
            }, totalTime);
        } else {
            this.broadcast({
                type: "waiting-for-players",
                message: `Waiting for more players. Currently ${assignedPlayers.length}/4 are assigned and ${assignedPlayers.filter(p => p.isReady).length}/4 are ready.`
            });
        }
    }
}