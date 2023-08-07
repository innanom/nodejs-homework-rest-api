import getAll from "./getAll.js";
import getById from "./getById.js";
import add from "./add.js";
import deleteById from "./deleteById.js";
import updateById from "./updateById.js";
import updateStatusContact from "./updateStatusContact.js";

import { ctrlWrapper } from "../../decorators/index.js";

export default {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    deleteById: ctrlWrapper(deleteById),
    updateById: ctrlWrapper(updateById),
    updateStatusContact: ctrlWrapper(updateStatusContact),
}

