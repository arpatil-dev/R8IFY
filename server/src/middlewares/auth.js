import jwt from "jsonwebtoken";

// ✅ Authenticate user: check token validity
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded JWT:", decoded); // Debugging line
    req.user = decoded; // attach user data to request
    // cons ole.log("Authenticated user:", req.user.id); // Debugging line
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, please login again" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ Authorize roles: check user role(s)
export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.length) {
      return next(); // no role restriction
    }

    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient rights" });
    }

    next();
  };
};
