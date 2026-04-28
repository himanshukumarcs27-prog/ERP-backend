const API = "http://localhost:3000/api/subjects";

let subjects = [];

// LOAD SUBJECTS
async function fetchSubjects() {
  const res = await fetch(API);
  subjects = await res.json();
  displaySubjects(subjects);
}

// DISPLAY TABLE
function displaySubjects(data) {
  const table = document.getElementById("subjectTable");
  table.innerHTML = "";

  data.forEach(sub => {
    table.innerHTML += `
      <tr>
        <td>${sub.name}</td>
        <td>
          <button onclick="deleteSubject('${sub._id}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

// SEARCH
document.getElementById("search").addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();

  const filtered = subjects.filter(s =>
    s.name.toLowerCase().includes(value)
  );

  displaySubjects(filtered);
});

// ADD SUBJECT
async function addSubject() {
  const name = document.getElementById("subjectName").value;

  if (!name) return alert("Enter subject name");

  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name })
  });

  closeModal();
  fetchSubjects();
}

// DELETE SUBJECT
async function deleteSubject(id) {
  if (!confirm("Delete this subject?")) return;

  await fetch(`${API}/${id}`, {
    method: "DELETE"
  });

  fetchSubjects();
}

// MODAL
function openModal() {
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// INIT
fetchSubjects();