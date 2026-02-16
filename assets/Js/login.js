// Login functionality
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const form = document.querySelector("form");
const loginBtn = form?.querySelector(".btn");

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Toast functions
function showToastError(msg) {
  const toastError = document.querySelector(".my-toast-error");
  if (toastError) {
    toastError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2 fs-5"></i> ${msg}`;
    toastError.style.display = "block";
    setTimeout(() => {
      toastError.style.display = "none";
    }, 4000);
  }
}

function showToastSuccess(msg) {
  const toastSuccess = document.querySelector(".my-toast-success");
  if (toastSuccess) {
    toastSuccess.innerHTML = `<i class="bi bi-check-circle-fill me-2 fs-5"></i> ${msg}`;
    toastSuccess.style.display = "block";
    setTimeout(() => {
      toastSuccess.style.display = "none";
    }, 4000);
  }
}

// Form submission
if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Validate inputs
    if (!email.value.trim()) {
      showToastError("Email is required");
      email.focus();
      return;
    }

    if (!password.value) {
      showToastError("Password is required");
      password.focus();
      return;
    }

    if (!emailRegex.test(email.value)) {
      showToastError("Please enter a valid email address");
      email.focus();
      return;
    }

    // Disable button during request
    if (loginBtn) {
      loginBtn.disabled = true;
      loginBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Logging in...';
    }

    try {
      const response = await fetch(baseUrl + "/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      });

      if (!response.ok) {
        console.error(`HTTP Error: ${response.status}`);
        showToastError(`Server error: ${response.status}`);
        return;
      }

      const data = await response.json();
      console.log("Login response:", data);

      if (data.result === true && data.data?.token) {
        localStorage.setItem("token", data.data.token);
        sessionStorage.setItem("isLogin", "true");
        showToastSuccess("Login successful! Redirecting...");
        setTimeout(() => {
          location.href = "pages/dashboard.html";
        }, 1500);
        return;
      }

      showToastError(data.message || "Invalid email or password");
    } catch (error) {
      console.error("Login error:", error);
      showToastError(`Connection error: ${error.message}`);
    } finally {
      // Re-enable button
      if (loginBtn) {
        loginBtn.disabled = false;
        loginBtn.innerHTML = "Log in";
      }
    }
  });
}

// Email input validation
if (email) {
  email.addEventListener("input", () => {
    email.classList.remove("is-invalid");
  });

  email.addEventListener("blur", () => {
    if (email.value && !emailRegex.test(email.value)) {
      email.classList.add("is-invalid");
    } else {
      email.classList.remove("is-invalid");
    }
  });
}

// Password input validation
if (password) {
  password.addEventListener("input", () => {
    password.classList.remove("is-invalid");
  });

  password.addEventListener("blur", () => {
    if (password.value === "") {
      password.classList.add("is-invalid");
    } else {
      password.classList.remove("is-invalid");
    }
  });
}
  toastError.classList.add("show");

  setTimeout(() => toastError.classList.remove("show"), 4000);
}

function showToastSuccess(msg) {

  const toastSuccess = document.querySelector(".my-toast-success");
  let isRegister = sessionStorage.getItem("isRegister");
  if (isRegister) {
    toastSuccess.innerHTML = `<i class="bi bi-check-circle-fill me-2 fs-5"></i> ${msg}`;
    toastSuccess.classList.add("show");
    sessionStorage.removeItem("isRegister");
  }

  setTimeout(() => toastSuccess.classList.remove("show"), 4000);
}

document.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("isRegister")) {
    showToastSuccess("Register successful Please login.");
  }
});
