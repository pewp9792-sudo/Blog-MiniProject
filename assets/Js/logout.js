// Log out
const handleLogout = () => {
  fetch(baseUrl + "/auth/logout", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((item) => {
      if (item.result) {
        localStorage.removeItem("token");
        location.href = "../index.html";
      }
    })
    .catch(err => console.error("Logout error:", err));
};

// Handle multiple logout button selectors
const logoutButtons = [
  document.querySelector("#btnLogout"),
  document.querySelector("#logoutBtn"),
  document.querySelector(".logout-link")
];

logoutButtons.forEach(btn => {
  if (btn) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      handleLogout();
    });
  }
});
