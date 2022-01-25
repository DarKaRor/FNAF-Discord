const utils = require('../utils/utils');

class Clock{
    constructor(){
        this.hours = [12,1,2,3,4,5,6];
        this.currentHour = 0;
        this.gameHour = 90;
        this.hourCounter = 0;
    }

    getCurrentHour = () => this.hours[this.currentHour];
    advanceHour = () => {
        this.currentHour = utils.clamp(this.currentHour + 1, 0, this.hours.length - 1);
        this.hourCounter = 0;
    }
    checkPassed = () => this.hourCounter>=this.gameHour;
    reset = () => {
        this.currentHour = 0;
        this.hourCounter = 0;
    }

    
}

module.exports = {
    Clock
}