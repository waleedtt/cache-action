const core = require('@actions/core');
const github = require('@actions/github');
const storage = require('./storage');
const utils = require('./utils');

const bucketName = 'cache-tt';

const githubJSON = github.context.payload;
repositoryName = githubJSON.repository.name;
branchName = githubJSON.ref.replace('refs/heads/', '').replace('/', '_');
workspace = "/tmp/"

const path = core.getInput('path');
const key = core.getInput('key');
const restore_keys = core.getInput('restore-keys');
const sa = core.getInput('sa');
storage.setStorage(sa);

async function run(){
    try {
        keySantized = utils.keySantized(key);
        pathArr = path.split('\n').map(el => el.trim());
        pathAbsolute = pathArr.map(el => utils.pathResolve(el));
        hashName = keySantized + '-' + utils.createHash(pathAbsolute.join(':')) + '.tar.gz';
        gcsPath = repositoryName + '/' + branchName + '/';
        gcsFile = gcsPath + hashName;
        tmpTarLocation = '/tmp/' + hashName;


        // , ()=>{}
        createTarCommand = "tar --absolute-names -C " + workspace + " -czf "+ tmpTarLocation + " " + pathAbsolute.join(" ");
        //console.log(createTarCommand)
        utils.runCommand(createTarCommand);
        await storage.uploadFile(tmpTarLocation, gcsFile);
        utils.runCommand("rm " + tmpTarLocation);

    } catch (error) {
        console.log(error);
        //core.setFailed(error.message);
    }
}

run();
