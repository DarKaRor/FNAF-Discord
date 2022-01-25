class Door {
    constructor(isClosed = false, isOn = false, isLocked = false) {
        this.isClosed = isClosed;
        this.isOn = isOn;
        this.isLocked = isLocked;
        this.occupied = false;
        this.time = 1;
    }

    open() {
        if (this.isLocked) return false;
        this.isClosed = !this.isClosed;
        return true;
    }

    active() {
        this.isOn = !this.isOn;
    }

    lock() {
        this.isLocked = true;
    }
    
}

module.exports = {
    Door
}