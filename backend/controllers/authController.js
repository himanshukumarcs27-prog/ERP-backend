import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import supabase from "../config/supabaseClient.js";

import { findUserByEmail, createUser } from "../models/User.js";
import { createStudent } from "../models/Student.js";

// ================== 📝 REGISTER ==================
export const register = async (req, res) => {
  try {
    let { email, password, role, name, roll_no, course, semester } = req.body;

    email = email.trim().toLowerCase();

    // ✅ College email validation
    if (!email.endsWith("@iilm.edu.com")) {
      return res.status(400).json({ message: "Invalid college email" });
    }

    // ✅ Check existing user
    const existingUser = await findUserByEmail(email);
    if (existingUser?.data) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user
    const { data: userData, error: userError } = await createUser({
      email,
      password: hashedPassword,
      role
    });

    if (userError) throw userError;

    const user = userData[0];

    // ✅ Create student profile (if role = student)
    if (role === "student") {
      const { error: studentError } = await createStudent({
        user_id: user.id,
        roll_no,
        name,
        course,
        semester
      });

      if (studentError) throw studentError;
    }

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};


// ================== 🔐 LOGIN ==================
export const login = async (req, res) => {
  try {
    let { email, password, role } = req.body;

    email = email.trim().toLowerCase();

    const { data: user, error } = await findUserByEmail(email);

    if (!user || error) {
      return res.status(400).json({ message: "User not found" });
    }

    // ✅ Role validation
    if (role && user.role !== role) {
      return res.status(403).json({
        message: `This account is registered as ${user.role}, not ${role}`
      });
    }

    // ✅ Password check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // ✅ JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ Response FIXED (frontend compatible)
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};


// ================== 👤 GET ME ==================
export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    // ✅ Get user
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (userError) throw userError;

    let studentData = null;

    // ✅ If student → fetch student table
    if (user.role === "student") {
      const { data: student, error: studentError } = await supabase
        .from("students")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (!studentError) {
        studentData = student;
      }
    }

    // ✅ Merge response
    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,

        // 🔥 student table data
        name: studentData?.name || "Student",
        course: studentData?.course || null,
        semester: studentData?.semester || null,
        roll_no: studentData?.roll_no || null
      }
    });

  } catch (err) {
    console.error("GetMe Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};