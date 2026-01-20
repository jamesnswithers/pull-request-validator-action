import * as _ from "lodash";
import * as core from "@actions/core";
import * as github from "@actions/github";

import { getConfig } from "./config";
import { isTitleValid } from "./validateTitle";

const eventTypes = ["pull_request"];

async function run() {
  const githubToken = core.getInput("github-token", { required: true });
  const systemTest = core.getBooleanInput("system-test", { required: false });
  const octokit = github.getOctokit(githubToken);
  const config = await getConfig(octokit);
  const context = github!.context;
  const payload = context!.payload;
  const action = payload!.action || "";

  core.info("The event type is: " + context.eventName);
  if (!_.includes(eventTypes, context.eventName)) {
    core.info(
      "The payload type is not one of pull_request or pull_request_review. Exiting early.",
    );
    return;
  }
  core.info("The action is: " + action);
  core.info("Is a system test: " + systemTest);

  if (_.hasIn(config, "checks.title-validator")) {
    const pullRequestTitle = payload!.pull_request!.title;
    const titleCheckState = isTitleValid(
      pullRequestTitle,
      _.get(config, "checks.title-validator.matches"),
    );
    if (!systemTest && !titleCheckState) {
      core.setFailed("Pull Request Title Validation Failed");
    }
    if (
      !systemTest &&
      !titleCheckState &&
      _.hasIn(config, "checks.title-validator.failure-message")
    ) {
      //core.error(_.get(config, "checks.title-validator.failure-message"));
      core.summary.addHeading('Pull Request Title Validation Failed', '2');
      const failureMessage = _.get(config, "checks.title-validator.failure-message");
      failureMessage.split('\r\n').forEach(line => {
        core.info(line);
        core.summary.addRaw(line, true);
      });
      core.summary.write();
      // octokit.rest.issues.createComment(
      //   Object.assign(Object.assign({}, github.context.repo), {
      //     issue_number: payload!.pull_request!.number,
      //     body: _.get(config, "checks.title-validator.failure-message"),
      //   }),
      // );
    }
  }
}

run();
