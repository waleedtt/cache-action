const Storage = require('@google-cloud/storage');

const bucketName = 'cache-tt';

let storage;
function setStorage(creds) { 
    storage = new Storage.Storage();
}

// NOT IN USE REMOVE IT LATER
function listFilesTree() {
    async function listFiles() {
        const [files] = await storage.bucket(bucketName).getFiles();
        console.log('Files:');
        files.forEach(file => {
            console.log(file.name);
        });
    }

    listFiles().catch(console.error);
}
// NOT IN USE REMOVE IT LATER

const listFilesByPrefix = async(prefix, delimiter = '/') => {
    const options = {
        prefix: prefix,
        delimiter: delimiter
    };
    bucket = storage.bucket(bucketName)
    const [files] = await bucket.getFiles(options);
    // files.forEach(file => {
    //     console.log(file.name);
    // });
    //console.log(typeof files)
    return files
    //listFilesByPrefix().catch(console.error);
}

// MOVE TO UTILS
const checkKeyExists = async(key) => {
    keyReturn = await listFilesByPrefix(key);
    //console.log('keyReturn',keyReturn);
    if (keyReturn.length == 0) {
        return false;
    } else { 
        keysList = [];
        keyReturn.forEach(file => {
            let obj = file.metadata.metadata;
            obj['name'] = file.name;
            keysList.push(obj);
        });
        latestDate = keysList.map(function(e) { return new Date(e.created_at); }).sort().reverse()[0];
        latestOjb = keysList.filter( e => { 
            let d = new Date( e.created_at ); 
            return d.getTime() == latestDate.getTime();
        })[0];
        //console.log('latestOjb',latestOjb);
        return latestOjb;
    }
}

const downloadFile = async(fileName, destFileName) => {
  
    const options = {
      destination: destFileName,
    };

    // Downloads the file
    await storage.bucket(bucketName).file(fileName).download(options);
    // console.log(
    //   `gs://${bucketName}/${fileName} downloaded to ${destFileName}.`
    // );
}

const uploadFile = async(filePath, destFileName, customMetadata = {}, generationMatchPrecondition = 0) => {

      const options = {
        destination: destFileName,
        metadata: {
            metadata: customMetadata,
        }
        // Optional:
        // Set a generation-match precondition to avoid potential race conditions
        // and data corruptions. The request to upload is aborted if the object's
        // generation number does not match your precondition. For a destination
        // object that does not yet exist, set the ifGenerationMatch precondition to 0
        // If the destination object already exists in your bucket, set instead a
        // generation-match precondition using its generation number.
        // preconditionOpts: {ifGenerationMatch: generationMatchPrecondition}, // Check details later
      };
  
      await storage.bucket(bucketName).upload(filePath, options);
      //console.log(`${filePath} uploaded to ${bucketName}`);
}

const setMetadata = async(fileName ,metadata, generationMatchPrecondition = 0)=> {
    const options = {
        //ifGenerationMatch: generationMatchPrecondition,
    };
    const [metadataResponse] = await storage.bucket(bucketName).file(fileName).setMetadata({
        metadata: metadata,
    },options);
    return metadataResponse;
}

module.exports = {
    setStorage, listFilesTree, listFilesByPrefix, downloadFile, uploadFile, checkKeyExists, setMetadata
};