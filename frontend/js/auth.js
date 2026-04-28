// ========================== IMPORT API ==========================
// FIXED PATH (same folder)
import {
  loginUser,
  registerUser,
  getCurrentUser
} from "./api.js";


// ================== 🔐 LOGIN ==================
async function login() {
  console.log("Login function triggered");

  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;
  const selectedRole = localStorage.getItem("selectedRole");

  if (!email || !password) {
    return alert("Email and Password required");
  }

  if (!selectedRole) {
    return alert("Please select role first");
  }

  try {
    const data = await loginUser({
      email,
      password,
      role: selectedRole
    });

    console.log("Login Success:", data);

    // Save token + role
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user?.role);

    redirectUser(data.user?.role);

  } catch (err) {
    console.error("Login Error FULL:", err);
    alert(err.message || "Login failed");
  }
}


// ================== 📝 REGISTER ==================
async function register() {
  const name = document.getElementById("name")?.value;
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;
  const role = document.getElementById("role")?.value;

  const roll_no = document.getElementById("roll_no")?.value || "";
  const course = document.getElementById("course")?.value || "";
  const semester = document.getElementById("semester")?.value || "";

  if (!name || !email || !password || !role) {
    return alert("All fields required");
  }

  try {
    await registerUser({
      name,
      email,
      password,
      role,
      roll_no,
      course,
      semester
    });

    alert("Registered successfully!");
    window.location.href = "login.html";

  } catch (err) {
    console.error("Register Error FULL:", err);
    alert(err.message || "Registration failed");
  }
}


// ================== 🔐 REDIRECT ==================
function redirectUser(role) {
  if (role === "admin") {
    window.location.href = "../admin/dashboard.html";
  } else if (role === "teacher") {
    window.location.href = "../teacher/dashboard.html";
  } else {
    window.location.href = "../student/dashboard.html";
  }
}


// ================== 🔒 PROTECTED CHECK ==================
async function checkAuth() {
  try {
    const user = await getCurrentUser();
    return user;
  } catch (err) {
    alert("Please login first");
    window.location.href = "../login.html";
  }
}


// ================== 🚀 EVENT BINDING ==================
document.addEventListener("DOMContentLoaded", () => {
  console.log("Auth JS Loaded");

  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");

  if (loginBtn) {
    loginBtn.addEventListener("click", login);
  }

  if (registerBtn) {
    registerBtn.addEventListener("click", register);
  }
});


// ================== 🌍 GLOBAL (OPTIONAL) ==================
window.login = login;
window.register = register;