import { getSubjects } from "../api.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const courses = await getSubjects();

    const container = document.getElementById("courses-container");
    container.innerHTML = "";

    if (!courses.length) {
      container.innerHTML = "<p>No courses found</p>";
      return;
    }

    courses.forEach((course) => {
      container.innerHTML += `
        <div class="card list-card">
          <h3>${course.name}</h3>
          <p>Code: ${course.code}</p>
        </div>
      `;
    });

  } catch (err) {
    console.error(err);
    alert("Failed to load courses");
  }
});