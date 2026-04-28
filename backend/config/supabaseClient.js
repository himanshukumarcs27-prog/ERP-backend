// import dotenv from "dotenv";
// dotenv.config();   // ✅ MUST be here

// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_KEY;

// // 🔍 Debug
// console.log("Loaded URL:", supabaseUrl);

// const supabase = createClient(supabaseUrl, supabaseKey);

// export default supabase;
import { createClient } from "@supabase/supabase-js";

// 🔐 Read from environment (Render)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // ✅ use service role

if (!supabaseUrl || !supabaseKey) {
  throw new Error("❌ Supabase environment variables missing");
}
console.log("URL:", supabaseUrl);
console.log("KEY:", supabaseKey ? "FOUND" : "MISSING");
// Optional debug (safe: only URL)
console.log("Loaded URL:", supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;