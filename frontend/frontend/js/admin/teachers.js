const API = "http://localhost:3000/api/teachers";

let teachers = [];

// LOAD DATA
async function fetchTeachers() {
  const res = await fetch(API);
  teachers = await res.json();
  displayTeachers(teachers);
}

// DISPLAY TABLE
function displayTeachers(data) {
  const table = document.getElementById("teacherTable");
  table.innerHTML = "";

  data.forEach(t => {
    table.innerHTML += `
      <tr>
        <td>${t.name}</td>
        <td>${t.email}</td>
        <td>${t.subject}</td>
        <td>
          <button onclick="deleteTeacher('${t._id}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

// SEARCH
document.getElementById("search").addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();

  const filtered = teachers.filter(t =>
    t.name.toLowerCase().includes(value)
  );

  displayTeachers(filtered);
});

// ADD TEACHER
async function addTeacher() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;

  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, subject })
  });

  closeModal();
  fetchTeachers();
}

// DELETE
async function deleteTeacher(id) {
  if (!confirm("Delete this teacher?")) return;

  await fetch(`${API}/${id}`, {
    method: "DELETE"
  });

  fetchTeachers();
}

// MODAL
function openModal() {
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// INIT
fetchTeachers();