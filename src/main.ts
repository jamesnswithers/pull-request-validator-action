import * as _ from 'lodash';
import * as core from '@actions/core';
import * as github from '@actions/github';
import { getConfig } from "./config";
import { StatusStates } from "./statusStates";
import { isTitleValid } from "./validateTitle";
import { validateCodeowners } from "./validateCodeowners";

const eventTypes = ['pull_request', 'pull_request_review'];
const actionsToCheckTitle = ['opened', 'reopened', 'edited', 'synchronize'];

async function run() {
  const github_token = core.getInput('github-token', { required: true });
  const gitHubClient = new github.GitHub(github_token);
  const config = await getConfig(gitHubClient);
  const pullRequestSha = github!.context!.payload!.pull_request!.head!.sha;
  const context = github!.context;
  const payload = context!.payload;
  const action = payload!.action || '';

  core.info(JSON.stringify(github));
  core.info(JSON.stringify(context));
  core.info('The event type is: ' + context.eventName);
  if (!_.includes(eventTypes , context.eventName)) {
    core.info('The payload type is not one of pull_request or pull_request_review. Exiting early.');
    return;
  }
  core.info('The action is: ' + action);

  const shouldCheckTitle = _.includes(actionsToCheckTitle, action);
  const shouldCheckCodeowner = shouldCheckTitle || _.includes(payload , 'pull_request_review');

  if (_.hasIn(config , 'checks.title-validator')) {
    const pullRequestTitle = payload!.pull_request!.title;
    const titleCheckState = await isTitleValid(pullRequestTitle, _.get(config, 'checks.title-validator.matches'));
    gitHubClient.repos.createStatus(
      Object.assign(
        Object.assign({}, github.context.repo),
        {
          sha: pullRequestSha,
          state: titleCheckState ? StatusStates.success : StatusStates.failure,
          context: 'pull-request-validator/title/validation'
        }
      )
    );
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

  core.info('shouldCheckTitle: ' + shouldCheckTitle);
  core.info('shouldCheckCodeowner: ' + shouldCheckCodeowner);
  core.info('pull_request_review: ' + payload.pull_request_review);
  const codeownerConfigSet = _.hasIn(config , 'checks.codeowner.enforce-multiple') && _.get(config, 'checks.codeowner.enforce-multiple');
  if (codeownerConfigSet && shouldCheckCodeowner) {
    core.info('inside validate codeowners');
    validateCodeowners(gitHubClient, github_token);
  }
}

run();
