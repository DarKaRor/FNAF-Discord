const utils = require('../utils/utils');

class PowerSystem {
    constructor() {
        this.power = 100;
        this.fullUsage = ["🟩", "🟩", "🟨", "🟥"];
        this.powerUsage = [9.6, 4.8, 3.2, 2.4]; // each second
        this.extraUsage = undefined;
        this.usage = 1;
        
    }

    getUsage = () => this.fullUsage.slice(0, this.usage).join("");

    updateUsage = (val) => this.usage = utils.clamp(this.usage + val, 1, this.fullUsage.length);

    updatePower = (val,hour) => {
        // Extra power
        if(this.extraUsage) this.power -= (this.extraUsage / hour) * (1 / val);
        // Power usage
        this.power -= 1 / this.powerUsage[this.usage - 1] * (1 / val);
    }

    reset = () => {
        this.power = 100;
        this.usage = 1;
    }
}

module.exports ={
    PowerSystem
}