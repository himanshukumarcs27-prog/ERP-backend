const STUDENT_API = "http://localhost:3000/api/students";
const SUBJECT_API = "http://localhost:3000/api/subjects";
const MARKS_API = "http://localhost:3000/api/results";

let students = [];
let subjects = [];

// Load students + subjects
async function init() {
  const sRes = await fetch(STUDENT_API);
  students = await sRes.json();

  const subRes = await fetch(SUBJECT_API);
  subjects = await subRes.json();

  loadDropdowns();
  fetchMarks();
}

// Fill dropdowns
function loadDropdowns() {
  const studentSelect = document.getElementById("studentSelect");
  const subjectSelect = document.getElementById("subjectSelect");

  studentSelect.innerHTML = `<option>Select Student</option>`;
  subjectSelect.innerHTML = `<option>Select Subject</option>`;

  students.forEach(s => {
    studentSelect.innerHTML += `<option value="${s._id}">${s.name}</option>`;
  });

  subjects.forEach(sub => {
    subjectSelect.innerHTML += `<option value="${sub._id}">${sub.name}</option>`;
  });
}

// Submit marks
async function submitMarks() {
  const studentId = document.getElementById("studentSelect").value;
  const subjectId = document.getElementById("subjectSelect").value;
  const marks = document.getElementById("marks").value;

  await fetch(MARKS_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ studentId, subjectId, marks })
  });

  alert("Marks added!");
  fetchMarks();
}

// Fetch marks
async function fetchMarks() {
  const res = await fetch(MARKS_API);
  const data = await res.json();

  const table = document.getElementById("marksTable");
  table.innerHTML = "";

  data.forEach(m => {
    table.innerHTML += `
      <tr>
        <td>${m.student?.name}</td>
        <td>${m.subject?.name}</td>
        <td>${m.marks}</td>
      </tr>
    `;
  });
}

// Init
init();