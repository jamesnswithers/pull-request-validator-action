const validSchemas = [
  ['valid-schema-1', {
    'checks': {
      'title-fixer': {
        'enforce-check': true,
        'fixes': [
          {'replace': 'Replace this', 'with': 'With this'},
          {'replace': 'Replace this', 'with': 'With this'}
        ]
      },
      'title-validator': {
        'matches': [
          'Match this', 'And this'
        ],
        'failure-message': 'Failed validation'
      },
      'codeowner': {
        'enforce-multiple': true
      }
    }
  }],
  ['valid-schema-2', {
    'checks': {
      'title-fixer': {
        'enforce-check': true,
        'fixes': [
          {'replace': 'Replace this', 'with': 'With this'}
        ]
      },
      'title-validator': {
        'matches': [
          'Match this', 'And this'
        ],
        'failure-message': 'Failed validation'
      }
    }
  }],
  ['valid-schema-3', {
    'checks': {
      'title-validator': {
        'matches': [
          'Match this'
        ],
        'failure-message': 'Failed validation'
      }
    }
  }]
];

module.exports.validSchemas = validSchemas;

const invalidSchemas = [
  ['invalid-schema-1', '"checks.title-fixer.enforce-check" must be a boolean'],
  ['invalid-schema-2', '"checks.codeowner.force-multiple" is not allowed'],
  ['invalid-schema-3', '"checks.title-validator.failure-message" is required']
];

module.exports.invalidSchemas = invalidSchemas;