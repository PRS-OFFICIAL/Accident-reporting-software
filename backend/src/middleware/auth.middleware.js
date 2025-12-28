import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
const verifyToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  try {
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(500).json({ message: `Token Verification Error: ${error}` });
  }
});

export default verifyToken;