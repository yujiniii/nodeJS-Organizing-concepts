const path = require('path');
const fs = require('fs');

const fliePath = path.join(__dirname,'..', 'data', "restaurants.json"); // ".." : 상위 디렉터리로 이동
console.log(fliePath);

function getStoredRestaurantFile(){    
    const fileData = fs.readFileSync(fliePath);
    const storedRestaurants = JSON.parse(fileData);

    return storedRestaurants;
}

function writeFile(storedRest){    
    fs.writeFileSync(fliePath,JSON.stringify(storedRest));
}

module.exports = {
    getStoredRestaurantFile:getStoredRestaurantFile,
    writeFile:writeFile,
};