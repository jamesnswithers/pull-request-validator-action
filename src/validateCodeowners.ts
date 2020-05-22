import * as _ from 'lodash';
import * as github from '@actions/github';
import * as core from '@actions/core';
import {Codeowner} from 'codeowners-api';
import { StatusStates } from "./statusStates";
import { ReviewStates } from "./reviewStates";

const STATUS_NAME = 'pull-request-utility/codeowners/enforce';
const PAGE_SIZE = 30;

/**
 * Creates a status against the pull request
 *
 * @param {object} gitHubClient Authenticated GitHub client
 * @param {String} status state status
 * @async
 */
async function createStatus(gitHubClient, status) {
  if (github!.context!.payload!.pull_request!.head!.sha) {
    gitHubClient.repos.createStatus(
      Object.assign(
        Object.assign({}, github.context.repo),
        {
          sha: github!.context!.payload!.pull_request!.head!.sha,
          state: status,
          context: STATUS_NAME
        }
      )
    );
  }
}

/**
 * Lists files that are in the pull request
 *
 * @param {object} gitHubClient Authenticated GitHub client
 * @returns {Array} List of files that have been changed
 * @async
 */
async function listPullRequestFiles(gitHubClient) {
  let pullRequestFiles = [];
  const numberOfChangedFiles = github!.context!.payload!.pull_request!.changed_files;
  const numberOfPages = _.ceil(numberOfChangedFiles / PAGE_SIZE);
  let page = 0;
  do {
    const listedFiles = await gitHubClient.pulls.listFiles(
      Object.assign(
        Object.assign({}, github.context.repo),
        {
          pull_number: github!.context!.payload!.pull_request!.number,
          per_page: PAGE_SIZE,
          page: page
        }
      )
    );
    pullRequestFiles = _.concat(pullRequestFiles, _.map(listedFiles.data, 'filename'));
    page++;
  } while (page < numberOfPages)
  core.info(JSON.stringify(pullRequestFiles));
  return pullRequestFiles;
}

/**
 * Lists approvers that have approved the pull request
 *
 * @param {object} gitHubClient Authenticated GitHub client
 * @returns {Array} List of approved reviewers usernames
 * @async
 */
async function listApprovedReviewers(gitHubClient) {
  let pullRequestApprovers = [];
  let moreReviewers = true;
  let page = 0;
  do {
    const listedReviewers = await gitHubClient.pulls.listReviews(
      Object.assign(
        Object.assign({}, github.context.repo),
        {
          pull_number: github!.context!.payload!.pull_request!.number,
          per_page: PAGE_SIZE,
          page: page
        }
      )
    );
    core.info(JSON.stringify(listedReviewers.data));
    core.info(JSON.stringify(_.filter(listedReviewers.data, ['state', ReviewStates.approved])));
    core.info(JSON.stringify(_.filter(listedReviewers.data, ['state', ReviewStates.pending])));
    const additionalApprovers = _.map(_.filter(listedReviewers.data, ['state', ReviewStates.approved]), 'user.login');
    core.info(JSON.stringify(additionalApprovers));
    pullRequestApprovers = _.concat(pullRequestApprovers, additionalApprovers);
    moreReviewers = _.size(additionalApprovers) == PAGE_SIZE;
    page++;
  } while (moreReviewers)
  core.info(JSON.stringify(pullRequestApprovers));
  return pullRequestApprovers;
}

/**
 * Tests required approvers from the CODEOWNERS file have approved the pull request
 *
 * @param {object} gitHubClient Authenticated GitHub client
 * @param {String} githubToken github_token input required for codeowners-api
 * @async
 */
export async function validateCodeowners(gitHubClient, githubToken) {
  const codeOwnersApi = new Codeowner(github.context.repo, {type: 'token', token: githubToken});
  const pullRequestFiles = await listPullRequestFiles(gitHubClient);
  const pullRequestApprovers = await listApprovedReviewers(gitHubClient);
  /*
  if (!codeOwnersApi) {
    createStatus(gitHubClient, StatusStates.failure);
    return;
  }
  let isCodeownerValidated = false;
  */
}