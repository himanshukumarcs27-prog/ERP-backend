
// ========================== IMPORT API ==========================
import { getResults } from "../../api.js";

// ========================== GLOBAL ==========================
let chartInstance = null;

// ========================== LOAD RESULT ==========================
async function loadResult() {
  try {
    // 🔥 Get logged-in student ID (adjust if needed)
    const studentId = localStorage.getItem("studentId");

    if (!studentId) {
      alert("Student not found. Please login again.");
      return;
    }

    // ✅ Correct API call
    const data = await getResults(studentId);

    const table = document.getElementById("resultTable");

    let total = 0;
    let labels = [];
    let marksArr = [];

    table.innerHTML = "";

    data.forEach(r => {
      table.innerHTML += `
        <tr>
          <td>${r.subject?.name || "N/A"}</td>
          <td>${r.marks}</td>
        </tr>
      `;

      total += r.marks;
      labels.push(r.subject?.name || "N/A");
      marksArr.push(r.marks);
    });

    // ✅ Avoid division by zero
    const percentage = data.length ? total / data.length : 0;

    document.getElementById("total").innerText = total;
    document.getElementById("percentage").innerText = percentage.toFixed(2);

    // ========================== GRADE ==========================
    let grade = "F";
    if (percentage >= 90) grade = "A";
    else if (percentage >= 75) grade = "B";
    else if (percentage >= 60) grade = "C";

    document.getElementById("grade").innerText = grade;

    // ========================== CHART ==========================
    if (chartInstance) {
      chartInstance.destroy(); // 🔥 fix memory issue
    }

    chartInstance = new Chart(document.getElementById("chart"), {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Marks",
          data: marksArr
        }]
      }
    });

  } catch (err) {
    console.error("Error loading result:", err.message);
    alert("Failed to load results");
  }
}

// ========================== INIT ==========================
loadResult();

