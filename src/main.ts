import * as _ from 'lodash';
import * as core from '@actions/core';
import * as github from '@actions/github';
import { getConfig } from "./config";
import { StatusStates } from "./statusStates";
import { isTitleValid } from "./validateTitle";

const eventTypes = ['pull_request'];
const actionsToCheckTitle = ['opened', 'reopened', 'edited', 'synchronize'];

async function run() {
  const github_token = core.getInput('github-token', { required: true });
  const gitHubClient = new github.GitHub(github_token);
  const config = await getConfig(gitHubClient);
  const pullRequestSha = github!.context!.payload!.pull_request!.head!.sha;
  const context = github!.context;
  const payload = context!.payload;
  const action = payload!.action || '';

  core.info('The event type is: ' + context.eventName);
  if (!_.includes(eventTypes , context.eventName)) {
    core.info('The payload type is not one of pull_request or pull_request_review. Exiting early.');
    return;
  }
  core.info('The action is: ' + action);

  const shouldCheckTitle = _.includes(actionsToCheckTitle, action);

  if (_.hasIn(config , 'checks.title-validator')) {
    const pullRequestTitle = payload!.pull_request!.title;
    const titleCheckState = await isTitleValid(pullRequestTitle, _.get(config, 'checks.title-validator.matches'));
    if (!titleCheckState) {
      core.setFailed("Pull Request Title Validation Failed")
    }
    if (!titleCheckState &&  _.hasIn(config , 'checks.title-validator.failure-message')) {
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
