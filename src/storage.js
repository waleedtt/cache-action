const Storage = require('@google-cloud/storage');

const bucketName = 'cache-tt';
let storage;

function setStorage(creds) { 
    storage = new Storage.Storage({credentials: creds});
}

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

const uploadFile = async(filePath, destFileName, generationMatchPrecondition = 0) => {

      const options = {
        destination: destFileName,
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

module.exports = {
    setStorage, listFilesTree, listFilesByPrefix, downloadFile, uploadFile
};