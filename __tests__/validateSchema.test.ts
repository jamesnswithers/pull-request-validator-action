import { ValidationError } from 'joi';
import { validateConfig } from '../src/validateSchema';
import { validSchemas, invalidSchemas } from './resources/schema/object/validateSchema';
import fs from 'fs';
import yaml from 'js-yaml';

const VALID_TEST_RESOURCES = '__tests__/resources/schema/yaml/valid';
const INVALID_TEST_RESOURCES = '__tests__/resources/schema/yaml/invalid';

describe('schema', () => {
  describe('valid', () => {
    validSchemas.forEach(([schemaName, schemaMatch]) => {
      const file = `${VALID_TEST_RESOURCES}/${schemaName}.yaml`;
      test(`${file} is valid`, () => {
        const validationResult = validateConfig(yaml.load(fs.readFileSync(file, 'utf8')));
        expect(validationResult.error).toBeUndefined();
        expect(JSON.stringify(validationResult)).toMatch(JSON.stringify(schemaMatch));
      });
    });
  });
});

describe('schema', () => {
  describe('invalid', () => {
    invalidSchemas.forEach(([schemaName, schemaError]) => {
      const file = `${INVALID_TEST_RESOURCES}/${schemaName}.yaml`;
      test(`${file} is invalid`, () => {
        const validationResult = validateConfig(yaml.load(fs.readFileSync(file, 'utf8')));
        expect(validationResult).toBeInstanceOf(ValidationError);
        expect(validationResult && validationResult.toString()).toMatch(schemaError);
      });
    });
  });
});
