
// ========================== IMPORT API ==========================
import {
  getStudents,
  getSubjects,
  addMarks,
  getMarks
} from "../../api.js";

// ========================== GLOBAL ==========================
let students = [];
let subjects = [];

// ========================== INIT ==========================
async function init() {
  try {
    students = await getStudents();
    subjects = await getSubjects();

    loadDropdowns();
    fetchMarks();

  } catch (err) {
    console.error("Init error:", err.message);
  }
}

// ========================== DROPDOWNS ==========================
function loadDropdowns() {
  const studentSelect = document.getElementById("studentSelect");
  const subjectSelect = document.getElementById("subjectSelect");

  studentSelect.innerHTML = `<option value="">Select Student</option>`;
  subjectSelect.innerHTML = `<option value="">Select Subject</option>`;

  students.forEach(s => {
    studentSelect.innerHTML += `<option value="${s.id}">${s.name}</option>`;
  });

  subjects.forEach(sub => {
    subjectSelect.innerHTML += `<option value="${sub.id}">${sub.name}</option>`;
  });
}

// ========================== SUBMIT MARKS ==========================
async function submitMarks() {
  const studentId = document.getElementById("studentSelect").value;
  const subjectId = document.getElementById("subjectSelect").value;
  const marks = document.getElementById("marks").value;

  if (!studentId || !subjectId || !marks) {
    alert("Please fill all fields");
    return;
  }

  try {
    await addMarks({
      student_id: studentId,
      subject_id: subjectId,
      marks: Number(marks),
      exam_type: "midterm"
    });

    alert("✅ Marks added!");
    fetchMarks();

  } catch (err) {
    console.error("Error adding marks:", err.message);
  }
}

// ========================== FETCH MARKS ==========================
async function fetchMarks() {
  try {
    // If subject filter needed:
    const subjectId = document.getElementById("subjectSelect").value;

    const result = await getMarks(subjectId);

    const table = document.getElementById("marksTable");
    table.innerHTML = "";

    if (!result.data || result.data.length === 0) {
      table.innerHTML = `<tr><td colspan="3">No data found</td></tr>`;
      return;
    }

result.data.forEach(m => {
  table.innerHTML += `
    <tr>
      <td>${m.students?.name || "N/A"}</td>
      <td>${m.subjects?.name || "N/A"}</td>
      <td>${m.marks}</td>
      <td>${m.grade || "Not Generated"}</td>
    </tr>
  `;
});

  } catch (err) {
    console.error("Error fetching marks:", err.message);
  }
}

// ========================== EVENTS ==========================
document.getElementById("subjectSelect")
  ?.addEventListener("change", fetchMarks);

// ========================== GLOBAL ==========================
window.submitMarks = submitMarks;

// ========================== INIT ==========================
init();

