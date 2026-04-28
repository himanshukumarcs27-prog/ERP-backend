import express from "express";
import { register, login, getMe } from "../../backend/controllers/authController.js";
import { verifyToken } from "../../backend/middleware/authMiddleware.js";

const router = express.Router();

// ✅ Correct middleware use
router.get("/me", verifyToken, getMe);

router.post("/register", register);
router.post("/login", login);

export default router;