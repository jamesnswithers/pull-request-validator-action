import core from "@actions/core";
import github from "@actions/github";

import { getConfig } from "./config";
import { isTitleValid } from "./validateTitle";

const eventTypes = ["pull_request"];

async function run() {

  const context = github.context;
  const payload = context.payload;
  const action = payload.action || "";

  core.info(`The event type is: ${context.eventName}`);
  if (!eventTypes.includes(context.eventName)) {
    core.info(
      "The payload type is not one of pull_request or pull_request_review. Exiting early.",
    );
    return;
  }

  if (!payload.pull_request) {
    core.info(
      "The payload does not contain pull request information. Exiting early.",
    );
    return;
  }
  
  const githubToken = core.getInput("github-token", { required: true });
  const systemTest = core.getBooleanInput("system-test", { required: false });

  const octokit = github.getOctokit(githubToken);
  const config = await getConfig(octokit);

  const commentOnFailure = config["checks"]["title-validator"]["comment-on-failure"];
  const jobSummaryOnFailure = config["checks"]["title-validator"]["job-summary-on-failure"];
  const failureMessage = config["checks"]["title-validator"]["failure-message"];

  core.info(`The action is: ${action}`);
  core.info(`Is a system test: ${systemTest}`);

  const numberOfComments = payload.pull_request.comments;
  core.info(`The pull request has ${numberOfComments} comments.`);
   const { data: comments } = await octokit.rest.issues.listComments({
    ...context.repo,
    issue_number: payload.pull_request.number,
  });
  const existingComment = comments.find((comment) => comment.body?.includes("Pull Request Title Validation"));
  core.info(`Existing comment found: ${ existingComment ? "yes" : "no" }`);
  core.info(`Existing comment id: ${ existingComment ? existingComment.id : "N/A" }`);

  if (config["checks"]["title-validator"]) {
    const pullRequestTitle : string = payload.pull_request.title;
    const titleCheckState = isTitleValid(
      pullRequestTitle,
      config["checks"]["title-validator"]["matches"],
    );
    if (!systemTest && !titleCheckState) {
      core.setFailed("Pull Request Title Validation Failed");
    
      core.summary.addHeading('Pull Request Title Validation Failed', '2');
      core.summary.addEOL();
      core.summary.addQuote(pullRequestTitle, 'Current PR Title');
      core.summary.addEOL();
      core.summary.addRaw(failureMessage, true);
      if (jobSummaryOnFailure) {
        core.summary.write();
      }

      if (commentOnFailure && !existingComment) {
        octokit.rest.issues.createComment({
          ...github.context.repo,
          issue_number: payload.pull_request.number,
          body: core.summary.stringify(),
      });
      } else if (commentOnFailure && existingComment) {
        core.info(`Updating existing comment with id: ${existingComment.id}`);
        octokit.rest.issues.updateComment({
          ...github.context.repo,
          comment_id: existingComment.id!,
          body: core.summary.stringify(),
        });
      }
    } else if (!systemTest && titleCheckState && existingComment) {
      core.info(`Title is valid. Deleting existing comment with id: ${existingComment.id}`);
      octokit.rest.issues.deleteComment({
        ...github.context.repo,
        comment_id: existingComment.id!,
      });
    }
  }
}

run();
