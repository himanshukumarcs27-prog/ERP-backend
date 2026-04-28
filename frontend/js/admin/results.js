
// ========================== IMPORT API ==========================
import { getStudents, getResults } from "../../api.js";

// ========================== GLOBAL ==========================
let students = [];
let barChart = null;
let pieChart = null;

// ========================== INIT ==========================
async function init() {
  try {
    students = await getStudents();

    const select = document.getElementById("studentSelect");

    select.innerHTML = `<option value="">Select Student</option>`;

    students.forEach(s => {
      select.innerHTML += `<option value="${s.id}">${s.name}</option>`;
    });

    select.addEventListener("change", loadResults);

  } catch (err) {
    console.error("Error loading students:", err.message);
  }
}

// ========================== LOAD RESULTS ==========================
async function loadResults() {
  const studentId = document.getElementById("studentSelect").value;

  if (!studentId) return;

  try {
    const data = await getResults(studentId);

    const table = document.getElementById("resultTable");
    table.innerHTML = "";

    let total = 0;
    let subjects = [];
    let marksArr = [];

    data.forEach(r => {
      table.innerHTML += `
        <tr>
          <td>${r.subject?.name || "N/A"}</td>
          <td>${r.marks}</td>
        </tr>
      `;

      total += r.marks;
      subjects.push(r.subject?.name || "N/A");
      marksArr.push(r.marks);
    });

    const percentage = data.length ? (total / data.length) : 0;

    document.getElementById("total").innerText = total;
    document.getElementById("percentage").innerText = percentage.toFixed(2);

    // Grade logic
    let grade = "F";
    if (percentage >= 90) grade = "A";
    else if (percentage >= 75) grade = "B";
    else if (percentage >= 60) grade = "C";

    document.getElementById("grade").innerText = grade;

    renderCharts(subjects, marksArr);

  } catch (err) {
    console.error("Error loading results:", err.message);
  }
}

// ========================== CHARTS ==========================
function renderCharts(labels, data) {
  // Destroy old charts (important fix)
  if (barChart) barChart.destroy();
  if (pieChart) pieChart.destroy();

  barChart = new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Marks",
        data
      }]
    }
  });

  pieChart = new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: {
      labels,
      datasets: [{
        data
      }]
    }
  });
}

// ========================== INIT CALL ==========================
init();
