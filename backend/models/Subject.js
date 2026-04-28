import supabase from "../config/supabaseClient.js";

// ➕ Create Subject
export const createSubject = async (subjectData) => {
  const { data, error } = await supabase
    .from("subjects")
    .insert([subjectData])
    .select();

  if (error) throw error;
  return data[0];
};

// 📥 Get all subjects
export const getAllSubjects = async () => {
  const { data, error } = await supabase
    .from("subjects")
    .select("*");

  if (error) throw error;
  return data;
};

// 📥 Get subjects by class
export const getSubjectsByClass = async (class_id) => {
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .eq("class_id", class_id);

  if (error) throw error;
  return data;
};

// 📥 Get single subject
export const getSubjectById = async (id) => {
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

// ✏️ Update subject
export const updateSubject = async (id, updateData) => {
  const { data, error } = await supabase
    .from("subjects")
    .update(updateData)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data[0];
};

// ❌ Delete subject
export const deleteSubject = async (id) => {
  const { error } = await supabase
    .from("subjects")
    .delete()
    .eq("id", id);

  if (error) throw error;
};