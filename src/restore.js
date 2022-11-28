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
storage.setStorage(sa);


