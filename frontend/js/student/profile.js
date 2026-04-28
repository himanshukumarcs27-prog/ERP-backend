
// ========================== IMPORT API ==========================
import { getCurrentUser } from "../../api.js";

// ========================== LOAD PROFILE ==========================
async function loadProfile() {
  try {
    // ✅ Correct API call (uses token internally)
    const data = await getCurrentUser();

    // Some APIs return { user }, some return direct object
    const user = data.user || data;

    document.getElementById("name").innerText = user.name || "N/A";
    document.getElementById("email").innerText = user.email || "N/A";

  } catch (err) {
    console.error("Profile Error:", err.message);

    alert("Please login first");
    window.location.href = "../auth/login.html";
  }
}

// ========================== INIT ==========================
loadProfile();

