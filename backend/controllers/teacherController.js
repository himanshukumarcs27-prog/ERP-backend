import {
  createTeacher,
  getAllTeachers,
  getTeacherByEmail,
} from "../models/Teacher.js";

import supabase from "../../backend/config/supabaseClient.js"; // ✅ ADD THIS

// ================= ADD TEACHER =================
export const addTeacher = async (req, res) => {
  try {
    const teacher = await createTeacher(req.body);

    res.status(201).json({
      message: "Teacher created successfully",
      teacher,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET ALL TEACHERS =================
export const fetchTeachers = async (req, res) => {
  try {
    const teachers = await getAllTeachers();

    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET TEACHER PROFILE =================
export const getTeacherProfile = async (req, res) => {
  try {
    const email = req.user.email;

    const teacher = await getTeacherByEmail(email);

    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= 🎯 DASHBOARD DATA (NEW ADD) =================
export const getTeacherDashboard = async (req, res) => {
  try {
    // 🔍 Teacher info using user_id
    const { data: teacher, error: teacherError } = await supabase
      .from("teachers")
      .select("name, department")
      .eq("user_id", req.user.id)
      .single();

    if (teacherError) {
      console.log("Teacher fetch error:", teacherError);
    }

    // 👨‍🎓 Total students count
    const { count, error: studentError } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true });

    if (studentError) {
      console.log("Student count error:", studentError);
    }

    // 🎯 Final response
    res.json({
      name: teacher?.name || "Teacher",
      department: teacher?.department || "CSE",
      totalStudents: count || 0,
      pendingAssignments: 5, // later dynamic karenge
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};