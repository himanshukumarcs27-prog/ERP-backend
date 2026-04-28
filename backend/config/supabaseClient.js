import dotenv from "dotenv";
dotenv.config();   // ✅ MUST be here

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// 🔍 Debug
console.log("Loaded URL:", supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;