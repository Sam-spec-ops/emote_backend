const db = require("../database/db");

const createTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users(
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(200) NULL,
            email VARCHAR(200) NULL UNIQUE,
            username VARCHAR(200) NULL,
            password VARCHAR(200) NULL,
            otp VARCHAR(6) NULL,
            gender VARCHAR(25) NULL,
            about VARCHAR(255),
            verifcationstatus BOOLEAN NULL,
            birthday VARCHAR(25),
            phonenumber INT(12),
            expireAt TIMESTAMP NULL,
            fingerprint LONGTEXT NULL,
            profilepic VARCHAR(255) NULL,
            socketID VARCHAR(255) NULL
        )
    `;
    await db.execute(query);
};

const insertUserDetails = async (name, email, username, password, gender, birthday, phonenumber) => {
    const query = 'INSERT INTO users(name, email, username, password, gender, birthday, phonenumber) VALUES(?,?,?,?,?,?,?)';
    const [result] = await db.execute(query, [name, email, username, password, gender, birthday, phonenumber]);
    return result.insertId;
};

const getUserDetailsByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email=?';
    const [result] = await db.execute(query, [email]);
    return result[0];
};

const getUserDetailsByUsername = async (username) => {
    const query = 'SELECT * FROM users WHERE username=?';
    const [result] = await db.execute(query, [username]);
    return result[0];
};

const updateUserPassword = async (password, id) => {
    const query = "UPDATE users SET password = ? WHERE id = ?";
    const [result] = await db.execute(query, [password, id]);
    return result.affectedRows;
};

const updateUserOtp = async (id, otp, expireAt) => {
    const expireTime = new Date(expireAt).toISOString().slice(0, 19).replace("T", " ");
    const query = "UPDATE users SET otp=?,expireAt=? WHERE id = ?";
    const [result] = await db.execute(query, [otp, expireTime, id]);
    return result.affectedRows;
};

const updateUserVerificationStatus = async (id, verifcationstatus) => {
    const query = "UPDATE users SET verificationstatus=? WHERE id = ?";
    const [result] = await db.execute(query, [verifcationstatus, id]);
    return result.affectedRows;
};

const updateUserData = async (id, name, about, phonenumber) => {
    const query = 'UPDATE users SET name=?,about=?,phonenumber=? WHERE id=?';
    const [result] = await db.execute(query, [name, about, phonenumber, id]);
    return result.affectedRows;
};

const getUserById = async (id) => {
    const query = "SELECT * FROM users WHERE id = ?";
    const [rows] = await db.execute(query, [id]);
    return rows[0];
};

module.exports = {
    createTable,
    insertUserDetails,
    getUserDetailsByEmail,
    getUserDetailsByUsername,
    updateUserPassword,
    updateUserOtp,
    updateUserVerificationStatus,
    updateUserData,
    getUserById
};
