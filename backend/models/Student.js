import supabase from "../config/supabaseClient.js";


// ================= CREATE STUDENT =================
export const createStudent = async (data) => {
  try {
    // 🔒 Validation
    if (!data.user_id) {
      throw new Error("user_id is required");
    }

    if (!data.roll_no) {
      throw new Error("roll_no is required");
    }

    if (!data.name) {
      throw new Error("name is required");
    }

    // 🔥 Insert
    const { data: student, error } = await supabase
      .from("students")
      .insert([data])
      .select();

    if (error) throw error;

    return student[0];

  } catch (err) {
    throw err;
  }
};


// ================= GET ALL STUDENTS =================
export const getStudents = async () => {
  try {
    const { data, error } = await supabase
      .from("students")
      .select(`
        *,
        users(email, role)
      `); // 🔥 join with users

    if (error) throw error;

    return data;

  } catch (err) {
    throw err;
  }
};


// ================= GET STUDENT BY ID =================
export const getStudentById = async (id) => {
  try {
    const { data, error } = await supabase
      .from("students")
      .select(`
        *,
        users(email, role)
      `)
      .eq("id", id)
      .single();

    if (error) throw error;

    return data;

  } catch (err) {
    throw err;
  }
};


// ================= GET STUDENT BY USER ID (🔥 IMPORTANT) =================
export const getStudentByUserId = async (user_id) => {
  try {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (error) throw error;

    return data;

  } catch (err) {
    throw err;
  }
};