import * as _ from 'lodash';

/**
 * Tests if the Pull Request title is valid, against the configuration provided
 *
 * @param {String} title Title of the Pull Request
 * @param {object} matches List of regexs to test the title
 * @returns {boolean} Whether the title is valid or not
 */
export function isTitleValid(title: string, matches: object): boolean {
  let titleValidated = false;
  _.forEach(matches, function(titleValidation: string | RegExp) {
    if (title.match(new RegExp(titleValidation, 'g'))) {
      titleValidated = true;
    }
  });
  return titleValidated;
}
