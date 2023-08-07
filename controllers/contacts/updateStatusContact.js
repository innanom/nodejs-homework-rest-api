import Contact from "../../models/contacts.js";
import { HttpError } from "../../helpers/index.js";

const updateStatusContact = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
    if (!result) {
        throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.json(result);
};
export default updateStatusContact;
