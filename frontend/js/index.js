
document.addEventListener("DOMContentLoaded", () => {
  const roleCards = document.querySelectorAll(".role-card");

  if (!roleCards.length) {
    console.warn("No role cards found");
    return;
  }

  roleCards.forEach((card) => {
    card.addEventListener("click", () => {
      const role = card.dataset.role; // cleaner than getAttribute

      if (!role) {
        console.error("Role not defined on card");
        return;
      }

      // Save role
      localStorage.setItem("selectedRole", role);

      // Redirect
      window.location.href = "/pages/auth/login.html"; // 🔥 absolute path for Vercel
    });
  });
});

