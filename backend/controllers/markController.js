import { addMarks } from "../../models/Marks.js";
import { recalculateClassResult } from "./resultController.js";
import supabase from "../../config/supabaseClient.js";

// ================= ADD MARKS =================
export const addMarksController = async (req, res) => {
  try {
    const { student_id, subject_id, marks, exam_type } = req.body;

    // 1️⃣ Get teacher
    const { data: teacher, error: teacherError } = await supabase
      .from("teachers")
      .select("id")
      .eq("user_id", req.user.id)
      .single();

    if (teacherError || !teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // 2️⃣ Insert marks
    const newMarks = await addMarks({
      student_id,
      subject_id,
      teacher_id: teacher.id,
      marks,
      exam_type,
    });

    // 3️⃣ 🔥 Get class_id from student
    const { data: studentData, error: studentError } = await supabase
      .from("students")
      .select("class_id")
      .eq("id", student_id)
      .single();

    if (studentError) throw studentError;

    const class_id = studentData.class_id;

    // 4️⃣ 🔥 AUTO RECALCULATE RESULT
    await recalculateClassResult(class_id);

    // 5️⃣ Response
    res.status(201).json({
      message: "Marks added & results updated",
      data: newMarks,
    });

  } catch (err) {
    console.error("Add Marks Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ================= GET MARKS BY SUBJECT =================
// ================= GET MARKS BY SUBJECT =================
export const getMarksBySubject = async (req, res) => {
  try {
    const { subject_id } = req.query;

    if (!subject_id) {
      return res.status(400).json({ message: "subject_id is required" });
    }

    // 1️⃣ Get marks
    const { data: marksData, error: marksError } = await supabase
      .from("marks")
      .select(`
        marks,
        student_id,
        students(name)
      `)
      .eq("subject_id", subject_id);

    if (marksError) throw marksError;

    // 2️⃣ Get results separately
    const { data: resultsData, error: resultsError } = await supabase
      .from("results")
      .select("student_id, grade, total_marks");

    if (resultsError) throw resultsError;

    // 3️⃣ Merge manually
    const finalData = marksData.map((m) => {
      const result = resultsData.find(
        (r) => r.student_id === m.student_id
      );

      return {
        ...m,
        grade: result?.grade || "Not Generated",
        total_marks: result?.total_marks || 0,
      };
    });

    res.json({
      message: "Marks + Grade fetched",
      data: finalData,
    });

  } catch (err) {
    console.error("Get Marks Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};