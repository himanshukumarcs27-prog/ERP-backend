
// ========================== IMPORT API ==========================
import { apiRequest } from "../../api.js";

// ========================== LOAD ADMIN DASHBOARD ==========================
async function initAdminDashboard() {
  const token = localStorage.getItem("token");

  // 🔒 Auth check
  if (!token) {
    window.location.href = "../auth/login.html";
    return;
  }

  try {
    // ✅ Correct endpoint (make sure backend supports this)
    const stats = await apiRequest("/admin/stats", "GET", null, true);

    // ========================== UPDATE UI ==========================
    document.getElementById("total-students").innerText =
      stats.totalStudents || 0;

    document.getElementById("total-teachers").innerText =
      stats.totalTeachers || 0;

    document.getElementById("total-subjects").innerText =
      stats.totalSubjects || 0;

    document.getElementById("total-classes").innerText =
      stats.totalClasses || 0;

  } catch (err) {
    console.error("Admin API Error:", err.message);

    // 🔥 Handle unauthorized
    if (err.message.includes("Access Denied")) {
      alert("Access Denied: You are not an admin!");
      window.location.href = "../auth/login.html";
    }
  }
}

// ========================== INIT ==========================
document.addEventListener("DOMContentLoaded", initAdminDashboard);

