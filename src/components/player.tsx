export class Player {
    constructor(public x: number,public y: number, public health: number, public ms: number, public item: Array<number>) {
        this.x = 0;
        this.y = 0;
        this.health = 50;
        this.ms = 3;
        this.item = [];
    }
}