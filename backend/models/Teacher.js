import supabase from "../config/supabaseClient.js";

// ================= CREATE TEACHER =================
export const createTeacher = async (data) => {
  const { name, email, subject, department } = data;

  const { data: teacher, error } = await supabase
    .from("teachers")
    .insert([
      {
        name,
        email,
        department,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return teacher;
};

// ================= GET ALL TEACHERS =================
export const getAllTeachers = async () => {
  const { data, error } = await supabase
    .from("teachers")
    .select("*");

  if (error) throw error;
  return data;
};

// ================= GET TEACHER BY EMAIL =================
export const getTeacherByEmail = async (email) => {
  const { data, error } = await supabase
    .from("teachers")
    .select("*")
    .eq("email", email)
    .single();

  if (error) throw error;
  return data;
};