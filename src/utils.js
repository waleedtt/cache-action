const { exec } = require("child_process");
const { resolve, join } = require('path')
const crypto = require('crypto');
const fs = require('fs');

function runCommand(command){ // ,fn
    return new Promise(function(resolve, reject){
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return reject(stderr);
                //return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return reject(stderr);
                //return;
            }

            if (stdout){
                console.log(`stdout: ${stdout}`);
                return resolve(stdout);
                return;
            }
            //fn(stdout);
            return resolve("")
        });
    });
}

function keySantized(key){
    return key.replace(/[^0-9a-zA-Z-_]+/gm, '_');
}

function pathResolve(path){
    if (path[0] === '~') {
        return join(process.env.HOME, path.slice(1));
    }
    return resolve(path);
    //return resolve(path)
}

// REMOVE IT. NOT IN USE
function createHash(value){
    return crypto.createHash('md5').update(value).digest('hex');
}

function generateChecksum(str, algorithm, encoding) {
    return crypto
        .createHash(algorithm || 'md5')
        .update(str, 'utf8')
        .digest(encoding || 'hex');
}
// REMOVE IT. NOT IN USE

async function createFileChecksum(file){
    return new Promise(function(resolve, reject){
        fs.readFile(file, function(err, data) {
            checksum = generateChecksum(data);
            if (err) {
                return reject(err);
            }
            return resolve(checksum);
        });
    })
}

module.exports = {
    runCommand, keySantized, pathResolve, createHash, createFileChecksum
}