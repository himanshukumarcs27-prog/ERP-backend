const STUDENT_API = "http://localhost:3000/api/students";
const RESULT_API = "http://localhost:3000/api/results";

let students = [];

// Load students
async function init() {
  const res = await fetch(STUDENT_API);
  students = await res.json();

  const select = document.getElementById("studentSelect");

  students.forEach(s => {
    select.innerHTML += `<option value="${s._id}">${s.name}</option>`;
  });

  select.addEventListener("change", loadResults);
}

// Load results
async function loadResults() {
  const studentId = document.getElementById("studentSelect").value;

  const res = await fetch(`${RESULT_API}/${studentId}`);
  const data = await res.json();

  const table = document.getElementById("resultTable");
  table.innerHTML = "";

  let total = 0;
  let subjects = [];
  let marksArr = [];

  data.forEach(r => {
    table.innerHTML += `
      <tr>
        <td>${r.subject.name}</td>
        <td>${r.marks}</td>
      </tr>
    `;

    total += r.marks;
    subjects.push(r.subject.name);
    marksArr.push(r.marks);
  });

  const percentage = total / data.length;

  document.getElementById("total").innerText = total;
  document.getElementById("percentage").innerText = percentage.toFixed(2);

  // Grade logic
  let grade = "F";
  if (percentage >= 90) grade = "A";
  else if (percentage >= 75) grade = "B";
  else if (percentage >= 60) grade = "C";

  document.getElementById("grade").innerText = grade;

  renderCharts(subjects, marksArr);
}

// Charts
function renderCharts(labels, data) {

  new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Marks",
        data
      }]
    }
  });

  new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: {
      labels,
      datasets: [{
        data
      }]
    }
  });
}

// Init
init();