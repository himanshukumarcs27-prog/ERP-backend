const API = "http://localhost:5000/api/auth/login";
const REGISTER_API = "http://localhost:5000/api/auth/register";

// 🔐 LOGIN
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message);
    return;
  }

  localStorage.setItem("token", data.token);

  const role = data.user?.role || "student";
  localStorage.setItem("role", role);

  // Redirect
  if (role === "admin") {
    window.location.href = "../admin/dashboard.html";
  } else if (role === "teacher") {
    window.location.href = "../teacher/dashboard.html";
  } else {
    window.location.href = "../student/dashboard.html";
  }
}

// 📝 REGISTER
async function register() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  if (!name || !email || !password || !role) {
    return alert("All fields required");
  }

  const res = await fetch(REGISTER_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, password, role })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Error");
    return;
  }

  alert("Registered successfully!");
  window.location.href = "login.html";
}