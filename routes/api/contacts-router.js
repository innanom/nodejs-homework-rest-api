import express from "express";
import contactsService from "../../models/contacts.js";
import { HttpError } from "../../helpers/index.js";
import Joi from "joi";


const contactsRouter = express.Router();

const contactsAddSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "missing required name field"
  }),
  email: Joi.string().required().messages({
    "any.required": "missing required email field"
  }),
  phone: Joi.string().required().messages({
    "any.required": "missing required phone field"
  }),
})

contactsRouter.get('/', async (req, res, next) => {
  try {
     const result = await contactsService.listContacts();
      res.json(result);
  }
  catch (error) {
    next(error);
  }
})

contactsRouter.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contactsService.getContactById(contactId);
    if (!result) {
      throw HttpError(404, `Contact with contactId=${contactId} not found`);
    }
    res.json(result);
  }
  catch (error) {
    next(error);
  }
})

contactsRouter.post('/', async (req, res, next) => {
  try {
    const { error } = contactsAddSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await contactsService.addContact(req.body);
    res.status(201).json(result);
  }
  catch(error) {
    next(error);
  }
})

contactsRouter.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contactsService.deleteContact(contactId);
     if (!result) {
      throw HttpError(404, `Contact with contactId=${contactId} not found`);
    }
    res.json({
       message: "Delete success"
     });
  }
  catch (error) {
    next(error);
  }
})

contactsRouter.put('/:contactId', async (req, res, next) => {
  try {
    const { error } = contactsAddSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { contactId } = req.params;
    const result = await contactsService.updateContactById(contactId, req.body);
    if (!result) {
      throw HttpError(404, `Contact with contactId=${contactId} not found`);
    }
    res.json(result);
  }
  catch (error) {
    next(error);
  }
})
 

export default contactsRouter;
