const Joi = require('@hapi/joi');

const signupValidation = data => {
    const schema = Joi.object({
        username: Joi.string()
            .min(5)
            .required(),
        email: Joi.string()
            .min(10)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required()
    });
    return schema.validate(data);
};

const signinValidation = data => {
    const schema = Joi.object({
        email: Joi.string()
            .min(10)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required()
    });
    return schema.validate(data);
};

module.exports = {
    signupValidation,
    signinValidation
}
