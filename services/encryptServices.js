const { text } = require("body-parser");

const encryptAlgorithm = async (text) => {
    const key = process.env.SECRET_KEY;
    function encrypt(text, key) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) + 3);
        }
        return result;
    }
    return encrypt(text, key);
};

const decryptAlgorithm = async (text) => {
    const key = process.env.SECRET_KEY;
    function encrypt(text, key) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) - 3);
        }
        return result;
    }
    return encrypt(text, key);
};

const hashUserID = async (text) => {
    const hashedText = (text * 997) % 1000000000;
    return hashedText.toString(16).padStart(16, '0');
};

const unHashUserID = async (hashedText) => {
    const maxText = 1000000000;
    for (let text = 1; text <= maxText; text++) {
        const hashedText2 = (text * 997) % 1000000000;
        if (hashedText.toString(16).padStart(16, '0') === hashedText2) {
            return text;
        }
    }
    return null;
}

module.exports = {
    encryptAlgorithm,
    decryptAlgorithm,
    hashUserID,
    unHashUserID
}