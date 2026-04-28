
// ========================== IMPORT API ==========================
import { apiRequest } from "../../api.js";

// ================= LOAD CLASSES =================
async function loadClasses() {
  try {
    const data = await apiRequest("/classes", "GET", null, true);

    const classSelect = document.getElementById("classSelect");

    // 🔥 reset dropdown
    classSelect.innerHTML = `<option value="">Select Class</option>`;

    data.forEach(cls => {
      const option = document.createElement("option");
      option.value = cls.id;
      option.textContent = cls.name;
      classSelect.appendChild(option);
    });

  } catch (err) {
    console.error("Error loading classes:", err.message);
  }
}

// ================= LOAD SUBJECTS =================
async function loadSubjects() {
  const classId = document.getElementById("classSelect").value;
  if (!classId) return;

  try {
    const subjects = await apiRequest(
      `/subjects/class/${classId}`,
      "GET",
      null,
      true
    );

    const subjectSelect = document.getElementById("subjectSelect");

    subjectSelect.innerHTML = `<option value="">Select Subject</option>`;

    subjects.forEach(sub => {
      const option = document.createElement("option");
      option.value = sub.id;
      option.textContent = sub.name;
      subjectSelect.appendChild(option);
    });

  } catch (err) {
    console.error("Error loading subjects:", err.message);
  }
}

// ================= LOAD STUDENTS =================
async function loadStudents() {
  const classId = document.getElementById("classSelect").value;
  if (!classId) return;

  try {
    const students = await apiRequest(
      `/students?class_id=${classId}`,
      "GET",
      null,
      true
    );

    const table = document.getElementById("studentsTable");
    table.innerHTML = "";

    students.forEach(student => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${student.name}</td>
        <td>
          <input 
            type="number" 
            min="0" 
            max="100" 
            class="marks-input"
            data-student-id="${student.id}"
          />
        </td>
      `;

      table.appendChild(row);
    });

  } catch (err) {
    console.error("Error loading students:", err.message);
  }
}

// ================= SUBMIT MARKS =================
async function submitMarks() {
  const subjectId = document.getElementById("subjectSelect").value;

  if (!subjectId) {
    alert("Please select subject");
    return;
  }

  const inputs = document.querySelectorAll(".marks-input");
  const promises = [];

  inputs.forEach(input => {
    const studentId = input.dataset.studentId;
    const marks = input.value;

    if (!marks) return;

    promises.push(
      apiRequest(
        "/marks",
        "POST",
        {
          student_id: studentId,
          subject_id: subjectId,
          marks: Number(marks),
          exam_type: "midterm"
        },
        true
      )
    );
  });

  try {
    await Promise.all(promises);
    alert("✅ Marks submitted successfully");

  } catch (err) {
    console.error("Error submitting marks:", err.message);
    alert("❌ Failed to submit marks");
  }
}

// ================= EVENTS =================
document.getElementById("classSelect")?.addEventListener("change", () => {
  loadSubjects();
  loadStudents();
});

// ================= INIT =================
window.onload = () => {
  loadClasses();
};

// ================= GLOBAL =================
window.submitMarks = submitMarks;

