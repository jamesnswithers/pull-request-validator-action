import * as _ from 'lodash';
import * as core from '@actions/core';
import * as github from '@actions/github';

import { getConfig } from "./config";
import { isTitleValid } from "./validateTitle";

const eventTypes = ['pull_request'];

async function run() {
  const github_token = core.getInput('github-token', { required: true });
  const systemTest = core.getBooleanInput('system-test', { required: false });
  const gitHubClient = new github.GitHub(github_token);
  const config = await getConfig(gitHubClient);
  const context = github!.context;
  const payload = context!.payload;
  const action = payload!.action || '';

  core.info('The event type is: ' + context.eventName);
  if (!_.includes(eventTypes , context.eventName)) {
    core.info('The payload type is not one of pull_request or pull_request_review. Exiting early.');
    return;
  }
  core.info('The action is: ' + action);
  core.info('Is a system test: ' + systemTest);

  if (_.hasIn(config , 'checks.title-validator')) {
    const pullRequestTitle = payload!.pull_request!.title;
    const titleCheckState = isTitleValid(pullRequestTitle, _.get(config, 'checks.title-validator.matches'));
    if (!systemTest && !titleCheckState) {
      core.setFailed("Pull Request Title Validation Failed")
    }
    if (!systemTest && !titleCheckState &&  _.hasIn(config , 'checks.title-validator.failure-message')) {
      gitHubClient.issues.createComment(
        Object.assign(
          Object.assign({}, github.context.repo),
          {
            issue_number: payload!.pull_request!.number,
            body: _.get(config, 'checks.title-validator.failure-message')
          }
        )
      );
    }
  }
}

run();
