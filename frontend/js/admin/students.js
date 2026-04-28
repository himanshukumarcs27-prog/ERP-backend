
// ========================== IMPORT API ==========================
import {
  getStudents,
  addStudent,
  deleteStudent
} from "../../api.js";

// ========================== GLOBAL ==========================
let students = [];

// ========================== LOAD DATA ==========================
async function fetchStudents() {
  try {
    students = await getStudents();
    displayStudents(students);
  } catch (err) {
    console.error("Error fetching students:", err.message);
  }
}

// ========================== DISPLAY TABLE ==========================
function displayStudents(data) {
  const table = document.getElementById("studentTable");
  table.innerHTML = "";

  data.forEach(s => {
    table.innerHTML += `
      <tr>
        <td>${s.name}</td>
        <td>${s.email}</td>
        <td>${s.course || "N/A"}</td>
        <td>
          <button onclick="deleteStudentHandler('${s.id}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

// ========================== SEARCH ==========================
document.getElementById("search")?.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(value)
  );

  displayStudents(filtered);
});

// ========================== ADD STUDENT ==========================
async function addStudentHandler() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const course = document.getElementById("course").value;

  if (!name || !email) {
    alert("Name and Email required");
    return;
  }

  try {
    await addStudent({ name, email, course });

    closeModal();
    fetchStudents();

  } catch (err) {
    console.error("Error adding student:", err.message);
  }
}

// ========================== DELETE STUDENT ==========================
async function deleteStudentHandler(id) {
  if (!confirm("Delete this student?")) return;

  try {
    await deleteStudent(id);
    fetchStudents();
  } catch (err) {
    console.error("Error deleting student:", err.message);
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
window.addStudentHandler = addStudentHandler;
window.deleteStudentHandler = deleteStudentHandler;
window.openModal = openModal;
window.closeModal = closeModal;

// ========================== INIT ==========================
fetchStudents();

