// Redirect to login if no token
if (!token) {
  location.href = "../index.html";
}

// Form elements
const profileForm = document.getElementById("profileForm");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const emailInput = document.getElementById("emailAddress");
const userIdInput = document.getElementById("userId");
const registeredDateInput = document.getElementById("registeredDate");

// Avatar upload elements
const avatarUpload = document.getElementById("avatarUpload");
const avatarUploadLabel = document.getElementById("avatarUploadLabel");
const avatarStatus = document.getElementById("avatarStatus");

// Error elements
const firstNameError = document.getElementById("firstNameError");
const lastNameError = document.getElementById("lastNameError");
const emailError = document.getElementById("emailError");

// Buttons
const editBtn = document.getElementById("editBtn");
const updateBtn = document.getElementById("updateBtn");
const cancelBtn = document.getElementById("cancelBtn");

// Display elements
const fullNameDisplay = document.getElementById("fullName");
const userEmailDisplay = document.getElementById("userEmail");
const userAvatarDisplay = document.getElementById("userAvatar");
const userNameTopBar = document.getElementById("userName");

// Store original values
let originalData = {};

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Load profile data
function loadProfile() {
  fetch(baseUrl + "/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then((res) => res.json())
  .then((item) => {
    if (item.result && item.data) {
      const data = item.data;
      
      // Store original data
      originalData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email
      };
      
      // Update display elements
      const fullName = `${data.firstName} ${data.lastName}`;
      fullNameDisplay.textContent = fullName;
      userEmailDisplay.textContent = data.email;
      
      // Update top bar username
      if (userNameTopBar) {
        userNameTopBar.textContent = fullName;
      }
      
      // Update form inputs
      firstNameInput.value = data.firstName;
      lastNameInput.value = data.lastName;
      emailInput.value = data.email;
      userIdInput.value = data.id;
      
      const registeredDate = new Date(data.registeredAt);
      registeredDateInput.value = registeredDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
      
      if (userAvatarDisplay && data.avatar) {
        userAvatarDisplay.src = data.avatar;
      }
    }
  })
  .catch(err => {
    console.error("Error loading profile:", err);
    showToast("Failed to load profile data", "error");
  });
}

// Enable edit mode
editBtn.addEventListener("click", () => {
  // Enable inputs
  firstNameInput.disabled = false;
  lastNameInput.disabled = false;
  emailInput.disabled = false;
  
  // Toggle buttons
  editBtn.style.display = "none";
  updateBtn.style.display = "inline-block";
  cancelBtn.style.display = "inline-block";
  
  // Focus first input
  firstNameInput.focus();
});

// Cancel editing
cancelBtn.addEventListener("click", () => {
  // Restore original values
  firstNameInput.value = originalData.firstName;
  lastNameInput.value = originalData.lastName;
  emailInput.value = originalData.email;
  
  // Clear errors
  firstNameError.textContent = "";
  lastNameError.textContent = "";
  emailError.textContent = "";
  avatarStatus.textContent = "";
  
  // Disable inputs
  firstNameInput.disabled = true;
  lastNameInput.disabled = true;
  emailInput.disabled = true;
  
  // Toggle buttons
  editBtn.style.display = "inline-block";
  updateBtn.style.display = "none";
  cancelBtn.style.display = "none";
});

// Handle avatar upload
avatarUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  
  if (!file) return;
  
  // Validate file type
  if (!file.type.startsWith("image/")) {
    showToast("Please select an image file", "error");
    avatarStatus.textContent = "Please select an image file";
    avatarStatus.style.color = "#dc3545";
    return;
  }
  
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    showToast("Image size must be less than 5MB", "error");
    avatarStatus.textContent = "Image too large (max 5MB)";
    avatarStatus.style.color = "#dc3545";
    return;
  }
  
  // Show preview immediately
  const reader = new FileReader();
  reader.onload = (e) => {
    userAvatarDisplay.src = e.target.result;
    avatarStatus.textContent = "Uploading...";
    avatarStatus.style.color = "#0d6efd";
  };
  reader.readAsDataURL(file);
  
  // Upload avatar
  const formData = new FormData();
  formData.append("avatar", file);
  
  // Try the avatar upload
  fetch(baseUrl + "/profile/avatar", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
  .then((res) => {
    console.log("Response status:", res.status);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
  .then((data) => {
    console.log("Upload response:", data);
    if (data.result) {
      showToast("Avatar uploaded successfully!", "success");
      avatarStatus.textContent = "✓ Avatar updated!";
      avatarStatus.style.color = "#198754";
      
      // Reload profile to get new avatar URL
      setTimeout(() => {
        loadProfile();
        avatarStatus.textContent = "";
      }, 2000);
    } else {
      const errorMsg = data.message || data.details || "Failed to upload avatar";
      showToast(errorMsg, "error");
      avatarStatus.textContent = "✗ " + errorMsg;
      avatarStatus.style.color = "#dc3545";
      // Restore original avatar
      loadProfile();
    }
  })
  .catch((err) => {
    console.error("Error uploading avatar:", err);
    const errorMsg = err.message || "Failed to upload avatar. Please try again.";
    showToast(errorMsg, "error");
    avatarStatus.textContent = "✗ Upload failed: " + errorMsg;
    avatarStatus.style.color = "#dc3545";
    // Restore original avatar
    loadProfile();
  });
});

// Validate form
function validateForm() {
  let isValid = true;
  
  // Clear previous errors
  firstNameError.textContent = "";
  lastNameError.textContent = "";
  emailError.textContent = "";
  
  // Validate first name
  if (!firstNameInput.value.trim()) {
    firstNameError.textContent = "First name is required";
    isValid = false;
  } else if (firstNameInput.value.trim().length < 2) {
    firstNameError.textContent = "First name must be at least 2 characters";
    isValid = false;
  }
  
  // Validate last name
  if (!lastNameInput.value.trim()) {
    lastNameError.textContent = "Last name is required";
    isValid = false;
  } else if (lastNameInput.value.trim().length < 2) {
    lastNameError.textContent = "Last name must be at least 2 characters";
    isValid = false;
  }
  
  // Validate email
  if (!emailInput.value.trim()) {
    emailError.textContent = "Email is required";
    isValid = false;
  } else if (!emailRegex.test(emailInput.value.trim())) {
    emailError.textContent = "Please enter a valid email address";
    isValid = false;
  }
  
  return isValid;
}

// Update profile
profileForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }
  
  // Disable button during request
  updateBtn.disabled = true;
  updateBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Updating...';
  
  const updatedData = {
    firstName: firstNameInput.value.trim(),
    lastName: lastNameInput.value.trim(),
    email: emailInput.value.trim()
  };
  
  fetch(baseUrl + "/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  })
  .then((res) => res.json())
  .then((data) => {
    if (data.result) {
      // Update original data
      originalData = {
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        email: updatedData.email
      };
      
      // Update display
      const fullName = `${updatedData.firstName} ${updatedData.lastName}`;
      fullNameDisplay.textContent = fullName;
      userEmailDisplay.textContent = updatedData.email;
      
      // Update top bar username
      if (userNameTopBar) {
        userNameTopBar.textContent = fullName;
      }
      
      avatarStatus.textContent = "";
      
      // Disable inputs
      firstNameInput.disabled = true;
      lastNameInput.disabled = true;
      emailInput.disabled = true;
      
      // Toggle buttons
      editBtn.style.display = "inline-block";
      updateBtn.style.display = "none";
      cancelBtn.style.display = "none";
      
      // Show success message
      showToast("Profile updated successfully!", "success");
    } else {
      showToast(data.message || "Failed to update profile", "error");
    }
  })
  .catch((err) => {
    console.error("Error updating profile:", err);
    showToast("Failed to update profile. Please try again.", "error");
  })
  .finally(() => {
    // Re-enable button
    updateBtn.disabled = false;
    updateBtn.innerHTML = '<i class="bi bi-check-circle me-1"></i> Update Profile';
  });
});

// Toast notification function
function showToast(message, type = "success") {
  const toastClass = type === "success" ? "my-toast-success" : "my-toast-error";
  const toast = document.querySelector(`.${toastClass}`);
  
  if (toast) {
    const icon = type === "success" ? "bi-check-circle-fill" : "bi-exclamation-circle-fill";
    toast.innerHTML = `<i class="bi ${icon} me-2 fs-5"></i> ${message}`;
    toast.style.display = "block";
    
    setTimeout(() => {
      toast.style.display = "none";
    }, 4000);
  }
}

// Load profile on page load
loadProfile();