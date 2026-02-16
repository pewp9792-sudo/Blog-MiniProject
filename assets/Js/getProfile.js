// Get Profile
function getProfile(){
  fetch(baseUrl + "/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((item) => {
      // Update user name if elements exist
      const userElement = document.querySelector(".user");
      if (userElement) {
        userElement.innerHTML = `
            <h6 class="p-0 m-0 text-end text-main">${item.data.firstName} ${item.data.lastName}</h6>
            <small class="nav-text">${item.data.email}</small>`;
      }
  
      // Update profile avatar if elements exist
      const userProfileElement = document.querySelector(".userProfile");
      if (userProfileElement) {
        userProfileElement.innerHTML = `
            <img src="${item.data.avatar}"alt="no" class="img-fluid rounded-circle object-fit-cover" style="width: 40px; height: 40px">`;
      }

      // Update elements in dashboard/top-bar if they exist
      const userNameElement = document.getElementById("userName");
      if (userNameElement) {
        userNameElement.textContent = `${item.data.firstName} ${item.data.lastName}`;
      }
    });
}

// Only call if not on login page
if (typeof token !== 'undefined' && token) {
  getProfile();
}