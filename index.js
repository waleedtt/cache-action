const core = require('@actions/core');
const github = require('@actions/github');


// REMOVE LATER
const githubJSON = JSON.parse(require('fs').readFileSync('load/github.json', 'utf8'));
//console.log(obj)
// REMOVE LATER

try {

  // const path = core.getInput('path');
  // const key = core.getInput('key');
  // const restore_keys = core.getInput('restore-keys');

  
  const path = process.env['INPUT_PATH'];
  const key = process.env['INPUT_KEY'];
  const restore_keys = process.env["INPUT_RESTORE_KEY"];

  //console.log(process.env);

  console.log(`path ${path}!`);
  console.log(`key ${key}!`);
  console.log(`restore-keys ${restore_keys}!`);
  
  // console.log(`::set-output name=cache-hit::1`);
  
  core.setOutput("cache-hit", 1);

  // Get the JSON webhook payload for the event that triggered the workflow
  //const payload = JSON.stringify(github.context.payload, undefined, 2)
  payload = JSON.stringify(githubJSON, undefined, 2)
  //console.log(`The event payload: ${payload}`);


  repoName = githubJSON.repository.name;
  console.log(repoName)


  // const { exec } = require("child_process");
  // exec("ls -la", (error, stdout, stderr) => {
  //   if (error) {
  //       console.log(`error: ${error.message}`);
  //       return;
  //   }
  //   if (stderr) {
  //       console.log(`stderr: ${stderr}`);
  //       return;
  //   }
  //   console.log(`stdout: ${stdout}`);
  // });


} catch (error) {
  core.setFailed(error.message);
}