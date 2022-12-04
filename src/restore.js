const core = require('@actions/core');
const github = require('@actions/github');
const storage = require('./storage');
const utils = require('./utils');

const bucketName = 'cache-tt';

const githubJSON = github.context.payload;
repositoryName = githubJSON.repository.name;
branchName = githubJSON.ref.replace('refs/heads/', '').replace('/', '_');
workspace = "/tmp/";

const path = core.getInput('path');
const key = core.getInput('key');
const restore_keys = core.getInput('restore-keys');
const sa = core.getInput('sa');
const saJSON = JSON.parse(sa)
storage.setStorage(saJSON);


async function executionUntar(file, tmpTarLocation, datetime){
    console.log(`::set-output name=cache-hit::1`);
    latestFile = file.name;
    await storage.downloadFile(latestFile, tmpTarLocation);
    unTarCommand = "tar --absolute-names -C " + workspace + " -xzf "+ tmpTarLocation;
    utils.runCommand(unTarCommand);
    utils.runCommand("rm " + tmpTarLocation);
    await storage.setMetadata(latestFile, {'last_used': datetime });
}

async function run(){
    try {
        keySantized = utils.keySantized(key);
        pathArr = path.split('\n').map(el => el.trim());
        pathAbsolute = pathArr.map(el => utils.pathResolve(el));
        hashName = keySantized + '-' + utils.createHash(pathAbsolute.join(':')) + '.tar.gz';
        gcsPath = repositoryName + '/' + branchName + '/';
        gcsKeyBySuffix = gcsPath + keySantized; // SET THE NAME
        gcsFile = gcsPath + hashName; // CHECK THIS ONE, I THINK NO USE
        tmpTarLocation = '/tmp/' + hashName;
        datetime = (new Date()).toISOString();


        checkKeyExists = await storage.checkKeyExists(gcsKeyBySuffix);
        if (checkKeyExists) {
            await executionUntar(checkKeyExists, tmpTarLocation, datetime);
            console.log("key called");
        } else {
            if (typeof restore_keys !== 'undefined' && restore_keys.trim()) {
                keyExits = false
                restoreKeys = restore_keys.split('\n').map(el => el.trim()).filter(n => n);

                for (const key of restoreKeys) { 
                    gcsRestoreKey = gcsPath + key;
                    checkKeyExists = await storage.checkKeyExists(gcsRestoreKey);
                    if (checkKeyExists) {
                        console.log("wroked", key);
                        await executionUntar(checkKeyExists, tmpTarLocation, datetime);
                        keyExits = true;
                        console.log("restore_keys called");
                        break;
                    } 
                } 

                if (!keyExits) {
                    console.log(`::set-output name=cache-hit::0`);
                }
            } else {
                console.log(`::set-output name=cache-hit::0`);
            }
        }

    } catch (error) {
        console.log(error)
    }
}

run();
