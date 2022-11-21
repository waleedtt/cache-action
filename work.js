const core = require('@actions/core');
const github = require('@actions/github');



try {

  const path = core.getInput('path');
  const key = core.getInput('key');
  const restore_keys = core.getInput('restore-keys');

  // const path = process.env['INPUT_PATH'];
  // const key = process.env['INPUT_KEY'];
  // const restore_keys = process.env["INPUT_RESTORE_KEY"];

  //console.log(process.env);

  console.log(`path ${path}!`);
  console.log(`key ${key}!`);
  console.log(`restore-keys ${restore_keys}!`);
  
  // console.log(`::set-output name=cache-hit::1`);
  
  core.setOutput("cache-hit", 1);

  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);

} catch (error) {
  core.setFailed(error.message);
}