import { schema } from '../lib/validateSchema';
const { validSchemas, invalidSchemas } = require('../test/resources/schema/object/validateSchema');
import * as fs from 'fs';
import * as yaml from 'js-yaml';

const VALID_TEST_RESOURCES = 'test/resources/schema/yaml/valid';
const INVALID_TEST_RESOURCES = 'test/resources/schema/yaml/invalid';

describe('schema', () => {
  describe('valid', () => {
    validSchemas.forEach(([schemaName, schemaMatch]) => {
      const file = VALID_TEST_RESOURCES + '/' + schemaName + '.yaml';
      test(`${file} is valid`, () => {
        const { error, value } = schema.validate(yaml.safeLoad(fs.readFileSync(file, 'utf8')), {
          abortEarly: false
        });
        expect(error).toBeUndefined();
        expect(JSON.stringify(value)).toMatch(JSON.stringify(schemaMatch));
      });
    });
  });
})

describe('schema', () => {
  describe('invalid', () => {
    invalidSchemas.forEach(([schemaName, schemaError]) => {
      const file = INVALID_TEST_RESOURCES + '/' + schemaName + '.yaml';
      test(`${file} is invalid`, () => {
        const { error, value } = schema.validate(yaml.safeLoad(fs.readFileSync(file, 'utf8')), {
          abortEarly: false
        });
        expect(error && error.toString()).toMatch(schemaError);
      });
    });
  });
})