// This function clamps a value between a min and max value
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function objectMap(object, mapFn) {
    return Object.keys(object).reduce(function (result, key) {
        result[key] = mapFn(object[key])
        return result
    }, {})
}

const getRandomElement = (array, min = 0, max = array.length - 1) => array[getRandomInt(min, max)];


module.exports = {
    clamp: clamp,
    getRandomInt: getRandomInt,
    getRandomFloat: getRandomFloat,
    objectMap: objectMap,
    getRandomElement: getRandomElement
};