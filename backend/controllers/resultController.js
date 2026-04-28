import {
  getMarksByStudent,
  getStudentsByClass,
  saveResults,
  getResultByStudent,
} from "../models/Result.js";
import supabase from "../config/supabaseClient.js";

// 🎯 Relative Grade Function (Percentile based)
const getRelativeGrade = (rank, total) => {
  if (total === 0) return "F";

  const percentile = ((total - rank + 1) / total) * 100;

  if (percentile >= 95) return "A+";
  if (percentile >= 85) return "A";
  if (percentile >= 75) return "B+";
  if (percentile >= 65) return "B";
  if (percentile >= 55) return "C";
  if (percentile >= 45) return "D";
  return "F";
};

// 🎯 GPA mapping
const gradeToGPA = {
  "A+": 10,
  "A": 9,
  "B+": 8,
  "B": 7,
  "C": 6,
  "D": 5,
  "F": 0,
};

// ================= CORE FUNCTION =================
export const recalculateClassResult = async (class_id) => {
  try {
    console.log("🔥 Recalculating for class:", class_id);

    const students = await getStudentsByClass(class_id);

    if (!students || students.length === 0) {
      console.log("⚠ No students found");
      return [];
    }

    let results = [];

    // 1️⃣ Calculate total marks
    for (let student of students) {
      const marks = await getMarksByStudent(student.id);

      let total = 0;

      if (marks && marks.length > 0) {
        marks.forEach((m) => {
          total += (m.marks || 0) + (m.external_marks || 0);
        });
      }

      const maxMarks = (marks?.length || 1) * 100;
      const percentage = (total / maxMarks) * 100;

      results.push({
        student_id: student.id,
        total_marks: total,
        percentage,
      });
    }

    // 2️⃣ Sort (descending)
    results.sort((a, b) => b.total_marks - a.total_marks);

    const totalStudents = results.length;

    // 3️⃣ Rank (tie-safe)
    let rank = 1;
    for (let i = 0; i < results.length; i++) {
      if (i > 0 && results[i].total_marks < results[i - 1].total_marks) {
        rank = i + 1;
      }
      results[i].rank = rank;
    }

    // 4️⃣ Assign grade + GPA
    const finalResults = results.map((student) => {
      const grade = getRelativeGrade(student.rank, totalStudents);

      return {
        student_id: student.student_id,
        total_marks: student.total_marks,
        percentage: student.percentage,
        grade,
        gpa: gradeToGPA[grade],
      };
    });

    console.log("📊 Final Results:", finalResults);

    // 5️⃣ Save to DB
    await saveResults(finalResults);

    console.log("✅ Results saved successfully");

    return finalResults;

  } catch (error) {
    console.error("❌ Recalculation Error:", error.message);
    throw error;
  }
};

// ================= GENERATE RESULT =================
export const generateClassResult = async (req, res) => {
  try {
    const { class_id } = req.body;

    if (!class_id) {
      return res.status(400).json({ message: "class_id is required" });
    }

    const finalResults = await recalculateClassResult(class_id);

    res.json({
      message: "Class result generated successfully",
      data: finalResults,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ================= GET SINGLE RESULT =================
export const getMyResult = async (req, res) => {
  try {
    const { student_id } = req.params;

    const result = await getResultByStudent(student_id);

    res.json(result);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= LEADERBOARD =================
export const getLeaderboard = async (req, res) => {
  try {
    const { class_id } = req.query;

    const { data, error } = await supabase
      .from("results")
      .select(`
        student_id,
        total_marks,
        percentage,
        grade,
        students(name, class_id)
      `)
      .eq("students.class_id", class_id)
      .order("total_marks", { ascending: false })
      .limit(10);

    if (error) throw error;

    const leaderboard = data.map((student, index) => ({
      rank: index + 1,
      name: student.students.name,
      total_marks: student.total_marks,
      percentage: student.percentage,
      grade: student.grade,
    }));

    res.json({
      message: "Leaderboard fetched",
      data: leaderboard,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= SUBJECT GRAPH =================
export const getSubjectGraph = async (req, res) => {
  try {
    const { subject_id, class_id } = req.query;

    const { data, error } = await supabase
      .from("marks")
      .select(`
        marks,
        external_marks,
        student_id,
        students(name, class_id)
      `)
      .eq("subject_id", subject_id)
      .eq("students.class_id", class_id);

    if (error) throw error;

    const graphData = data.map((item) => ({
      name: item.students.name,
      marks: (item.marks || 0) + (item.external_marks || 0),
    }));

    res.json({
      message: "Graph data ready",
      data: graphData,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getClassAnalytics = async (req, res) => {
  try {
    const class_id = Number(req.query.class_id);

    console.log("📊 CLASS ID:", class_id);

    // 1️⃣ students
    const { data: students, error: e1 } = await supabase
      .from("students")
      .select("id, name")
      .eq("class_id", class_id);

    if (e1) throw e1;

    console.log("👨‍🎓 Students:", students);

    // 2️⃣ results
    const { data: results, error: e2 } = await supabase
      .from("results")
      .select("student_id, total_marks, percentage");

    if (e2) throw e2;

    console.log("📄 Results:", results);

    if (!students || students.length === 0) {
      return res.json({
        avgMarks: 0,
        avgPercentage: 0,
        totalStudents: 0,
        chartData: [],
      });
    }

    // 3️⃣ merge
    const chartData = students.map((s) => {
      const r = results?.find(r => r.student_id === s.id);

      return {
        name: s.name,
        marks: r?.total_marks || 0,
        percentage: r?.percentage || 0,
      };
    });

    const total = chartData.length;

    const avgMarks =
      total > 0
        ? chartData.reduce((sum, s) => sum + s.marks, 0) / total
        : 0;

    const avgPercentage =
      total > 0
        ? chartData.reduce((sum, s) => sum + s.percentage, 0) / total
        : 0;

    res.json({
      avgMarks,
      avgPercentage,
      totalStudents: total,
      chartData,
    });

  } catch (err) {
    console.error("❌ FULL ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};