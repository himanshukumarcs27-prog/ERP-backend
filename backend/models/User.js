import supabase from "../config/supabaseClient.js";

// ================= FIND USER =================
export const findUserByEmail = async (email) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();

  return { data, error };
};

// ================= CREATE USER =================
export const createUser = async (user) => {
  const { data, error } = await supabase
    .from("users")
    .insert([user])
    .select()
    .single(); // 🔥 ensures object

  if (error) {
    console.error("Insert error:", error.message);
    return null;
  }

  return {data,error};
};