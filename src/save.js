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
        datetime = (new Date()).toISOString();
        upload = 1;

        createTarCommand = "tar --absolute-names -C " + workspace + " -czf "+ tmpTarLocation + " " + pathAbsolute.join(" ");
        await utils.runCommand(createTarCommand); 
        fileChecksumCommand = "tar cf - " + pathAbsolute.join(" ") + " --absolute-names | sha1sum | awk '{print $1}'";
        fileChecksum = await utils.runCommand(fileChecksumCommand);

        checkKeyExists = await storage.listFilesByPrefix(gcsFile);
        if (checkKeyExists.length != 0) {
            if (checkKeyExists.length == 1) {
                [objectGcs] = checkKeyExists;
                checksumGet = objectGcs.metadata.metadata.checksum;
                if (fileChecksum == checksumGet) {
                    upload = 0;
                }
            } else {
                console.log("WORK ON THIS PART");
                console.log("SET THE TIME ZONE IF NEEDED");
            }
        }

        if (upload == 1) {
            await storage.uploadFile(tmpTarLocation, gcsFile, {"created_at": datetime, "last_used": datetime, "checksum": fileChecksum});
            console.log("upload called");
        } else {
            console.log("upload not called");
        }

        utils.runCommand("rm " + tmpTarLocation);

    } catch (error) {
        console.log(error);
    }
}

run();
