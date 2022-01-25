class Animatronic {
    constructor(name, cameras, time, isSensitve, id, camera, spawn, screamer, level = 0) {
        this.name = name;
        this.cameras = cameras;
        this.level = level;
        this.time = time;
        this.camera = camera;
        this.isSensitve = isSensitve;
        this.id = id;
        this.counter = 0;
        this.spawn = spawn;
        this.screamer = screamer;
        this.killTime = 20;
        this.backTracks = true;
        this.inside = false;
        this.atDoor = false;
    }

    shouldMove(watching = false, camera) {
        if (this.isSensitve && watching) return false
        return this.getChance();
    }

    getChance() {
        let random = Math.floor(Math.random() * 20) + 1;
        return this.level >= random;
    }

}

class Freddy extends Animatronic {
    constructor(name, cameras, time, isSensitve, id, camera, spawn, screamer, level = 0) {
        super(name, cameras, time, isSensitve, id, camera, spawn, screamer, level);
        this.isSensitve = true;
        this.backTracks = false;
        this.order = ['1A','1B','7','4A','4B'];
    }

    shouldMove(watching = false, camera) {
        if (this.camera == "4B" && !this.inside) {
            if (camera.name == "4B" && watching) return false;
            let chance = super.shouldMove(false, camera);
            if (chance) this.atDoor = true;
            return chance;
        }
        return super.shouldMove(watching, camera);
    }
}

class Foxy extends Animatronic {
    constructor(name, cameras, time, isSensitve, id, camera, spawn, screamer, level = 0) {
        super(name, cameras, time, isSensitve, id, camera, spawn, screamer, level);
        this.isSensitve = true;
        this.phase = 0;
    }
}

module.exports = {
    Animatronic,
    Foxy,
    Freddy
}