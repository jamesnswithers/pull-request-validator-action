/**
 * Tests if the Pull Request title is valid, against the configuration provided
 *
 * @param {string} title Title of the Pull Request
 * @param {string[]} matches List of regexs to test the title
 * @returns {boolean} Whether the title is valid or not
 */
export function isTitleValid(title: string, matches: string[]): boolean {
  let titleValidated = false;
  matches.forEach(function (match: string) {
    if (title.match(new RegExp(match, "g"))) {
      return true;
    }
  });
  return titleValidated;
}
