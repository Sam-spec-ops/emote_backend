// uploadImage.js (middleware)
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const slugify = require('slugify');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./verificationImages"); // upload folder
    },
    filename: async (req, file, cb) => {
        const userId = req.userId; // get userId from verifytoken
        const filename = await bcrypt.hash(`${userId}`, 10);
        cb(null, `${filename}${path.extname(file.originalname)}`);
    }
});

const uploadMiddleware = multer({ storage: storage });

const imageUpload = (req, res, next) => {
    uploadMiddleware.single("image")(req, res, (err) => {
        if (err) {
            return next(err);
        }
        req.filename = req.file.filename; // set filename to req object
        next();
    });
};

module.exports = imageUpload;
