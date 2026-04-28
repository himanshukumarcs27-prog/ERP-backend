import supabase from "../config/supabaseClient.js";


// 🔹 Get marks of a student (FIXED)
export const getMarksByStudent = async (student_id) => {
  const { data, error } = await supabase
    .from("marks")
    .select("marks, external_marks") // ✅ FIXED

    .eq("student_id", student_id);

  if (error) {
    console.error("❌ getMarks Error:", error.message);
    throw error;
  }

  return data;
};

// 🔹 Get students of a class
export const getStudentsByClass = async (class_id) => {
  const { data, error } = await supabase
    .from("students")
    .select("id")
    .eq("class_id", class_id);

  if (error) {
    console.error("❌ getStudents Error:", error.message);
    throw error;
  }

  return data;
};

// 🔹 Save results (UPSERT)
export const saveResults = async (results) => {
  const { data, error } = await supabase
    .from("results")
    .upsert(results, { onConflict: "student_id" });

  if (error) {
    console.error("❌ Save Error:", error.message);
    throw error;
  }

  console.log("✅ Results saved");
  return data;
};

// 🔹 Get result by student
export const getResultByStudent = async (student_id) => {
  const { data, error } = await supabase
    .from("results")
    .select("*")
    .eq("student_id", student_id)
    .single();

  if (error) {
    console.error("❌ GetResult Error:", error.message);
    throw error;
  }

  return data;
};