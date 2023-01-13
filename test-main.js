const core = require('@actions/core');
const github = require('@actions/github');


console.log("start2")
console.log("GITHUB_REF:", process.env['GITHUB_REF']);
console.log("GITHUB_HEAD_REF:", process.env['GITHUB_HEAD_REF']);
console.log("GITHUB_BASE_REF:", process.env['GITHUB_BASE_REF']);
console.log("GITHUB_REF_NAME:", process.env['GITHUB_REF_NAME']);
console.log("GITHUB_REF_TYPE:", process.env['GITHUB_REF_TYPE']);
console.log("GITHUB_ACTION_REF:", process.env['GITHUB_ACTION_REF']);
console.log("end2")


console.log("start3")
const { context = {} } = github;
console.log("default_branch:", context.payload.repository);
console.log(Buffer.from(JSON.stringify(github)).toString('base64'));
console.log("end3")

console.log("start1")
console.log(process.env);
console.log("end1")

console.log("start")
core.saveState("test", 12345);
console.log("end")


console.log("start")
console.log(Buffer.from(JSON.stringify(process.env)).toString('base64'));
console.log("end")