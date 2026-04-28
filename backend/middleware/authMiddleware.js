import jwt from "jsonwebtoken";

// ================= VERIFY TOKEN =================
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // ✅ Check header exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authorization header missing or invalid",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { id, email, role }

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

// ================= ROLE BASED =================
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // ✅ Safety check
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied for role: ${req.user.role}`,
      });
    }

    next();
  };
};