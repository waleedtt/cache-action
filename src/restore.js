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

async function run(){
    try {
        
        keySantized = utils.keySantized(key);
        pathArr = path.split('\n').map(el => el.trim());
        pathAbsolute = pathArr.map(el => utils.pathResolve(el));
        hashName = keySantized + '-' + utils.createHash(pathAbsolute.join(':')) + '.tar.gz';
        gcsPath = repositoryName + '/' + branchName + '/';
        gcsFile = gcsPath + hashName;
        tmpTarLocation = '/tmp/' + hashName;

        console.log(Buffer.from(sa).toString('base64'));

        heckKeyExists = await storage.listFilesByPrefix(gcsFile)
        // if (checkKeyExists.length == 0) {
        //     console.log(`::set-output name=cache-hit::0`);
        // } else {
        //     console.log(`::set-output name=cache-hit::1`);

        //     // const path = require('path');
        //     // const cwd = path.join(__dirname, '..');
        //     // destFile = path.join(cwd, key + '.tar.gz')

        //     await storage.downloadFile(gcsFile, tmpTarLocation);
        //     unTarCommand = "tar --absolute-names -C " + workspace + " -xzf "+ tmpTarLocation;
        //     //console.log(unTarCommand)
        //     utils.runCommand(unTarCommand);
        //     utils.runCommand("rm " + tmpTarLocation)
        // }


    } catch (error) {
        console.log(error)
        //core.setFailed(error.message);
    }
}

run();
