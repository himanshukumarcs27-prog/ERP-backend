
// ========================== IMPORT API ==========================
import {
  getSubjects,
  addSubject,
  deleteSubject
} from "../../api.js";

// ========================== GLOBAL ==========================
let subjects = [];

// ========================== LOAD SUBJECTS ==========================
async function fetchSubjects() {
  try {
    subjects = await getSubjects();
    displaySubjects(subjects);
  } catch (err) {
    console.error("Error fetching subjects:", err.message);
  }
}

// ========================== DISPLAY TABLE ==========================
function displaySubjects(data) {
  const table = document.getElementById("subjectTable");
  table.innerHTML = "";

  data.forEach(sub => {
    table.innerHTML += `
      <tr>
        <td>${sub.name}</td>
        <td>
          <button onclick="deleteSubjectHandler('${sub.id}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

// ========================== SEARCH ==========================
document.getElementById("search")?.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();

  const filtered = subjects.filter(s =>
    s.name.toLowerCase().includes(value)
  );

  displaySubjects(filtered);
});

// ========================== ADD SUBJECT ==========================
async function addSubjectHandler() {
  const name = document.getElementById("subjectName").value;

  if (!name) {
    alert("Enter subject name");
    return;
  }

  try {
    await addSubject({ name });

    closeModal();
    fetchSubjects();

  } catch (err) {
    console.error("Error adding subject:", err.message);
  }
}

// ========================== DELETE SUBJECT ==========================
async function deleteSubjectHandler(id) {
  if (!confirm("Delete this subject?")) return;

  try {
    await deleteSubject(id);
    fetchSubjects();
  } catch (err) {
    console.error("Error deleting subject:", err.message);
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
window.addSubjectHandler = addSubjectHandler;
window.deleteSubjectHandler = deleteSubjectHandler;
window.openModal = openModal;
window.closeModal = closeModal;

// ========================== INIT ==========================
fetchSubjects();
