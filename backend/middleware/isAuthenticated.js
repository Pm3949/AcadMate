import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    // 1. Get token from Authorization header
    let token = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2. Fallback: get token from cookie
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // 3. If no token found
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    // 4. Verify token
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized - Token error" });
  }
};

export default isAuthenticated;
