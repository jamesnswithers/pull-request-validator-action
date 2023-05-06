import { validTitles, invalidTitles, titleMatchers } from '../test/resources/titles/testData';

import { isTitleValid } from "../src/validateTitle";

describe('title', () => {
  describe('valid', () => {
    validTitles.forEach((validTitle) => {
      test(`${validTitle} is valid`, () => {
        const titleCheck = isTitleValid(validTitle, titleMatchers)
        expect(titleCheck).toBeTruthy();
      });
    });
  });
})

describe('schema', () => {
  describe('invalid', () => {
    invalidTitles.forEach((invalidTitle) => {
      test(`${invalidTitle} is invalid`, () => {
        const titleCheck = isTitleValid(invalidTitle, titleMatchers)
        expect(titleCheck).toBeFalsy();
      });
    });
  });
})
