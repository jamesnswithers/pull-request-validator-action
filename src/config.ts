import * as github from "@actions/github";
import { RequestError } from "@octokit/request-error";
import * as yaml from "js-yaml";
import { validateSchema } from "./validateSchema";

const CONFIG_FILE = ".github/pull-request-validator-config.yaml";

/**
 * Loads a file from GitHub
 *
 * @param {object} octokit An authenticated GitHub context
 * @param {object} params Params to fetch the file with
 * @returns {Promise<object>} The parsed YAML file
 * @async
 */
async function loadYaml(octokit, params) {
  try {
    const response = await octokit.rest.repos.getContent(params);

    if (typeof response.data.content !== "string") {
      return;
    }
    return (
      yaml.load(Buffer.from(response.data.content, "base64").toString()) || {}
    );
  } catch (e) {
    if (e instanceof RequestError && e.status === 404) {
      return null;
    }

    throw e;
  }
}

/**
 * Loads the specified config file from the context's repository
 *
 * If the config file does not exist in the context's repository, `null`
 * is returned.
 *
 * @param {object} octokit An authenticated GitHub context
 * @returns {object} The merged configuration
 * @async
 */
export async function getConfig(octokit) {
  const params = Object.assign(Object.assign({}, github.context.repo), {
    path: CONFIG_FILE,
  });
  const yamlConfig = await loadYaml(octokit, params);
  return validateSchema(yamlConfig);
}
