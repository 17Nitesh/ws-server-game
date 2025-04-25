import WebSocket from "ws";
export class Player {
    constructor(playerId, ws) {
        this.id = playerId;
        this.name = null;
        this.ws = ws;
        this.roomId = null;
        this.transform = {
            x: 0,
            y: 0,
            z: 0,
            rotation: 0,
            scale: 1
        };
        this.animation = null;
        // this.leftHand = null;
        // this.rightHand = null;
        this.isCooking = false;
        this.timeToCook = 0;
    }
    send(message) {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        }
    }
    // pickup(item) {
    //     if (item.type === "leftHand" && this.leftHand === null) {
    //         this.leftHand = item;
    //     } else if (item.type === "rightHand" && this.rightHand === null) {
    //         this.rightHand = item;
    //     }
    //     else {
    //         this.send("No free hands");
    //         console.log("No free hands");
    //     }
    // }
    // drop(item) {
    //     if (item.type === "leftHand") {
    //         this.leftHand = null;
    //     } else if (item.type === "rightHand") {
    //         this.rightHand = null;
    //     }
    // }
    startCooking(timer) {
        if (this.inventory) {
            this.isCooking = true;
            this.timer = timer;
        }
    }
}