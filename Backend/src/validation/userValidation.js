import Joi from "joi";

const userValidation = Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().trim().email().lowercase().required(),
    password: Joi.string().trim().min(6).required()
});

const loginValidation = Joi.object({
    email: Joi.string().trim().email().lowercase().required(),
    password: Joi.string().trim().min(6).required()
});

export { userValidation, loginValidation };