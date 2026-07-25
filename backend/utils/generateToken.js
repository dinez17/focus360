import jwt from 'jsonwebtoken';

// Creates a signed JWT containing the admin's ID and role.
// We keep the payload minimal — never put sensitive data (like password hash) in a JWT,
// since JWT payloads are only encoded, not encrypted, and can be decoded by anyone.
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

export default generateToken;