// ================= IMPORT =================

import { apiRequest } from "../../js/api.js";

// ================= LOAD DASHBOARD =================
async function loadTeacherDashboard() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "../auth/login.html";
    return;
  }

  try {
    // 🔥 CORRECT API
    const data = await apiRequest("/teachers/dashboard-data", "GET", null, true);

    console.log("Dashboard Data:", data); // DEBUG

    renderTeacherUI(data);

  } catch (error) {
    console.error("Dashboard Error:", error.message);
    alert("Failed to load dashboard");
  }
}


// ================= RENDER UI =================
function renderTeacherUI(data) {

  const name = data.name || "Teacher";

  document.getElementById("teacher-name-header").innerText = name;
  document.getElementById("welcome-teacher").innerText = name;

  document.getElementById("teacher-profile-pic").src =
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;

  document.getElementById("dept-name").innerText =
    data.department || "N/A";

  document.getElementById("total-students-count").innerText =
    data.totalStudents || 0;

  document.getElementById("pending-tasks").innerText =
    data.pendingAssignments || 0;

  // OPTIONAL: classes rendering
  const classesDiv = document.getElementById("classes-list");
  if (classesDiv && data.classes) {
    classesDiv.innerHTML = "";

    data.classes.forEach((c, i) => {
      classesDiv.innerHTML += `
        <div class="course-card">
          <div class="card-head">
            <span>${i + 1}) ${c.code}</span>
          </div>
          <h4>${c.name}</h4>
          <p>${c.schedule || "N/A"}</p>
        </div>
      `;
    });
  }
}


// ================= INIT =================
document.addEventListener("DOMContentLoaded", loadTeacherDashboard);