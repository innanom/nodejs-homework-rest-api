import Joi from "joi";

const contactsAddSchema = Joi.object({
    name: Joi.string().required().messages({
        "any.required": "missing required name field"
    }),
    email: Joi.string(),
    phone: Joi.string(),
    favorite: Joi.boolean(),
});

const contactUpdateFavoriteSchema = Joi.object({
    favorite:Joi.boolean().required(),
})
export default {
    contactsAddSchema,
    contactUpdateFavoriteSchema,
};