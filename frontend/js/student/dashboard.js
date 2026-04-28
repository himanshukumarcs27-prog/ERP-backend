import {
  getCurrentUser,
  getMarks
} from "../api.js";

// ================= LOAD DASHBOARD =================
document.addEventListener("DOMContentLoaded", async () => {
  console.log("Dashboard Loaded");

  setDate();

  try {
    const userRes = await getCurrentUser();

    console.log("RAW USER RESPONSE:", userRes);

    // 🔥 Handle backend response safely
    const user = userRes.user || userRes.data || userRes;

    // ================= USER INFO =================
    document.getElementById("welcome-name").innerText =
      user.name || "Student";

    document.getElementById("header-student-name").innerText =
      user.name || "Student";

    document.getElementById("course").innerText =
      user.course || "--";

    document.getElementById("semester").innerText =
      user.semester || "--";

    document.getElementById("profile-pic").src =
      `https://ui-avatars.com/api/?name=${user.name || "User"}`;

    // ================= LOAD SUMMARY =================
    loadGradesSummary();

  } catch (err) {
    console.error("Auth Error:", err);
    alert("Session expired. Please login again.");
    window.location.href = "../auth/login.html";
  }
});


// ================= DATE =================
function setDate() {
  document.getElementById("current-date").innerText =
    new Date().toDateString();
}


// ================= GRADES SUMMARY =================
async function loadGradesSummary() {
  try {
    const grades = await getMarks("");

    if (!grades || grades.length === 0) return;

    let total = 0;

    grades.forEach((g) => {
      total += g.marks;
    });

    const gpa = (total / grades.length / 25).toFixed(2);

    document.getElementById("gpa").innerText = gpa;

  } catch (err) {
    console.error("Grades Error:", err);
  }
}