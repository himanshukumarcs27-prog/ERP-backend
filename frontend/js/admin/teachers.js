
// ========================== IMPORT API ==========================
import {
  getTeachers,
  addTeacher,
  deleteTeacher
} from "../../api.js";

// ========================== GLOBAL ==========================
let teachers = [];

// ========================== LOAD DATA ==========================
async function fetchTeachers() {
  try {
    teachers = await getTeachers();
    displayTeachers(teachers);
  } catch (err) {
    console.error("Error fetching teachers:", err.message);
  }
}

// ========================== DISPLAY TABLE ==========================
function displayTeachers(data) {
  const table = document.getElementById("teacherTable");
  table.innerHTML = "";

  data.forEach(t => {
    table.innerHTML += `
      <tr>
        <td>${t.name}</td>
        <td>${t.email}</td>
        <td>${t.subject || "N/A"}</td>
        <td>
          <button onclick="deleteTeacherHandler('${t.id}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

// ========================== SEARCH ==========================
document.getElementById("search")?.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();

  const filtered = teachers.filter(t =>
    t.name.toLowerCase().includes(value)
  );

  displayTeachers(filtered);
});

// ========================== ADD TEACHER ==========================
async function addTeacherHandler() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;

  if (!name || !email) {
    alert("Name and Email required");
    return;
  }

  try {
    await addTeacher({ name, email, subject });

    closeModal();
    fetchTeachers();

  } catch (err) {
    console.error("Error adding teacher:", err.message);
  }
}

// ========================== DELETE TEACHER ==========================
async function deleteTeacherHandler(id) {
  if (!confirm("Delete this teacher?")) return;

  try {
    await deleteTeacher(id);
    fetchTeachers();
  } catch (err) {
    console.error("Error deleting teacher:", err.message);
  }
}

// ========================== MODAL ==========================
function openModal() {
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// ========================== GLOBAL ==========================
window.addTeacherHandler = addTeacherHandler;
window.deleteTeacherHandler = deleteTeacherHandler;
window.openModal = openModal;
window.closeModal = closeModal;

// ========================== INIT ==========================
fetchTeachers();
