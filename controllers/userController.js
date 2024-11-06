const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const SECRET_KEY = "process.env.SECRET_KEY";
const jwt = require("jsonwebtoken");

const userRegistration = async (req, res) => {
    await userModel.createTable();
    const { name, email, username, password, gender, birthday, phonenumber } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    console.log(name,email,username,password,gender,birthday,phonenumber)
    const checkexistuseremail = await userModel.getUserDetailsByEmail(email);
    if (checkexistuseremail) {
        return res.status(403).json({ message: "Email already exists" });
    }
    const checkexistuserusername = await userModel.getUserDetailsByUsername(username);
    if (checkexistuserusername) {
        return res.status(403).json({ message: "Username already exists" });
    }
    try {
        const insertuserdetails = await userModel.insertUserDetails(name, email, username, hashedPassword, gender, birthday, phonenumber);
        if (!insertuserdetails) {
            return res.status(403).json({ message: "Registration failed" });
        } else {
            console.log(insertuserdetails)
            res.status(201).json({ message: "Registration successful", id: insertuserdetails });
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "Error operation failed" });
    }
};

const userLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const getrows = await userModel.getUserDetailsByEmail(email);
        console.log(getrows);
        if (!getrows) {
            return res.status(403).json({ auth: false, token: null, message: "User not found", userdata: null });
        }
        const isPasswordValid = await bcrypt.compareSync(password, getrows.password);
        if (!isPasswordValid) {
            return res.status(403).json({ message: "Invalid Password" });
        }
        const userdata = {
            name: getrows.name,
            email: getrows.email,
            username: getrows.username,
            profilepic: getrows.profilepic,
            phonenumber: getrows.phonenumber,
        };
        const token = jwt.sign({ id: getrows.id }, SECRET_KEY, { expiresIn: 86400 }); // 24 hours
        res.status(201).json({ auth: true, token: token, message: "successful", userdata: userdata });
    } catch (error) {
        res.status(404).json({ message: "Operation failed" });
        console.error(error);
    }
};

const sendEmail = (req, res) => {
    const id = req.userId;
    const { email } = req.body;
    function generateRandom4DigitNumber() {
        return Math.floor(Math.random() * 9000) + 1000;
    }
    const otp = generateRandom4DigitNumber();
    const expiresAt = Date.now() + 5 * 60 * 1000;
    const mailOptions = {
        from: "emote@gmail.com",
        to: email,
        subject: "Email Verification",
        html: VerifyTemplate(otp),
    };
    try {
        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.error(error);
                res.status(403).json({ message: "Email not sent" });
                return;
            } else {
                const updateuser = await userModel.updateUserOtp(id, otp, expiresAt);
                if (updateuser === 0) {
                    res.status(404).json({ error: "Otp error" });
                } else {
                    res.status(200).json({ message: "Email sent" });
                }
            }
        });
    } catch (error) {
        console.error(error);
    }
};

const validateOtp = async (req, res) => {
    const id = req.userId;
    const { otp } = req.body;
    try {
        const getrows = await userModel.getUserById(id);
        const userotp = getrows.otp;
        const userexpireAt = new Date(getrows.expireAt).getTime();
        if (!userotp || !userexpireAt) {
            return res.status(404).json({ message: "No OTP found" });
        }
        if (Date.parse(new Date().getTime()) > Date.parse(getrows.expireAt)) {
            return res.status(403).json({ message: "OTP has expired" });
        }
        if (otp == userotp) {
            const verifcationstatus = true;
            const updateuser = await userModel.updateUserVerificationStatus(id, verifcationstatus);
            if (updateuser === 0) {
                return res.status(404).json({ message: "User not found" });
            } else {
                return res.status(201).json({ message: "OTP verified successfully" });
            }
        } else {
            return res.status(403).json({ message: "Invalid OTP" });
        }
    } catch (error) {
        res.status(404).json({ message: "Operation failed" });
        console.error(error);
    }
};

const updatePassword = async (req, res) => {
    const id = req.userId;
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    const updatePassword = await userModel.updateUserPassword(hashedPassword, id);
    if (updatePassword === 0) {
        return res.status(403).json({ message: "Password change failed" });
    } else {
        return res.status(201).json({ message: "Password change successful" });
    }
};

const updateUserData = async (req, res) => {
    const id = req.userId;
    const { phonenumber, name, about } = req.body;
    try {
        const updateuserdata = await userModel.updateUserData(id,name,about,phonenumber);
        if(updateuserdata===0){
            res.status(403).json({message:'Failed to update data'});
        } else {
            const getrows = await userModel.getUserById(id);
            const userdata = {
                name: getrows.name,
                email: getrows.email,
                username: getrows.username,
                profilepic: getrows.profilepic,
                phonenumber: getrows.phonenumber,
            };
            res.status(201).json({message:'Date updated successfully', userdata:userdata});
        }
    } catch (error) {
        res.status(404).json({ message: "Operation failed" });
        console.error(error);
    }
};

const getUserDetails = async (req, res) => {
    const id = req.userId;
    const { username } = req.body;
    try {
        const getuserdetails = await userModel.getUserDetailsByUsername(username);
        if(!getuserdetails) {
            return res.status(403).json({message:'Failed to update data'});
        }
        const userdetails = {
            name: getuserdetails.name,
            username: getuserdetails.username,
            socketID: getuserdetails.socketID,
            profilepic: getuserdetails.profilepic
        }
        res.status(201).json({message: 'successful', userdetails:userdetails});
    } catch (error) {
        res.status(404).json({ message: "Operation failed" });
        console.error(error); 
    }
};

module.exports = {
    userRegistration,
    userLogin,
    validateOtp,
    sendEmail,
    updatePassword,
    updateUserData
};
