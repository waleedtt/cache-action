const { exec } = require("child_process");
const { resolve, join } = require('path')
const crypto = require('crypto');

function runCommand(command){ // ,fn
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }

        if (stdout){
            console.log(`stdout: ${stdout}`);
        }
        //fn(stdout);
    });
}

function keySantized(key){
    return key.replace(/[^0-9a-zA-Z-]+/gm, '_');
}


function pathResolve(path){
    if (path[0] === '~') {
        return join(process.env.HOME, path.slice(1));
    }
    return resolve(path);
    //return resolve(path)
}

function createHash(value){
    return crypto.createHash('md5').update(value).digest('hex');
}

module.exports = {
    runCommand, keySantized, pathResolve, createHash
}