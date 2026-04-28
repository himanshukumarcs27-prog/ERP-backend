async function updateDashboard() {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:5000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const student = await response.json();

    // 1. Update Profile Section
    document.getElementById('header-student-name').innerText = student.name;

    document.getElementById('profile-pic').src =
      `https://ui-avatars.com/api/?name=${student.name}&background=0D8ABC&color=fff`;

    // 2. Welcome message
    const firstName = student.name.split(' ')[0];
    document.getElementById('welcome-name').innerText = firstName;

    console.log("Dashboard synced with backend ✅");

  } catch (error) {
    console.error("Failed to load backend data:", error);
  }
}

document.addEventListener('DOMContentLoaded', updateDashboard);