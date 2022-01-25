const utils = require('../utils/utils');

class CameraSystem{
    constructor(cameras){
        this.cameras = cameras;
        this.cameras.sort((a, b) => a.name.localeCompare(b.name));
        this.index = 0;
        this.camera = this.cameras[this.index];
        this.room = "Office";
    }

    changeCamera = (val) =>{
        let nextIndex = this.index + val;
        if(nextIndex>=this.cameras.length) this.index = (nextIndex - this.cameras.length - 2);
        else if(nextIndex<0) this.index = this.cameras.length - nextIndex - 1;
        else this.index = nextIndex;
        this.index = utils.clamp(this.index, 0, this.cameras.length - 1);
        this.setCamera(this.index);
    }

    getPicture = () => this.camera.getPicture();

    setCamera = (index) =>{
        this.index = index;
        this.camera = this.cameras[index];
        this.room = this.camera.room;
    }
    

    updateRoom = () => this.room = this.camera.room; 

    getCameraByName = (name) => this.cameras.find(camera => camera.name === name);

    sort = () => this.cameras.sort((a, b) => a.name.localeCompare(b.name));

    reset = () => {
        this.index = 0;
        this.setCamera(this.index);
        this.room = "Office";
    }

}

module.exports = {
    CameraSystem
}