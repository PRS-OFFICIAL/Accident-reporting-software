import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
    try {
        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
            expiresIn: "7d", // token will expire in 7 days
        });
        return token;
    } catch (error) {
        console.error("Error generating token:", error);
        throw new Error("Token generation failed");        
    }
};
export default generateToken;