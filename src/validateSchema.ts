import * as Joi from '@hapi/joi';

export const schema = Joi.object().keys({
  'checks': Joi.object().keys({
    'title-fixer': Joi.object().keys({
      'enforce-check': Joi.boolean().default(false).strict(),
      'fixes': Joi.array().items(
        Joi.object().keys({
          'replace': Joi.string().required(),
          'with': Joi.string().allow('').required()
        })
      )
     }),

    'title-validator': Joi.object().keys({
      'matches': Joi.array().items(Joi.string()).single().default([]),
      'failure-message': Joi.string().required(),
    }),

    'codeowner': Joi.object().keys({
      'enforce-multiple': Joi.boolean().default(false)
    })
  })
});

export const validateSchema = config => {
  const { error, value: validatedConfig } = schema.validate(config, {
    abortEarly: false,
    allowUnknown: true
  });

  if (error) {
    throw error;
  }

  return validatedConfig;
}