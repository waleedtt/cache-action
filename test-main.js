const core = require('@actions/core');
const github = require('@actions/github');

console.log("start1")
console.log(process.env);
console.log("end1")

console.log("start")
core.saveState("test", 12345);
console.log("end")


console.log("start")
console.log(Buffer.from(JSON.stringify(process.env)).toString('base64'));
console.log("end")