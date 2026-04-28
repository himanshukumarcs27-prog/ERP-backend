// ========================== IMPORT API ==========================
import {
  getStudents,
  getSubjects,
  getMarks,
  addMarks,
  generateResults
} from "../api.js";

// ========================== GLOBAL ==========================
let students = [];
let subjects = [];
let chartInstance = null; // 🔥 prevent duplicate graph

// ========================== INIT ==========================
async function init() {
  console.log("Marks page loaded");

  try {
    const studentRes = await getStudents();
    const subjectRes = await getSubjects();

    students = studentRes.data || studentRes;
    subjects = subjectRes.data || subjectRes;

    loadDropdowns();

    loadGraph(); // 🔥 IMPORTANT (missing before)

  } catch (err) {
    console.error("Init error:", err);
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
  const student_id = document.getElementById("studentSelect").value;
  const subject_id = document.getElementById("subjectSelect").value;
  const marks = document.getElementById("marks").value;

  if (!student_id || !subject_id || !marks) {
    alert("⚠️ Please fill all fields");
    return;
  }

  try {
    await addMarks({
      student_id,
      subject_id,
      marks: Number(marks),
      exam_type: "midterm"
    });

    alert("✅ Marks saved successfully!");

    fetchMarks();
    loadGraph(); // 🔥 update graph after new marks

  } catch (err) {
    console.error("Error saving marks:", err);
  }
}

// ========================== FETCH MARKS ==========================
async function fetchMarks() {
  const subject_id = document.getElementById("subjectSelect").value;

  if (!subject_id) {
    document.getElementById("marksTable").innerHTML =
      `<tr><td colspan="4">Select subject first</td></tr>`;
    return;
  }

  try {
    const res = await getMarks(subject_id);
    const marksData = res.data || res;

    const table = document.getElementById("marksTable");
    table.innerHTML = "";

    if (!marksData || marksData.length === 0) {
      table.innerHTML = `<tr><td colspan="4">No data found</td></tr>`;
      return;
    }

    marksData.forEach(m => {
      table.innerHTML += `
        <tr>
          <td>${m.students?.name || "N/A"}</td>
          <td>${m.subjects?.name || "N/A"}</td>
          <td>${m.marks ?? 0}</td>
          <td>${m.grade || "Not Generated"}</td>
        </tr>
      `;
    });

  } catch (err) {
    console.error("Error fetching marks:", err);
  }
}

// ========================== GRAPH ==========================
async function loadGraph() {
  try {
    const class_id = 1; // 🔥 FIXED (replace later dynamically)

    const res = await fetch(`http://localhost:5000/api/results/analytics?class_id=${class_id}`);
    const data = await res.json();

    console.log("Graph Data:", data);

    if (!data.chartData) return;

    document.getElementById("avgMarks").innerText = data.avgMarks?.toFixed(2) || 0;
    document.getElementById("avgPercent").innerText = data.avgPercentage?.toFixed(2) || 0;

    const labels = data.chartData.map(d => d.name);
    const marks = data.chartData.map(d => d.marks);

    const ctx = document.getElementById("marksChart");

    // 🔥 destroy old chart
    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Student Marks",
          data: marks
        }]
      }
    });

  } catch (err) {
    console.error("Graph error:", err);
  }
}

// ========================== GENERATE RESULT ==========================
async function generateResult() {
  const class_id = 1;

  try {
    await generateResults(class_id);
    alert("✅ Result Generated!");

    fetchMarks();
    loadGraph(); // 🔥 update graph

  } catch (err) {
    console.error("Error generating result:", err);
    alert("❌ Error generating result");
  }
}

// ========================== EVENTS ==========================
document.addEventListener("DOMContentLoaded", () => {
  init();

  document.getElementById("subjectSelect")
    ?.addEventListener("change", fetchMarks);
});

// ========================== GLOBAL ==========================
window.submitMarks = submitMarks;
window.generateResult = generateResult;