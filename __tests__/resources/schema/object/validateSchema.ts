export const validSchemas = [
  [
    'valid-schema-1',
    {
      checks: {
        'title-fixer': {
          'enforce-check': true,
          'fixes': [
            {replace: 'Replace this', with: 'With this'},
            {replace: 'Replace this', with: 'With this'}
          ]
        },
        'title-validator': {
          'matches': ['Match this', 'And this'],
          'failure-message': 'Failed validation',
          'comment-on-failure': true,
          'job-summary-on-failure': true
        }
      }
    }
  ],
  [
    'valid-schema-2',
    {
      checks: {
        'title-fixer': {
          'enforce-check': true,
          'fixes': [{replace: 'Replace this', with: 'With this'}]
        },
        'title-validator': {
          'matches': ['Match this', 'And this'],
          'failure-message': 'Failed validation',
          'comment-on-failure': false,
          'job-summary-on-failure': false
        }
      }
    }
  ],
  [
    'valid-schema-3',
    {
      checks: {
        'title-validator': {
          'matches': ['Match this'],
          'failure-message': 'Failed validation',
          'comment-on-failure': true,
          'job-summary-on-failure': false
        }
      }
    }
  ]
];

export const invalidSchemas = [
  ['invalid-schema-1', '"checks.title-fixer.enforce-check" must be a boolean'],
  ['invalid-schema-2', '"checks.some-check" is not allowed'],
  ['invalid-schema-3', '"checks.title-validator.matches" must be a string']
];
