import express from "express";
import contactsController from "../../controllers/contacts-controller.js";
import { validateBody } from "../../decorators/index.js";
import { isEmptyBody } from "../../middlewares/index.js";
import contactsSchemas from "../../schemas/contacts-schemas.js";


const contactsRouter = express.Router();

contactsRouter.get('/', contactsController.getAll)

contactsRouter.get('/:id', contactsController.getById)

contactsRouter.post('/', isEmptyBody, validateBody(contactsSchemas.contactsAddSchema), contactsController.add)

contactsRouter.delete('/:id', contactsController.deleteById)

contactsRouter.put('/:id', isEmptyBody, validateBody(contactsSchemas.contactsAddSchema), contactsController.updateById)
 

export default contactsRouter;
