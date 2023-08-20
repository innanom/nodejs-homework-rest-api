import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import { nanoid } from "nanoid";
import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";
import "dotenv/config";
import User from "../../models/user.js";
import { HttpError, sendEmail } from "../../helpers/index.js";
import { ctrlWrapper } from "../../decorators/index.js";

const { JWT_SECRET, BASE_URL } = process.env;


const signup = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "Email in use");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationCode = nanoid();

    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationCode });
    
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a href="${BASE_URL}/api/auth/verify/${verificationCode}" target="_blank">Click verify email</a>`
    }
    await sendEmail(verifyEmail);

    res.status(201).json({
        email: newUser.email,
    })
}

const verify = async (req, res) => {
    const { verificationCode } = req.params;
    const user = await User.findOne({ verificationCode });
    if (!user) {
         throw HttpError(404, "User not found")
    }

    await User.findByIdAndUpdate(user._id, { verify: true, verificationCode: "" });

    res.json({
        message:"Verify success"
    })
}

const resendVerifyEmai = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw HttpError(404, "User not found")
    }
    if (user.verify) {
        throw HttpError(400, "Email already verify")
    }

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a href="${BASE_URL}/api/auth/verify/${user.verificationCode}" target="_blank">Click verify email</a>`
    }
    await sendEmail(verifyEmail);

    res.json({
        message: "Email resend"
    })
}

const signin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }

    if (!user.verify) {
        throw HttpError(401, "Email or password is wrong");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
        id: user._id,
    }
    
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });

    res.json({
        token,
    })
}

const getCurrent = (req, res) => {
    const { email, subscription } = req.user;

    res.json({
        email,
        subscription,
    });
}

const signout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

    res.json({
        message: "Signout success"
    });
};


const avatarPath = path.resolve("public", "avatars");

const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    const {path: oldPath, filename} = req.file;
    const newPath = path.join(avatarPath, filename);
    
    try {
        const avatar = await Jimp.read(newPath);
        avatar.resize(250, 250).write(newPath);
    }
    catch (error) {
        console.error(error);
    }
    await fs.rename(oldPath, newPath);
    
    const avatarUrl = path.join("avatars", filename);
    
     await User.findByIdAndUpdate(_id, { avatarUrl });
   
    res.json({
        avatarUrl,
    });
}

export default {
    signup: ctrlWrapper(signup),
    verify: ctrlWrapper(verify),
    resendVerifyEmai: ctrlWrapper(resendVerifyEmai),
    signin: ctrlWrapper(signin),
    getCurrent: ctrlWrapper(getCurrent),
    signout: ctrlWrapper(signout),
    updateAvatar: ctrlWrapper(updateAvatar),

}