class Office {
    constructor(leftDoor, rightDoor) {
        this.leftDoor = leftDoor;
        this.rightDoor = rightDoor;
        this.animatronics = [];
        this.inside = [];
        this.yellowBear = false;

        // Upload
        // this.states ={
        // "000000" : "./assets/Office/default.png",
        // "100000" : "./assets/Office/leftLight.png",
        // "000100" : "./assets/Office/rightLight.png",
        // "010000" : "./assets/Office/leftDoor.png",
        // "010010" : "./assets/Office/bothDoor.png",
        // "000010" : "./assets/Office/rightDoor.png",
        // "110000" : "./assets/Office/leftAll.png",
        // "110010" : "./assets/Office/leftAllrightDoor.png",
        // "010110" : "./assets/Office/rightAllleftDoor.png",
        // "000110" : "./assets/Office/rightAll.png",
        // "010100" : "./assets/Office/leftDoorrightLight.png",
        // "100010" : "./assets/Office/leftLightrightDoor.png",
        // "101000" : "./assets/Office/leftAnim.png",
        // "000101" : "./assets/Office/rightAnim.png",
        // "101010" : "./assets/Office/leftAnimrightDoor.png",
        // "010101" : "./assets/Office/rightAnimleftDoor.png",
        // "111000" : "./assets/Office/leftAllAnim.png",
        // "111010" : "./assets/Office/leftAllAnimrightDoor.png",
        // "010111" : "./assets/Office/rightAllAnimleftDoor.png",
        // "000111" : "./assets/Office/rightAllAnim.png",
        // }

        // Drive
        // this.states = {
        //     "000000": "https://drive.google.com/uc?export=download&id=1NGRe6opcPO41g0uTfFjWSs9MKqyn9Ccw",
        //     "100000": "https://drive.google.com/uc?export=download&id=1hizXwY8bZqeyJ584gnfgu5j2mFCUnCQR",
        //     "000100": "https://drive.google.com/uc?export=download&id=1Oz3CJQDKcDeSf-Lw3o3onocEbb8tpxiC",
        //     "010000": "https://drive.google.com/uc?export=download&id=1pKg_WZ1hUDBvktZTStWg7LR4qoCOqvC-",
        //     "010010": "https://drive.google.com/uc?export=download&id=116kSSdWon0bumUsFpHdQQze5fCpfGLR_",
        //     "000010": "https://drive.google.com/uc?export=download&id=1vihR2okfcRc-d-k1DEpqYmN6wdSa6Sci",
        //     "110000": "https://drive.google.com/uc?export=download&id=1lxp7yzAcl8s2ISwyUItx1S9S-zECO12v",
        //     "110010": "https://drive.google.com/uc?export=download&id=1x2l98h8H2Z_kMg86XFe8CoqxlQ117a5m",
        //     "010110": "https://drive.google.com/uc?export=download&id=1NjpCVpeQ_urdJHvOUAMVWKjSHKoMTkKQ",
        //     "000110": "https://drive.google.com/uc?export=download&id=1ew6oPySrbocQ8jWEuA1V0RnRTcAR1e_4",
        //     "010100": "https://drive.google.com/uc?export=download&id=1puvnoQYKuqpAdD2XCckKK_jGzjwZjzEf",
        //     "100010": "https://drive.google.com/uc?export=download&id=12Wzz_Dzw603WNCZoaHAX18RU32EMR9hA",
        //     "101000": "https://drive.google.com/uc?export=download&id=136_Fg-Q1IXrIYRK6iE3NT9vedGwAtGhA",
        //     "000101": "https://drive.google.com/uc?export=download&id=1Quwi4octuI-6jH09xE2lsfph-FEuXdqg",
        //     "101010": "https://drive.google.com/uc?export=download&id=1L_YSXul1cbSlxLF83FdkLtyRESLmCqtP",
        //     "010101": "https://drive.google.com/uc?export=download&id=1IUcoCCKlS1JajroXV1uUaBqrywOiYVJD",
        //     "111000": "https://drive.google.com/uc?export=download&id=1ZAVIei1qPLPl_K6bzX0ai-KKVKkV7eYL",
        //     "111010": "https://drive.google.com/uc?export=download&id=1UQ2VMXgO1tZEYEyLk8cMcr4bRr6QeUhf",
        //     "010111": "https://drive.google.com/uc?export=download&id=1IUcoCCKlS1JajroXV1uUaBqrywOiYVJD",
        //     "000111": "https://drive.google.com/uc?export=download&id=1zL8R-HWNssFB63qtNCOM_RKR5s_IsKg3",
        // }

        // Discord  
        this.states = {
            "000000" : "https://media.discordapp.net/attachments/720701609855680552/931208744967241728/default.png",
            "100000" : "https://media.discordapp.net/attachments/720701609855680552/931209379867398234/leftLight.png",
            "000100" : "https://media.discordapp.net/attachments/720701609855680552/931209452546293800/rightLight.png?width=1440&height=648",
            "010000" : "https://media.discordapp.net/attachments/720701609855680552/931209547849273394/leftDoor.png?width=1440&height=648",
            "010010" : "https://media.discordapp.net/attachments/720701609855680552/931209607425196032/bothDoor.png?width=1440&height=648",
            "000010" : "https://media.discordapp.net/attachments/720701609855680552/931209685544095796/rightDoor.png?width=1440&height=648",
            "110000" : "https://media.discordapp.net/attachments/720701609855680552/931209741252837416/leftAll.png?width=1440&height=648",
            "110010" : "https://media.discordapp.net/attachments/720701609855680552/931209794591789156/leftAllrightDoor.png?width=1440&height=648",
            "010110" : "https://media.discordapp.net/attachments/720701609855680552/931209854549385246/rightAllleftDoor.png?width=1440&height=648",
            "000110" : "https://media.discordapp.net/attachments/720701609855680552/931209915681361930/rightAll.png?width=1440&height=648",
            "010100" : "https://media.discordapp.net/attachments/720701609855680552/931209979489296414/leftDoorrightLight.png?width=1440&height=648",
            "100010" : "https://media.discordapp.net/attachments/720701609855680552/931210047688704010/leftLightrightDoor.png?width=1440&height=648",
            "101000" : "https://media.discordapp.net/attachments/720701609855680552/931210093524058112/leftAnim.png?width=1440&height=648",
            "000101" : "https://media.discordapp.net/attachments/720701609855680552/931210135920066650/rightAnim.png?width=1440&height=648",
            "101010" : "https://media.discordapp.net/attachments/720701609855680552/931210201397342288/leftAnimrightDoor.png?width=1440&height=648",
            "010101" : "https://media.discordapp.net/attachments/720701609855680552/931210253633204274/rightAnimleftDoor.png?width=1440&height=648",
            "111000" : "https://media.discordapp.net/attachments/720701609855680552/931210313032929340/leftAllAnim.png?width=1440&height=648",
            "111010" : "https://media.discordapp.net/attachments/720701609855680552/931210357836484628/leftAllAnimrightDoor.png?width=1440&height=648",
            "010111" : "https://media.discordapp.net/attachments/720701609855680552/931210421950644234/rightAllAnimleftDoor.png?width=1440&height=648",
            "000111" : "https://media.discordapp.net/attachments/720701609855680552/931210469862174810/rightAllAnim.png?width=1440&height=648",
        }

        this.yellowBearStates = {
            "00": "https://media.discordapp.net/attachments/720701609855680552/934216733705773066/golden.png?width=1440&height=648",
            "01": "https://media.discordapp.net/attachments/720701609855680552/934216710104444928/goldenRight.png?width=1440&height=648",
            "10": "https://media.discordapp.net/attachments/720701609855680552/934216709794070528/goldenLeft.png?width=1440&height=648",
            "11": "https://media.discordapp.net/attachments/720701609855680552/934216709416558602/goldenBoth.png?width=1440&height=648"
        }

    }


    getPicture() {
        let key = [0, 0, 0, 0, 0, 0];
        if(this.yellowBear){
            key = [0,0];
            key[0] = this.leftDoor.isClosed ? "1" : "0";
            key[1] = this.rightDoor.isClosed ? "1" : "0";
            return this.yellowBearStates[key.join("")];
        }
        if (!this.leftDoor.isLocked) {
            key[0] = this.leftDoor.isOn ? "1" : "0";
            key[1] = this.leftDoor.isClosed ? "1" : "0";
            key[2] = this.leftDoor.occupied && this.leftDoor.isOn ? "1" : "0";
        }
        if (!this.rightDoor.isLocked) {
            key[3] = this.rightDoor.isOn ? "1" : "0";
            key[4] = this.rightDoor.isClosed ? "1" : "0";
            key[5] = this.rightDoor.occupied && this.rightDoor.isOn ? "1" : "0";
        }
        key = key.join("");

        if (this.states.hasOwnProperty(key)) return this.states[key];
        else return this.states["000000"];
    }
}

module.exports = {
    Office
}