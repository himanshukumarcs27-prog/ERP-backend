const STUDENT_API = "http://localhost:3000/api/students";
const SUBJECT_API = "http://localhost:3000/api/subjects";
const RESULT_API = "http://localhost:3000/api/results";

let students = [];
let subjects = [];

// INIT
async function init() {
  const sRes = await fetch(STUDENT_API);
  students = await sRes.json();

  const subRes = await fetch(SUBJECT_API);
  subjects = await subRes.json();

  loadDropdowns();
  fetchMarks();
}

// DROPDOWNS
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

// ADD MARKS
async function submitMarks() {
  const studentId = document.getElementById("studentSelect").value;
  const subjectId = document.getElementById("subjectSelect").value;
  const marks = document.getElementById("marks").value;

  await fetch(RESULT_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ studentId, subjectId, marks })
  });

  alert("Marks saved!");
  fetchMarks();
}

// FETCH MARKS
async function fetchMarks() {
  const res = await fetch(RESULT_API);
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

// START
init();