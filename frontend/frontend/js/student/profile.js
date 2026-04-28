const API = "http://localhost:3000/api/auth/me";

async function loadProfile() {
  const res = await fetch(API);
  const user = await res.json();

  document.getElementById("name").innerText = user.name;
  document.getElementById("email").innerText = user.email;
}

loadProfile();