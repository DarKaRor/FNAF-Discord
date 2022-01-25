const { Client, Intents, MessageReaction, RichPresenceAssets, DataResolver } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
require('dotenv').config();

// Classes
const { Camera, Scene, Picture } = require('./classes/Camera');
const { Animatronic, Freddy, Foxy } = require('./classes/Animatronic');
const { Door } = require('./classes/Door');
const { Office } = require('./classes/Office');
const { Clock } = require('./classes/Clock');
const { CameraSystem } = require('./classes/CameraSystem');
const { PowerSystem } = require('./classes/PowerSystem');

// Functions
const utils = require('./utils/utils');
const { clamp } = require('./utils/utils');

// Data
let cameraData = require('./data/cameras.json');
let animatronicData = require('./data/animatronics.json');
let emojiData = require('./data/emojis.json');
let nights = require('./data/nights.json');
let images = require('./data/images.json');


let animatronics = [];
isWatching = false;
let deleteTime = 2000;
// 1 hour passes in the game each 1 minute and 30 seconds
let clock = new Clock();
let FPS = 30;
let levels = [1, 1, 0, 0];
let night = 1;
let call = null;
let callTime = 0;
let callMsg = null;
let startImg = false;
let extraMsgs = [];

let Home = new Office(new Door(), new Door());
let Power = new PowerSystem();

// Emojis by Id and name
let emoIds = utils.objectMap(emojiData, e => e.id);
let emoNames = utils.objectMap(emojiData, e => e.name);


// Use settings of specific night
const getNight = (n) => {
    call = null;
    callTime = 0;
    callMsg = null;
    let data = null;
    data = nights["Night " + n];
    if (!data && n > 0) {
        getNight(n - 1);
        return;
    }
    if (data.levels && night != 7) levels = data.random ? data.levels[utils.getRandomElement(data.levels)] : data.levels;
    if (data.sound) call = data.sound;
    while (!data.drain && n > 0) {
        n--;
        let currentData = nights["Night " + n];
        if (currentData) data.drain = currentData.drain;
    }
    if (data.drain) Power.extraUsage = data.drain;
    if (data.time) callTime = (data.time + 10) * 1000;
}

// Getting the camera data into camera objects

const getCameras = (cameraData) => {
    let cameras = [];
    for (let cam in cameraData) {
        let data = cameraData[cam];
        let src = "./assets/Cameras/" + cam + "/";
        src = "";
        let scenes = [];
        for (const [s, p] of Object.entries(data.pictures)) {
            let scene = s;
            let picture = p;
            if (!Array.isArray(picture)) picture = [picture];
            let pictures = [];
            for (const [key, value] of Object.entries(picture)) {
                let rarity = value.rarity ? value.rarity : 100;
                let name = value.name ? value.name : value;
                pictures.push(new Picture(name, rarity));
            }
            scenes["i" + scene.toString()] = new Scene(pictures);
        }

        cameras.push(new Camera(cam, data.name, scenes, src, data.followUps, data.defaultState.split("").map(e => parseInt(e))));
    }
    return cameras;
}

getNight(night);

const setLevels = () => animatronics.forEach(a => a.level = levels[a.id]);

const getAnim = (name, cameras, time, sensitive, id, camera, spawn, screamer, level, type = 1) => {
    switch (type) {
        case 1: return new Animatronic(name, cameras, time, sensitive, id, camera, spawn, screamer, level);
        case 2: return new Freddy(name, cameras, time, sensitive, id, camera, spawn, screamer, level);
        case 3: return new Foxy(name, cameras, time, sensitive, id, camera, spawn, screamer, level);
    }
}

// Getting animatronic data into classes
for (let animatronic in animatronicData) {
    let data = animatronicData[animatronic];
    let id = parseInt(animatronic);
    let time = parseFloat(data.time);
    data.cameras.push("Office");
    let type = parseInt(data.type);
    let a = getAnim(data.name, data.cameras, time, data.isSensitve, id, data.default, data.spawn, data.screamer, levels[id], type);
    animatronics.push(a);
}

animatronics[0].door = Home.leftDoor;
animatronics[1].door = Home.rightDoor;
animatronics[2].door = Home.rightDoor;
animatronics[3].door = Home.leftDoor;

let cameraSystem = new CameraSystem(getCameras(cameraData));

const getEmojiName = (name, id) => "<:" + name + ":" + id + ">";

// Using custom emojis for the Usage
if (emoNames.yellow && emoNames.green && emoNames.red) {
    let green = getEmojiName(emoNames.green, emoIds.green);
    let red = getEmojiName(emoNames.red, emoIds.red);
    let yellow = getEmojiName(emoNames.yellow, emoIds.yellow);
    let lime = emoNames.lime ? getEmojiName(emoNames.lime, emoIds.lime) : green;
    Power.fullUsage = [green, lime, yellow, red];
}


// Initialize Discord client
client.login(process.env.TOKEN);
let dumpster = undefined;

client.once('ready', () => {
    console.log('Starting...');
    dumpster = client.channels.cache.get(process.env.DUMPSTER);
})

let prefix = ".";
let commands = [];
games = [];
let game = null;
let gameMsg = null;
let _1987 = false;

// Check if the message starts with the prefix
const checkPrefix = (message) => message.content.startsWith(prefix);

gameStarted = false;

checkMsg = () => game && gameMsg;
checkGame = () => checkMsg() && gameStarted && !gameOver;
canUseCamera = () => checkGame() && !powerOut && isWatching;


const checkCamera = () => {
    if (!canUseCamera()) return;
    let camera = cameraSystem.camera;
    let picture = cameraSystem.getPicture();
    gameMsg.edit(getMessage());
    dontRun = true;
    game.edit(picture).then(() => dontRun = false);
    if (camera.name == "2A" && camera.checkActive("0001") && !checked2A) {
        foxyCounter = foxyCounter > 5 ? 5 : foxyCounter;
        checked2A = true;
    }
    if (camera.name == "2B" && !Home.yellowBear) Home.yellowBear = (picture == camera.yellowBear);
}


let currentImg = 1;
menuImages = images.menu;

const FlickerMenu = (msg) => {
    if (gameStarted || _1987 || !checkMsg()) return;
    let random = utils.getRandomFloat(0.2, 0.3);
    let randomImg = utils.getRandomInt(0, menuImages.length - 1);
    if (randomImg == currentImg) randomImg++;
    if (randomImg > menuImages.length) randomImg = 0;
    currentImg = randomImg;
    let time = random;
    if (randomImg == 0) time = 3500;
    msg.edit(menuImages[randomImg]).catch(e => console.log(e)).then(msg => {
        setTimeout(FlickerMenu, time, msg);
    })
}



commands = {
    "night": function (message, args) {
        let newNight = args[0];
        if (isNaN(newNight)) {
            sendMessageDelete(message, "Night must be a number");
            return;
        }
        night = clamp(newNight, 1, 6);
        getNight(night);
        setLevels();
        commands['play'](message, args);
    },
    "custom": function (message, args) {
        if (checkGame() || !checkMsg()) return;
        night = 7;
        getNight(night);
        levels = args[0].split(",").map(x => clamp(parseInt(x), 0, 20));
        if (levels.some(x => isNaN(x) || levels.length < 3 || levels.length > 4)) {
            sendMessageDelete(message, "Invalid levels");
            return;
        }
        if (levels.join("").replace("0", "") == "1987") {
            gameStarted = false;

        }
        setLevels();
        sendMessageDelete(message, "Custom levels set to " + levels.join(", "));

        if (!_1987) commands['play'](message, args);
    },
    "level": function (message, args) {
        if (checkGame() && !powerOut) {
            if (args[0] == "all") {
                for (let i = 0; i < animatronics.length; i++) {
                    animatronics[i].level = args[1];
                }
                sendMessageDelete(message, "All animatronics have been set to level " + args[1]);
            }
            let index = parseInt(args[0]);
            let level = parseInt(args[1]);
            index = utils.clamp(index, 0, animatronics.length - 1);
            level = utils.clamp(level, 0, 20);
            if (!isNaN(index) && !isNaN(level)) {
                animatronics[index].level = level;
                sendMessageDelete(message, "Animatronic " + animatronics[index].name + " level is now " + level);
            }
            else {
                if (isNaN(index)) sendMessageDelete(message, "Invalid animatronic index");
                if (isNaN(level)) sendMessageDelete(message, "Invalid level");
            }
        }
    },
    "ping": function (message, args) {
        sendMessageDelete(message, "Pong!", null);
    },
    "start": function (message, args) {
        if (checkMsg()) return;
        message.channel.send("Game started, use " + prefix + "play to play!\nUse " + prefix + "night [number] to play a specific night!\nUse " + prefix + "custom [level],[level],[level],[level] to play a custom night!").then(msg => {
            gameMsg = msg;
            message.channel.send(menuImages[0]).then(async msg => {
                game = msg;
                FlickerMenu(msg);
            });
        });
    },
    "play": async function (message, args) {
        if (checkGame() || !checkMsg()) return;
        if (night == 1 && !startImg) {
            startImg = true;
            await sendImageSetGame("./assets/help_wanted.png").then(msg => {
                setTimeout(() => {
                    commands['play'](message, args);
                }, 1000);
            });
        }

        gameStarted = true;
        gameMsg.edit(getMessage());
        //sendImageSetGame(office)
        game.edit(Home.getPicture()).then(async () => {
            let reactions = [emoIds.leftDoor, emoIds.leftLight, "⬅", emoIds.camera, "➡", emoIds.rightLight, emoIds.rightDoor];

            for (const r of reactions) await game.react(r);

            if (call) gameMsg.channel.send({ files: ["./assets/Sound/" + call] }).then(msg => {
                callMsg = msg;
                setTimeout(() => {
                    callMsg.delete();
                    callMsg = null;
                }, callTime);
            });

            const filter = (reaction, user) => user.id != client.user.id && (reactions.includes(reaction.emoji.name) || reactions.includes(reaction.emoji.id));


            const collector = game.createReactionCollector({
                filter,
            })

            collector.on('collect', (reaction, user) => {
                if (!checkMsg()) return;
                let emoji = reaction.emoji.name;
                let leftLocked = false;
                let rightLocked = false;

                const doorAction = (door, action) => {
                    if (isWatching) return;
                    if (checkLocked(door)) {
                        if (door == Home.leftDoor) leftLocked = true;
                        else rightLocked = true;
                        return;
                    }
                    action(door);
                }

                switch (emoji) {
                    case emoNames.leftDoor:
                        doorAction(Home.leftDoor, closeDoor);
                        break;
                    case emoNames.leftLight:
                        doorAction(Home.leftDoor, activeDoor);
                        break;
                    case emoNames.camera:
                        if (powerOut) break;
                        commands["camera"](message, "");
                        break;
                    case "⬅":
                        if (powerOut) break;
                        commands['prev'](message, "");
                        break;
                    case "➡":
                        if (powerOut) break;
                        commands['next'](message, "");
                        break;
                    case emoNames.rightLight:
                        doorAction(Home.rightDoor, activeDoor);
                        break;
                    case emoNames.rightDoor:
                        doorAction(Home.rightDoor, closeDoor);
                        break;
                    default:
                        break;
                }
                // remove the reaction collected
                let lockedMsg = "\n** * clack, clack * **";
                let icon = leftLocked ? "bonnie" : "chica";
                if (leftLocked || rightLocked) addGameMsg(lockedMsg + " " + getEmojiName(emoNames[icon], emoIds[icon]));
                reaction.users.remove(user);
            })

            collector.on('end', (collected) => {
                // Show count of each single reaction
                console.log(`Collected ${collected.size} items`);
            })

            gameLoop();
        });
    },
    "camera": function (message, args) {
        if (!checkGame() || powerOut) return;
        Home.leftDoor.isOn = false;
        Home.rightDoor.isOn = false;
        checkUsage();
        isWatching = !isWatching;
        cameraSystem.updateRoom();
        if (!isWatching) {
            if (Home.inside.length > 0) animatronics.forEach(a => attemptKill(a, true));
            else {
                //sendImageSetGame(Home.getPicture());
                dontRun = true;
                game.edit(Home.getPicture()).then(() => dontRun = false);
                cameraSystem.room = "Office";
                updateUsage(-1);
                gameMsg.edit(getMessage());
            }
            return;
        }
        else {
            Home.yellowBear = false;
            yBCounter = yBKillTime;
            updateUsage(1);
        }
        checkCamera();
    },
    "next": function (message, args) {
        if (!checkGame() || !isWatching) return;
        cameraSystem.changeCamera(1);
        checkCamera();
    },
    "prev": function (message, args) {
        if (!checkGame() || !isWatching) return;
        cameraSystem.changeCamera(-1);
        checkCamera();
    },
    "select": function (message, args) {
        if (!checkGame() || !isWatching) return;
        let cameraName = args[0].toUpperCase();
        let newCamera = getCameraByName(cameraName);
        if (newCamera) camera = newCamera;
        else {
            sendMessageDelete(message, "Camera not found", null);
            return;
        }
        cameraSystem.setCamera(cameraSystem.cameras.indexOf(camera));
        checkCamera();
    },
    "cameras": function (message, args) {
        let msg = "";
        for (let cam of cameras) msg += cam.name + "\n";
        message.channel.send(msg);
    }
};

let timer = 0;
let powerOut = false;
let timeChance = 5;
let maxTime = 20;
let phase = 0;
let musicMsg = null;
let counter = 0;
let maxCounter = 0;
let gameOver = false;
let secondPassed = false;
let killTime = 20;
let foxyKillTime = 20;
let foxyCounter = foxyKillTime;
let foxyUsage = 1;
let checked2A = false;
let dontRun = false;
let yBKillTime = 5;
let yBCounter = yBKillTime;



FPS = 60;
const gameLoop = () => {
    //if (dontRun) console.log("dontRun");
    if (!dontRun) {
        let camera = cameraSystem.camera;
        let power = Power.power;
        timer++;
        let realTime = 1 / FPS;
        //console.log("Running");

        clock.hourCounter += realTime;

        if (Home.yellowBear && !isWatching) {
            yBCounter -= realTime;
            if (yBCounter <= 0) {
                yellowBearKill();
                return;
            }
        }

        animatronics.forEach(a => {
            a.counter += realTime;
            if (Home.inside.includes(a.id)) a.killTime -= realTime
            if (a.id == 3 && a.phase > 2) {
                foxyCounter -= realTime
                if (foxyCounter <= 0) {
                    if (!a.door.isClosed) EndGame(a.screamer);
                    else {
                        power -= foxyUsage;
                        foxyUsage += 5;
                        getCameraByName("2A").active = [0, 0, 0, 0];
                        let foxyPhase = utils.getRandomInt(0, 1);
                        getCameraByName("1C").phase = foxyPhase;
                        a.phase = foxyPhase;
                        if (watchingCamera("2A")) checkCamera();
                        gameMsg.edit(getMessage());
                        foxyCounter = foxyKillTime;
                        checked2A = false;
                    }
                }
            }
        });

        if (timer == FPS) {
            timer = 0;
            secondPassed = true;

            if (clock.checkPassed()) {
                clock.advanceHour();
                gameMsg.edit(getMessage());
                checkHour();
            }
        }

        if (!powerOut) {
            Power.updatePower(FPS, clock.gameHour);
            checkPower();

            if (Home.inside.length > 0) {
                if (!isWatching) {
                    animatronics.forEach(a => {
                        if (Home.inside.includes(a.id)) a.killTime = killTime;
                    })
                }
                else {
                    animatronics.forEach(a => {
                        attemptKill(a);
                    })
                }
            }

            animatronics.forEach(a => {
                let lockedAnim = a.isSensitve && isWatching
                if (a.id == 2 && a.camera == "4B" && camera.name != "4B") lockedAnim = false;
                if (lockedAnim) a.counter = 0;

                if (a.counter >= a.time && a.level != 0) {
                    //console.log("Counter reached " + a.name);
                    a.counter = 0;

                    if (a.shouldMove(isWatching, camera)) {
                        //console.log("Successful move from:" + a.name);
                        if (!a.atDoor) {
                            // Movement management
                            switch (a.id) {
                                case 0:
                                case 1:
                                    let enter = false;
                                    let oldCamera = getCameraByName(a.camera);
                                    let filteredCameras = oldCamera.followUps.filter(c => a.cameras.includes(c));
                                    let randomCamera = filteredCameras[utils.getRandomInt(0, filteredCameras.length - 1)];
                                    if (randomCamera == "Office") enter = true;
                                    let moveCamera = enter ? undefined : getCameraByName(randomCamera);
                                    if (moveCamera) {
                                        if (['2A', '2B', '4A', '4B'].includes(moveCamera.name)) addGameMsg("* footsteps *", true);
                                        if (!(moveCamera.name == "2A" && moveCamera.active.join("") == "0001")) moveAnimatronic(a, moveCamera);
                                    }
                                    if (enter) enterOffice(a);
                                    break;
                                case 2:
                                    let move = true;
                                    if (a.camera == "1A") {
                                        let cam1A = getCameraByName("1A");
                                        move = cam1A.active.join("") == "0010";
                                        // console.log(move, cam1A.active.join(""));
                                    }
                                    if (move) moveAnimatronic(a, getCameraByName(a.order[a.order.findIndex(o => o == a.camera) + 1]));
                                    if (move) freddyLaugh();
                                    break;
                                case 3:
                                    // console.log("Foxy is moving");
                                    a.phase++;
                                    let cam1C = getCameraByName("1C");
                                    cam1C.phase++;
                                    if (a.phase > 2) {
                                        let cam2A = getCameraByName("2A");
                                        if (cam2A.active.join("") == "0000") moveAnimatronic(a, cam2A);
                                    }
                                    break;
                            }
                        }
                        else {
                            if (!a.inside) {
                                if (a.id == 2) {
                                    let cam4B = cameras.find(camera => camera.name == "4B");
                                    cam4B.active[a.id] = 0;
                                    freddyLaugh();
                                }
                                if (!a.door.isClosed) {
                                    //console.log("Door is open and now is locked");
                                    if (a.id != 2) a.door.isLocked = true;
                                    checkAndPush(Home.inside, a.id);
                                    a.inside = true;
                                    if (a.door.isOn) activeDoor(a.door);
                                }
                                else {
                                    //console.log(a.name + "left the room");
                                    a.door.occupied = false;
                                    a.atDoor = false;
                                    let spawnCamera = getCameraByName(a.spawn);
                                    if (spawnCamera) {
                                        spawnCamera.active[a.id] = 1;
                                        a.camera = spawnCamera.name;
                                        if (spawnCamera.name == camera.name && isWatching) checkCamera();
                                        //if(a.id == 2) sendMessageDelete(game,"Kill yourself",null); Some stupid meme
                                    }
                                    if (a.door.isOn && !isWatching) updateOffice();
                                    addGameMsg("* footsteps *", true);
                                }
                            }
                        }
                    }
                }
            });
        }

        else {
            if (secondPassed) { counter++; maxCounter++; }
            checkCounters();
        }

        secondPassed = false;
    }
    if (!gameOver) setTimeout(gameLoop, 1000 / FPS);
}

client.on('messageCreate', message => {
    // Check if the message starts with the prefix
    // check message is not from bot
    if (message.author.bot) return;

    if (checkPrefix(message)) {
        // Get the command
        let command = message.content.split(' ')[0].substring(1);
        // Get the arguments
        let args = message.content.split(' ').slice(1);
        // Check if the command is a valid command
        if (command in commands) commands[command](message, args);
        else {
            if (isWatching) commands["select"](message, [command]);
        }

        message.delete().catch(err => console.log(err));
    }
});

async function sendMessage(message, content, files, delay = false, time) {

    if (!content) {
        message.channel.send({ files: files }).then(msg => {
            if (delay) setTimeout(() => msg.delete(), time);
            return msg;
        });
    }

    else {
        message.channel.send(content, files).then(msg => {
            if (delay) setTimeout(() => msg.delete(), time);
            return msg;
        });
    }
}

const sendMessageDelete = (message, content, files) => { sendMessage(message, content, files, true, deleteTime); }

const addGameMsg = async (msg, repeats = false, time = 1000) => {
    if (extraMsgs.includes(msg) && !repeats) return;
    extraMsgs.push(msg);

    await gameMsg.edit(getMessage())
        .catch(err => console.log(err))
        .then(msg => {
            setTimeout(() => {
                extraMsgs.splice(extraMsgs.indexOf(msg), 1);
                gameMsg.edit(getMessage());
                updateMsg = null;
            }, time)
        });
}

sendImageGetLink = async (picture) => {
    let url = '';
    // Send the picture to the dumpster, and get the link
    await dumpster.send({ files: [{ attachment: picture }] }).then(msg => {
        url = msg.attachments.first().url;
        msg.delete();
    });
    return url;
}

const sendImageSetGame = async (picture) => {
    if (gameOver && clock.getCurrentHour() == 6) return;
    await sendImageGetLink(picture).then(async (link) => { await game.edit(link); });
}

const getMessage = () => {
    let { room, camera } = cameraSystem;
    let { power } = Power;
    return room + (isWatching ? " [ " + camera.name + " ]" : "") + " - Power: " + Math.round(power) + "% - " + clock.getCurrentHour() + "AM" + "\n" + "Usage: " + getUsage() + "\n" + extraMsgs.join("\n");
}

const { updateUsage, getUsage } = Power;

const resetVariables = () => {
    gameOver = false;
    isWatching = false;
    powerOut = false;
    phase = 0;
    timer = 0;
    counter = 0;
    maxCounter = 0;
    clock.reset();
    cameraSystem.reset();
    Power.reset();
    musicMsg = null;
    gameStarted = false;
    gameMsg = null;
    game = null;
}

const EndGame = (screamer) => {
    gameOver = true;
    game.edit(screamer).then(() => {
        if (musicMsg) deleteMessage(musicMsg);
        if (callMsg) deleteMessage(callMsg);
        setTimeout(() => {
            sendImageSetGame('assets/Jumpscares/game_over.png').then(() => {
                gameMsg.edit("Game Over");
                game.reactions.removeAll();
                resetVariables();
            });

        }, 2000);
    });
}

const deleteMessage = (message) => {
    if (!message) return;
    message.delete().catch(e => {
        console.log(e);
    });
}

const checkPhase = () => {
    console.log("Phase: " + phase);
    switch (phase) {
        case 1:
            sendImageSetGame('./assets/Office/dark_freddy.png');
            game.channel.send({ files: ['assets/Sound/music_box.mp3'] }).then(msg => {
                musicMsg = msg;
            });
            break;
        case 2:
            timeChance = 2;
            sendImageSetGame('./assets/Office/completely_dark.png');
            musicMsg.delete().catch(e => {
                console.log(e);
            });
            break;
        case 3:
            //console.log("Game Over");
            EndGame("https://pa1.narvii.com/6659/cef34d5447541802784b933e11efe27aade55bba_hq.gif");
            break;
    }
}

const checkCounters = () => {
    if (counter >= timeChance) {
        // 20% chance
        counter = 0;
        timer = 0;
        if (utils.getRandomInt(0, 100) < 20) {
            phase++;
            maxCounter = 0;
            checkPhase();
        }
        else {
            if (phase != 1) {
                gameMsg.edit("* step *").then(msg => {
                    setTimeout(() => {
                        gameMsg.edit("** **");
                    }, 500);
                })
            }
        };
    }

    else if (maxCounter >= maxTime && phase < 2) {
        //console.log("Overtime");
        phase++;
        checkPhase();
        timer = 0;
        counter = 0;
        maxCounter = 0;
    }
}

const checkHour = () => {
    let hour = clock.getCurrentHour();
    if (hour != 6) gameMsg.edit(getMessage());
    switch (hour) {
        case 2:
            animatronics[0].level++;
            //console.log("Bonnie level has increased");
            break;
        case 4:
        case 3:
            [animatronics[0], animatronics[1], animatronics[3]].forEach(a => { a.level++; });
            //console.log("Animatronics levels have increased");
            break;
        case 6:
            gameOver = true;
            gameMsg.edit("Shift Completed!");
            game.edit("https://cdn.discordapp.com/attachments/891769405728505886/929463759808917604/6_am.gif").then(msg => {
                setTimeout(() => {
                    game.delete().catch(e => console.log(e));
                }, 10000);
            });
            if (musicMsg) musicMsg.delete();
            break;
    }
}

const cutPower = () => {
    sendImageSetGame('./assets/Office/dark.png');
    powerOut = true;
    gameMsg.edit("** **");
    timer = 0;
    game.reactions.removeAll();
    return;
}

const checkPower = () => {
    let power = Power.power;
    if (power <= 0) cutPower();
}

const closeDoor = (door) => {
    if (isWatching) return false;
    let open = door.open();
    if (open) updateOffice();
}

const activeDoor = (door) => {
    if (isWatching) return false;
    door.active();
    if (door.isOn) {
        if (door == Home.leftDoor && Home.rightDoor.isOn) Home.rightDoor.active();
        if (door == Home.rightDoor && Home.leftDoor.isOn) Home.leftDoor.active();
    }
    updateOffice();
    return true;
}

const moveAnimatronic = (a, cam) => {
    if (!a.cameras.find(c => c == cam.name)) return false;
    oldCamera = getCameraByName(a.camera);
    if (!oldCamera) return false;
    oldCamera.active[a.id] = 0;
    cam.active[a.id] = 1;
    a.camera = cam.name;
    let key = [0, 0, 0, 0];
    if (cam.active != key) {
        key[a.id] = 1;
        cam.setPicture(key.join(""));
    }
    //console.log(a.name + " of id" + a.id + " moved from " + a.camera + " to " + cam.name);
    if (watchingCamera(cam) || watchingCamera(oldCamera)) checkCamera();
    return true;
}

const enterOffice = (a) => {
    //console.log("Entering " + a.name);
    oldCamera = getCameraByName(a.camera);
    if (!oldCamera) return false;
    oldCamera.active[a.id] = 0;
    a.door.occupied = true;
    a.atDoor = true;
    if (watchingCamera(oldCamera)) checkCamera();
    if (a.door.isOn) updateOffice();
    return true;
}

const getCameraByName = (name) => cameraSystem.getCameraByName(name);

const watchingCamera = (cam) => isWatching && cam.name == cameraSystem.camera.name;

const checkAndPush = (arr, val) => {
    if (arr.indexOf(val) == -1) {
        arr.push(val);
        return true;
    }
    return false;
}

const checkUsage = () => {
    let usage = 1;
    if (Home.leftDoor.isOn || Home.rightDoor.isOn) usage++;
    if (isWatching) usage++;
    if (Home.leftDoor.isClosed) usage++;
    if (Home.rightDoor.isClosed) usage++;
    Power.usage = usage;
}

const updateOffice = () => {
    if (gameOver) return;
    checkUsage();
    gameMsg.edit(getMessage());
    //sendImageSetGame(Home.getPicture());
    dontRun = true;
    game.edit(Home.getPicture()).then(() => dontRun = false);
}

const attemptKill = (a, immediate = false) => {
    if (!Home.inside.includes(a.id)) return false;
    if (!(a.killTime <= 0 || immediate)) return false;
    if (gameOver) return false;
    isWatching = false;
    EndGame(a.screamer);
    return true;
}

const checkLocked = (door) => door.isLocked;

const freddyLaugh = () => {
    let fMsgs = ["Ha, ha", "Hahahaha...", "Haha", "Ha, ha, ha..."];
    addGameMsg(utils.getRandomElement(fMsgs) + getEmojiName(emoNames.freddy, emoIds.freddy));
}

const yellowBearKill = async () => {
    if (!checkMsg()) return;
    _1987 = true;
    await game.edit("https://cdn.discordapp.com/attachments/720701609855680552/931382533264908378/golden_freddy.png").then(msg => {
        setTimeout(() => {

            msg.delete().catch(e => console.log(e));
            gameMsg.delete().catch(e => console.log(e));
            if (callMsg) callMsg.delete().catch(e => console.log(e));
            if (musicMsg) musicMsg.delete().catch(e => console.log(e));
            resetVariables();

            _1987 = false;
        }, 1000)
    });
}

