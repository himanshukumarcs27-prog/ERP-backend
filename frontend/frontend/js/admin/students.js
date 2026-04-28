const API = "http://localhost:3000/api/students";

let students = [];

// LOAD DATA
async function fetchStudents() {
  const res = await fetch(API);
  students = await res.json();
  displayStudents(students);
}

// DISPLAY TABLE
function displayStudents(data) {
  const table = document.getElementById("studentTable");
  table.innerHTML = "";

  data.forEach(s => {
    table.innerHTML += `
      <tr>
        <td>${s.name}</td>
        <td>${s.email}</td>
        <td>${s.course}</td>
        <td>
          <button onclick="deleteStudent('${s._id}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

// SEARCH
document.getElementById("search").addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(value)
  );
  displayStudents(filtered);
});

// ADD STUDENT
async function addStudent() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const course = document.getElementById("course").value;

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, course })
  });

  closeModal();
  fetchStudents();
}

// DELETE STUDENT
async function deleteStudent(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  fetchStudents();
}

// MODAL
function openModal() {
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// INIT
fetchStudents();