import supabase from "../config/supabaseClient.js";

// ================= ADD MARKS =================
export const addMarks = async (marksData) => {
  const { data, error } = await supabase
    .from("marks")
    .upsert([marksData], { onConflict: "student_id,subject_id" });

  if (error) {
    console.error("❌ AddMarks Error:", error.message);
    throw error;
  }

  return data;
};

// ================= GET MARKS BY STUDENT =================
export const getMarksByStudent = async (student_id) => {
  const { data, error } = await supabase
    .from("marks")
    .select("*")
    .eq("student_id", student_id);

  if (error) throw error;
  return data;
};