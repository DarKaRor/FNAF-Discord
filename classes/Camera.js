const utils = require('../utils/utils');

class Picture {
    constructor(name, rarity = 100) {
        this.name = name;
        this.rarity = rarity;
    }
}

class Scene {
    constructor(pictures) {
        this.pictures = pictures;
        this.default = pictures[0];
        this.unOrdered = [...this.pictures];
        let pictures1 = this.pictures.filter(picture => picture.rarity === 100);
        let length = pictures1.length;
        pictures1.forEach(picture => picture.rarity = 100 / length);
        this.pictures.sort((a, b) => a.rarity - b.rarity);
    }

    getPicture() {

        for (let i = 0; i < this.pictures.length; i++) {
            let picture = this.pictures[i];
            // The rarity of the picture represents a percentage of the chance of being selected
            let rarity = picture.rarity / 100;
            let random = utils.getRandomFloat(0, 1);
            //console.log(random, rarity);
            if (random <= rarity) return picture;
        }

        return this.default;
    }
}

class Camera {
    constructor(name, room, pictures, src, followUps, active = [0, 0, 0, 0]) {
        this.name = name;
        this.room = room;
        this.active = active;
        this.src = src;
        this.pictures = pictures;
        this.prevPicture = pictures["i0000"];
        this.followUps = followUps;

        if (name == "1C") {
            this.isFoxy = true;
            this.phase = 0;
            this.prevPicture = pictures["i0"];
        }

        if (name == "2B") this.yellowBear = this.pictures['i0000'].unOrdered[1].name;
    }

    setPicture(key) {
        if (this.pictures[key]) this.prevPicture = this.pictures[key];
    }

    setActive(active) {
        if (this.pictures[active]) this.active = active;
    }

    checkActive = (key) => this.active.join('') == key;

    getPicture() {
        // convert active to string, then use it as a key to get the picture
        let key = "i" + this.active.join('');
        if (this.isFoxy) key = this.phase;
        let scene = this.prevPicture;
        let pictures = this.pictures;
        // Check if the picture is an array or a string
        scene = pictures[key] ? pictures[key] : scene;
        this.prevPicture = scene;
        return this.src + scene.getPicture().name;
    }
}

module.exports = {
    Camera,
    Scene,
    Picture
}

